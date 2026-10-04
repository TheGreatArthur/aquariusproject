/**
 * Calculs du globe de l'accueil : rotation, visibilité, taille des repères, poissons d'une zone
 */

import { geoDistance } from 'd3-geo';

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Ramène une longitude dans [-180, 180[ */
export const wrapLongitude = (lon) => ((((lon + 180) % 360) + 360) % 360) - 180;

/**
 * Rotation [λ, φ] après un glissement de (dx, dy) pixels : la surface suit le doigt, quel que soit le zoom ;
 * la latitude s'arrête aux pôles pour que le globe ne passe pas la tête en bas
 */
export function dragRotation ([lambda, phi], dx, dy, radius) {
  const degreesPerPixel = 180 / (Math.PI * radius);
  return [wrapLongitude(lambda + dx * degreesPerPixel), clamp(phi - dy * degreesPerPixel, -90, 90)];
}

/** Rotation qui amène un point [longitude, latitude] au centre du globe */
export const rotationTo = ([lon, lat]) => [wrapLongitude(-lon), clamp(-lat, -90, 90)];

/** Étape d'une rotation animée vers une cible, par le plus court chemin en longitude (t de 0 à 1) */
export function interpolateRotation ([l0, p0], [l1, p1], t) {
  const dl = wrapLongitude(l1 - l0);
  return [wrapLongitude(l0 + dl * t), p0 + (p1 - p0) * t];
}

/** Vrai si le point est sur la face visible du globe (avec une marge pour ne pas dessiner sur le bord) */
export const isVisible = ([lambda, phi], point, margin = 0.04) =>
  geoDistance([-lambda, -phi], point) < Math.PI / 2 - margin;

export const clampZoom = (zoom) => clamp(zoom, MIN_ZOOM, MAX_ZOOM);

/** Rayon d'un repère (en pixels CSS) selon le nombre d'espèces de la zone */
export const markerRadius = (count) => 4 + Math.sqrt(count) * 1.7;

/**
 * Repère le plus proche d'un point de l'écran parmi les repères dessinés, à moins de `slop` pixels de son bord
 * @param markers [{ zone, x, y, r }]
 */
export function hitMarker (markers, x, y, slop = 6) {
  let best = null;
  for (const m of markers) {
    const d = Math.hypot(m.x - x, m.y - y) - m.r;
    if (d <= slop && (!best || d < best.d))
      best = { zone: m.zone, d };
  }
  return best?.zone ?? null;
}

/** Poissons du catalogue présents dans une zone, triés par nom commun */
export function zoneFish (zone, poissons = []) {
  const names = new Set(zone?.especes ?? []);
  return poissons
    .filter((p) => names.has(p.nom_scientifique))
    .sort((a, b) => a.nom_commun.localeCompare(b.nom_commun, 'fr'));
}

/** Zones regroupées par domaine biogéographique, les plus riches en espèces d'abord */
export function zonesByRealm (zones = []) {
  const groups = new Map();
  for (const zone of [...zones].sort((a, b) => b.especes.length - a.especes.length || a.nom.localeCompare(b.nom, 'fr'))) {
    if (!groups.has(zone.royaume))
      groups.set(zone.royaume, []);
    groups.get(zone.royaume).push(zone);
  }
  return [...groups].map(([royaume, liste]) => ({ royaume, zones: liste }))
    .sort((a, b) => b.zones.length - a.zones.length);
}
