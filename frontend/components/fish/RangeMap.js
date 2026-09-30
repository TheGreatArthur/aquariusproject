'use client';

import { useEffect, useMemo, useState } from 'react';
import { geoBounds, geoGraticule10, geoMercator, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';

const WIDTH = 720;
const HEIGHT = 440;
const GLOBE = 92;

// Fond de carte Natural Earth (scripts/build-world-map.sh), chargé une seule fois pour toutes les fiches
let worldPromise;
export function loadWorld () {
  worldPromise ??= fetch('/maps/world-50m.json')
    .then((res) => res.json())
    .then((topo) => ({
      pays: feature(topo, topo.objects.pays).features,
      lacs: feature(topo, topo.objects.lacs).features,
      fleuves: feature(topo, topo.objects.fleuves).features,
    }));
  return worldPromise;
}

export function useWorld () {
  const [world, setWorld] = useState(null);
  useEffect(() => {
    let alive = true;
    loadWorld().then((w) => alive && setWorld(w)).catch(() => {});
    return () => { alive = false; };
  }, []);
  return world;
}

/**
 * Emprise à afficher : les observations si elles existent, sinon les pays d'origine,
 * élargie pour garder du contexte autour des petites aires de répartition
 */
function extent (points, countries) {
  let [[west, south], [east, north]] = points.length
    ? [[Math.min(...points.map((p) => p[0])), Math.min(...points.map((p) => p[1]))],
       [Math.max(...points.map((p) => p[0])), Math.max(...points.map((p) => p[1]))]]
    : geoBounds({ type: 'FeatureCollection', features: countries });

  const minLon = 10, minLat = 7;
  const padLon = Math.max((minLon - (east - west)) / 2, 0) + (east - west) * 0.18;
  const padLat = Math.max((minLat - (north - south)) / 2, 0) + (north - south) * 0.18;
  return {
    west: west - padLon,
    east: east + padLon,
    south: Math.max(south - padLat, -75),
    north: Math.min(north + padLat, 80),
  };
}

/**
 * Carte de l'aire de répartition naturelle : pays d'origine surlignés, fleuves et lacs,
 * observations géolocalisées (GBIF), et un globe de situation
 */
export default function RangeMap ({ points = [], pays = [], label }) {
  const world = useWorld();

  const layers = useMemo(() => {
    if (!world)
      return null;
    const native = new Set(pays);
    const countries = world.pays.filter((f) => native.has(f.properties.iso));
    const { west, east, south, north } = extent(points, countries);
    const corners = [[west, south], [east, south], [east, north], [west, north]];
    const projection = geoMercator()
      .fitExtent([[12, 12], [WIDTH - 12, HEIGHT - 12]], { type: 'MultiPoint', coordinates: corners });
    const path = geoPath(projection);

    const globe = geoOrthographic().scale(GLOBE / 2 - 2).translate([GLOBE / 2, GLOBE / 2])
      .rotate([-(west + east) / 2, -(south + north) / 2]).clipAngle(90);
    const globePath = geoPath(globe);

    return {
      graticule: path(geoGraticule10()),
      // Pays d'origine dessinés en dernier : leur contour reste visible (et la Guyane passe devant la France)
      countries: world.pays
        .map((f) => ({ id: f.properties.iso, native: native.has(f.properties.iso), d: path(f) }))
        .sort((a, b) => a.native - b.native),
      lakes: world.lacs.map((f, i) => ({ id: i, d: path(f) })),
      rivers: world.fleuves.map((f, i) => ({ id: i, d: path(f) })),
      dots: points.map((p) => projection(p)).filter(Boolean),
      globe: {
        land: world.pays
          .map((f) => ({ id: f.properties.iso, native: native.has(f.properties.iso), d: globePath(f) }))
          .sort((a, b) => a.native - b.native),
        frame: globePath({ type: 'Polygon', coordinates: [[...corners, corners[0]].reverse()] }),
      },
    };
  }, [world, points, pays]);

  if (!layers)
    return <div className="aspect-[720/440] w-full animate-pulse rounded-xl bg-surface-elevated"/>;

  // Points plus gros quand ils sont rares (espèces connues de quelques localités seulement)
  const r = points.length < 5 ? 3.2 : 1.9;

  return (
    <figure className="relative overflow-hidden rounded-xl border border-border bg-[#040a11]">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="block h-auto w-full" role="img" aria-label={label}>
        <defs>
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.4"/>
          </filter>
        </defs>
        <path d={layers.graticule} fill="none" stroke="#10202e" strokeWidth="0.6"/>
        {layers.countries.map((c) => c.d && (
          <path key={c.id} d={c.d} fill={c.native ? 'rgba(45, 212, 191, 0.13)' : '#0d1a26'}
                stroke={c.native ? 'rgba(94, 234, 212, 0.45)' : '#1c2e40'} strokeWidth={c.native ? 0.9 : 0.5}/>
        ))}
        {layers.rivers.map((r) => r.d && (
          <path key={r.id} d={r.d} fill="none" stroke="#3b8fc2" strokeOpacity="0.85" strokeWidth="1.2"
                strokeLinecap="round" strokeLinejoin="round"/>
        ))}
        {layers.lakes.map((l) => l.d && <path key={l.id} d={l.d} fill="#15496a" stroke="#3b8fc2" strokeWidth="0.5"/>)}
        <g fill="#5EEAD4">
          <g filter="url(#dot-glow)" opacity="0.55">
            {layers.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r * 1.8}/>)}
          </g>
          {layers.dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} stroke="#050B12" strokeWidth="0.5"/>)}
        </g>
      </svg>

      <svg viewBox={`0 0 ${GLOBE} ${GLOBE}`} aria-hidden="true"
           className="absolute right-3 top-3 w-16 sm:w-[5.75rem]">
        <circle cx={GLOBE / 2} cy={GLOBE / 2} r={GLOBE / 2 - 2} fill="#07121c" stroke="#1c2e40"/>
        {layers.globe.land.map((c) => c.d && (
          <path key={c.id} d={c.d} fill={c.native ? '#2DD4BF' : '#1a2c3d'} fillOpacity={c.native ? 0.7 : 1}/>
        ))}
        {layers.globe.frame && <path d={layers.globe.frame} fill="none" stroke="#5EEAD4" strokeWidth="1.2"/>}
      </svg>
    </figure>
  );
}
