/**
 * Calculs du globe de l'accueil : rotation, visibilité, taille des repères, poissons d'une zone
 */

import { geoDistance } from 'd3-geo';

/** [longitude, latitude], or a globe rotation [λ, φ], in degrees */
type Pair = [number, number];

/** Freshwater ecoregion of public/maps/ecoregions.json */
export interface Zone {
  id: number;
  nom: string;
  nom_feow: string;
  royaume: string;
  habitat: string;
  url: string;
  point: Pair;
  especes: string[];
  observations?: Pair[];
}

/** Marker drawn on the globe, in CSS pixels */
export interface Marker { zone: Zone, x: number, y: number, r: number }

type Fish = { nom_commun: string, nom_scientifique: string };

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Ramène une longitude dans [-180, 180[ */
export const wrapLongitude = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;

/**
 * Rotation [λ, φ] après un glissement de (dx, dy) pixels : la surface suit le doigt, quel que soit le zoom ;
 * la latitude s'arrête aux pôles pour que le globe ne passe pas la tête en bas
 */
export function dragRotation ([lambda, phi]: Pair, dx: number, dy: number, radius: number): Pair {
  const degreesPerPixel = 180 / (Math.PI * radius);
  return [wrapLongitude(lambda + dx * degreesPerPixel), clamp(phi - dy * degreesPerPixel, -90, 90)];
}

/** Rotation qui amène un point [longitude, latitude] au centre du globe */
export const rotationTo = ([lon, lat]: Pair): Pair => [wrapLongitude(-lon), clamp(-lat, -90, 90)];

/** Étape d'une rotation animée vers une cible, par le plus court chemin en longitude (t de 0 à 1) */
export function interpolateRotation ([l0, p0]: Pair, [l1, p1]: Pair, t: number): Pair {
  const dl = wrapLongitude(l1 - l0);
  return [wrapLongitude(l0 + dl * t), p0 + (p1 - p0) * t];
}

/** Vrai si le point est sur la face visible du globe (avec une marge pour ne pas dessiner sur le bord) */
export const isVisible = ([lambda, phi]: Pair, point: Pair, margin = 0.04) =>
  geoDistance([-lambda, -phi], point) < Math.PI / 2 - margin;

export const clampZoom = (zoom: number) => clamp(zoom, MIN_ZOOM, MAX_ZOOM);

/** Rayon d'un repère (en pixels CSS) selon le nombre d'espèces de la zone */
export const markerRadius = (count: number) => 4 + Math.sqrt(count) * 1.7;

/** Repère le plus proche d'un point de l'écran parmi les repères dessinés, à moins de `slop` pixels de son bord */
export function hitMarker (markers: Marker[], x: number, y: number, slop = 6) {
  let best: { zone: Zone, d: number } | null = null;
  for (const m of markers) {
    const d = Math.hypot(m.x - x, m.y - y) - m.r;
    if (d <= slop && (!best || d < best.d))
      best = { zone: m.zone, d };
  }
  return best?.zone ?? null;
}

/** Poissons du catalogue présents dans une zone, triés par nom commun */
export function zoneFish<T extends Fish> (zone: Zone | null, poissons: T[] = []) {
  const names = new Set(zone?.especes ?? []);
  return poissons
    .filter((p) => names.has(p.nom_scientifique))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, 'fr'));
}

/** Zones regroupées par domaine biogéographique, les plus riches en espèces d'abord */
export function zonesByRealm (zones: Zone[] = []) {
  const groups = new Map<string, Zone[]>();
  for (const zone of [...zones].sort((a, b) => b.especes.length - a.especes.length || a.nom.localeCompare(b.nom, 'fr'))) {
    if (!groups.has(zone.royaume))
      groups.set(zone.royaume, []);
    groups.get(zone.royaume)!.push(zone);
  }
  return [...groups].map(([royaume, liste]) => ({ royaume, zones: liste }))
    .sort((a, b) => b.zones.length - a.zones.length);
}
