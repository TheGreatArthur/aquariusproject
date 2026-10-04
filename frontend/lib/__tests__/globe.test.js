import { describe, expect, it } from 'vitest';

import {
  clampZoom, dragRotation, hitMarker, interpolateRotation, isVisible, markerRadius, MAX_ZOOM, rotationTo,
  wrapLongitude, zoneFish, zonesByRealm,
} from '@/lib/globe';

describe('wrapLongitude', () => {
  it('keeps longitudes between -180 and 180', () => {
    expect(wrapLongitude(190)).toBe(-170);
    expect(wrapLongitude(-190)).toBe(170);
    expect(wrapLongitude(45)).toBe(45);
    expect(wrapLongitude(540)).toBe(-180);
  });
});

describe('dragRotation', () => {
  it('moves the surface with the pointer at any zoom', () => {
    const radius = 180 / Math.PI; // un degré par pixel
    expect(dragRotation([0, 0], 10, 0, radius)).toEqual([10, 0]);
    expect(dragRotation([0, 0], 0, 10, radius)).toEqual([0, -10]);
    // Deux fois plus grand (zoom) : deux fois moins de degrés par pixel
    expect(dragRotation([0, 0], 10, 0, radius * 2)).toEqual([5, 0]);
  });

  it('stops at the poles and wraps the longitude', () => {
    const radius = 180 / Math.PI;
    expect(dragRotation([0, 80], 0, -30, radius)[1]).toBe(90);
    expect(dragRotation([175, 0], 10, 0, radius)[0]).toBe(-175);
  });
});

describe('rotationTo', () => {
  it('brings a point to the centre of the globe', () => {
    expect(rotationTo([-60, -3])).toEqual([60, 3]);
    expect(isVisible(rotationTo([34, -13]), [34, -13])).toBe(true);
  });
});

describe('interpolateRotation', () => {
  it('turns the short way across the antimeridian', () => {
    expect(interpolateRotation([170, 0], [-170, 10], 0.5)).toEqual([-180, 5]);
    expect(interpolateRotation([10, 0], [30, 20], 1)).toEqual([30, 20]);
  });
});

describe('isVisible', () => {
  it('shows the front hemisphere only', () => {
    // Globe centré sur l'Amazonie
    const rotation = rotationTo([-60, -3]);
    expect(isVisible(rotation, [-67, 1])).toBe(true);
    expect(isVisible(rotation, [102, 4])).toBe(false);
    // Un point au bord exact est caché par la marge
    expect(isVisible(rotation, [30, -3])).toBe(false);
  });
});

describe('markers', () => {
  it('grows with the number of species', () => {
    expect(markerRadius(1)).toBeLessThan(markerRadius(4));
    expect(markerRadius(29)).toBeLessThan(15);
  });

  it('picks the closest marker under the pointer', () => {
    const markers = [{ zone: 'a', x: 0, y: 0, r: 5 }, { zone: 'b', x: 20, y: 0, r: 5 }];
    expect(hitMarker(markers, 2, 0)).toBe('a');
    expect(hitMarker(markers, 17, 0)).toBe('b');
    expect(hitMarker(markers, 10, 30)).toBeNull();
  });

  it('clamps the zoom', () => {
    expect(clampZoom(0.5)).toBe(1);
    expect(clampZoom(100)).toBe(MAX_ZOOM);
  });
});

const zones = [
  { id: 1, nom: 'Rio Negro', royaume: 'Néotropical', especes: ['Paracheirodon axelrodi', 'Pterophyllum altum'] },
  { id: 2, nom: 'Lac Malawi', royaume: 'Afrotropical', especes: ['Aulonocara baenschi'] },
  { id: 3, nom: 'Xingu', royaume: 'Néotropical', especes: ['Hypancistrus zebra'] },
];

describe('zoneFish', () => {
  it('lists the catalogue fish of a zone by common name', () => {
    const poissons = [
      { nom_commun: 'Scalaire altum', nom_scientifique: 'Pterophyllum altum' },
      { nom_commun: 'Cardinalis', nom_scientifique: 'Paracheirodon axelrodi' },
      { nom_commun: 'Pléco zèbre', nom_scientifique: 'Hypancistrus zebra' },
    ];
    expect(zoneFish(zones[0], poissons).map((p) => p.nom_commun)).toEqual(['Cardinalis', 'Scalaire altum']);
    expect(zoneFish(null, poissons)).toEqual([]);
  });
});

describe('zonesByRealm', () => {
  it('groups zones by realm, richest first', () => {
    expect(zonesByRealm(zones).map((g) => [g.royaume, g.zones.map((z) => z.id)])).toEqual([
      ['Néotropical', [1, 3]],
      ['Afrotropical', [2]],
    ]);
  });
});
