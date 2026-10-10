'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useSWR from 'swr';
import { useReducedMotion } from 'framer-motion';
import { geoGraticule10, geoOrthographic, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { ArrowLeft, ExternalLink, Minus, Plus, RotateCcw } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import Reveal from '@/components/Reveal';
import { fishImage } from '@/lib/fish';
import {
  clampZoom, dragRotation, hitMarker, interpolateRotation, isVisible, markerRadius, rotationTo, wrapLongitude,
  zoneFish, zonesByRealm,
} from '@/lib/globe';

// Couleurs de la carte de répartition des fiches (components/fish/RangeMap.js)
const COLORS = {
  ocean: '#07121c', graticule: '#10202e', land: '#0d1a26', border: '#1c2e40', lake: '#15496a', river: '#3b8fc2',
  accent: '#2DD4BF', accentGlow: '#5EEAD4', background: '#050B12',
};
// Vue de départ : l'Amazonie, la région la plus riche du catalogue
const START = rotationTo([-58, -6]);
const SPIN = 4; // degrés par seconde, tant que personne ne touche au globe
const FLIGHT = 700; // durée du recentrage sur une zone choisie (ms)
const FOCUS_ZOOM = 2.2; // zoom minimal sur une zone choisie, pour distinguer ses observations
const graticule = geoGraticule10();

// English names of the FEOW realms and major habitat types (the zone names come in English as nom_feow)
const REALMS_EN = {
  Afrotropical: 'Afrotropical', Australasien: 'Australasian', Indomalais: 'Indo-Malayan', Néarctique: 'Nearctic',
  Néotropical: 'Neotropical', Paléarctique: 'Palearctic',
};
const HABITATS_EN = {
  'deltas de grands fleuves': 'large river deltas',
  'eaux de montagne': 'montane freshwaters',
  'eaux des régions arides et bassins fermés': 'xeric freshwaters and endorheic basins',
  'fleuves côtiers tempérés': 'temperate coastal rivers',
  'fleuves côtiers tropicaux et subtropicaux': 'tropical and subtropical coastal rivers',
  'grands lacs': 'large lakes',
  'plaines inondables et zones humides tempérées': 'temperate floodplain rivers and wetlands',
  'plaines inondables et zones humides tropicales et subtropicales': 'tropical and subtropical floodplain rivers and wetlands',
  'rivières d\'altitude tempérées': 'temperate upland rivers',
  'rivières d\'altitude tropicales et subtropicales': 'tropical and subtropical upland rivers',
  'îles océaniques': 'oceanic islands',
};

/** Netteté du canevas : la densité de l'écran, plafonnée à 2 (au-delà, le dessin coûte plus qu'il ne gagne) */
const pixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);

/** Rayon du globe en pixels CSS : la largeur du canevas, moins une marge pour son contour, fois le zoom */
const globeRadius = ({ size, zoom }) => (size / 2 - 4) * zoom;

/** Vrai dès que l'élément approche de l'écran : le fond de carte n'est chargé qu'à ce moment */
function useNearScreen (ref) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near)
      return undefined;
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '400px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, near]);
  return near;
}

function ZoneList ({ zones, onSelect }) {
  const { t } = useI18n();
  const groups = useMemo(() => zonesByRealm(zones), [zones]);
  const especes = useMemo(() => new Set(zones.flatMap((z) => z.especes)).size, [zones]);

  return (
    <>
      <div className="border-b border-border/70 p-5 sm:p-6">
        <p className="font-display text-xl font-semibold">
          <span className="tabular-nums">{zones.length}</span> zones, <span className="tabular-nums">{especes}</span>{' '}
          {t('espèces', 'species')}
        </p>
        <p className="mt-1 text-sm text-muted">{t('Touchez un repère sur le globe ou choisissez une zone.', 'Tap a marker on the globe or pick a zone.')}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 [scrollbar-width:thin] sm:p-6">
        {groups.map(({ royaume, zones: liste }) => (
          <section key={royaume} aria-label={t(`Domaine ${royaume}`, `${REALMS_EN[royaume] ?? royaume} realm`)}>
            <h4 className="text-xs uppercase tracking-wider text-muted">{t(royaume, REALMS_EN[royaume] ?? royaume)}</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {liste.map((zone) => (
                <li key={zone.id}>
                  <button type="button" onClick={() => onSelect(zone)}
                          className="chip gap-1.5 hover:border-accent/50 hover:text-foreground">
                    {t(zone.nom, zone.nom_feow)}
                    <span className="tabular-nums text-accent-glow">{zone.especes.length}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}

function ZoneDetails ({ zone, poissons, onBack }) {
  const { t, href } = useI18n();
  const fish = zoneFish(zone, poissons);

  return (
    <>
      <div className="border-b border-border/70 p-5 sm:p-6">
        <button type="button" onClick={onBack}
                className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4"/> {t('Toutes les zones', 'All zones')}
        </button>
        <h3 className="mt-3 text-xl font-semibold sm:text-2xl" aria-live="polite">{t(zone.nom, zone.nom_feow)}</h3>
        <p className="mt-1 text-sm text-muted first-letter:uppercase">
          {t(`${zone.habitat}, domaine ${zone.royaume.toLowerCase()}`,
            `${HABITATS_EN[zone.habitat] ?? zone.habitat}, ${REALMS_EN[zone.royaume] ?? zone.royaume} realm`)}
        </p>
        <p className="mt-3 text-sm">
          <span className="font-display text-lg font-semibold tabular-nums">{zone.especes.length}</span>
          {zone.especes.length > 1 ? t(' espèces du catalogue', ' species in the catalogue') : t(' espèce du catalogue', ' species in the catalogue')}
        </p>
      </div>
      <ul className="min-h-0 flex-1 divide-y divide-border/60 overflow-y-auto [scrollbar-width:thin]">
        {fish.map((p) => (
          <li key={p.id}>
            <Link href={href(`/poissons/${p.id}`)}
                  className="flex items-center gap-4 px-5 py-3 transition hover:bg-surface-elevated/60 sm:px-6">
              <span className="relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-lg bg-surface-elevated">
                <Image src={fishImage(p)} alt="" fill sizes="64px" className="object-cover"/>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{p.nom_commun}</span>
                <span className="block truncate text-xs italic text-muted">{p.nom_scientifique}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="border-t border-border/70 px-5 py-3 text-xs text-muted sm:px-6">
        {t('Nom FEOW', 'FEOW name')}&nbsp;: {zone.nom_feow}.{' '}
        <a href={zone.url} target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-1 underline-offset-4 hover:text-accent-glow hover:underline">
          {t('Fiche de l\'écorégion', 'Ecoregion profile')} <ExternalLink className="h-3 w-3"/>
        </a>
      </p>
    </>
  );
}

/**
 * Globe des écorégions d'eau douce : on le fait tourner, on touche une zone, ses poissons s'affichent
 */
export default function FishGlobe () {
  const sectionRef = useRef(null);
  const near = useNearScreen(sectionRef);
  const reduceMotion = useReducedMotion();
  const { t } = useI18n();

  const { data: poissonsData } = useSWR(near ? '/api/poissons' : null);
  const { data: ecoregions } = useSWR(near ? '/maps/ecoregions.json' : null);
  // Fond de carte allégé au 1:110m (scripts/build-globe-map.sh) : le globe est redessiné à chaque image
  const { data: topo } = useSWR(near ? '/maps/globe-110m.json' : null);
  const world = useMemo(() => topo && {
    terres: feature(topo, topo.objects.terres).features,
    lacs: feature(topo, topo.objects.lacs).features,
    fleuves: feature(topo, topo.objects.fleuves).features,
  }, [topo]);

  const zones = useMemo(() => ecoregions?.zones ?? [], [ecoregions]);
  const [selectedId, setSelectedId] = useState(null);
  const selected = zones.find((z) => z.id === selectedId) ?? null;
  const [tooltip, setTooltip] = useState(null);

  // État du dessin, lu à chaque image sans repasser par React
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const view = useRef({
    rotation: START, zoom: 1, size: 0, spinning: true, onScreen: false, dirty: true, flight: null, hovered: null,
  });
  const markers = useRef([]);
  const pointers = useRef(new Map());
  const drag = useRef({ moved: 0 });
  const font = useRef('sans-serif');

  useEffect(() => {
    view.current.spinning = !reduceMotion;
  }, [reduceMotion]);

  const redraw = () => { view.current.dirty = true; };
  const stopSpin = () => { view.current.spinning = false; };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const { size, rotation, zoom, hovered: hoveredId } = view.current;
    if (!canvas || !size || !world)
      return;
    const dpr = pixelRatio();
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    const projection = geoOrthographic().translate([size / 2, size / 2]).scale(globeRadius(view.current))
      .rotate(rotation).clipAngle(90).precision(0.6);
    const path = geoPath(projection, ctx);
    const layer = (features, { fill, stroke, width = 0.5 }) => {
      ctx.beginPath();
      for (const f of features) path(f);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = width; ctx.stroke(); }
    };

    layer([{ type: 'Sphere' }], { fill: COLORS.ocean });
    layer([graticule], { stroke: COLORS.graticule, width: 0.6 });
    layer(world.terres, { fill: COLORS.land, stroke: COLORS.border, width: 0.8 });
    layer(world.fleuves, { stroke: COLORS.river, width: 0.8 });
    layer(world.lacs, { fill: COLORS.lake });

    const zone = zones.find((z) => z.id === selectedId);

    // Repères des zones de la face visible
    const drawn = [];
    const drawMarker = ({ zone: z, x, y, r }) => {
      const active = z.id === selectedId;
      const hovered = z.id === hoveredId;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = active ? COLORS.accentGlow : COLORS.accent;
      // Pendant une sélection, les autres zones s'effacent pour laisser voir les observations
      ctx.globalAlpha = active || hovered ? 1 : zone ? 0.3 : 0.82;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.strokeStyle = active ? '#ffffff' : COLORS.background;
      ctx.stroke();
      if (r >= 9 && (!zone || active || hovered)) {
        ctx.fillStyle = COLORS.background;
        ctx.font = `600 ${r >= 12 ? 11 : 10}px ${font.current}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(z.especes.length), x, y + 0.5);
      }
    };
    for (const z of zones) {
      if (!isVisible(rotation, z.point))
        continue;
      const [x, y] = projection(z.point);
      const marker = { zone: z, x, y, r: markerRadius(z.especes.length) };
      drawn.push(marker);
      if (z.id !== selectedId)
        drawMarker(marker);
    }

    // Zone choisie : ses observations, puis son repère par-dessus
    if (zone) {
      ctx.fillStyle = COLORS.accentGlow;
      const r = 1.4 + zoom * 0.35;
      for (const point of zone.observations) {
        if (!isVisible(rotation, point, 0.01))
          continue;
        const [x, y] = projection(point);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fill();
      }
      const marker = drawn.find((m) => m.zone.id === selectedId);
      if (marker)
        drawMarker(marker);
    }
    markers.current = drawn;

    layer([{ type: 'Sphere' }], { stroke: COLORS.border, width: 1 });
  }, [world, zones, selectedId]);

  // Taille du canevas : carré, à la largeur de son conteneur, net sur les écrans haute densité
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap)
      return undefined;
    font.current = getComputedStyle(document.body).fontFamily;
    const resize = () => {
      const size = wrap.clientWidth;
      const dpr = pixelRatio();
      view.current.size = size;
      canvasRef.current.width = Math.round(size * dpr);
      canvasRef.current.height = Math.round(size * dpr);
      view.current.dirty = true;
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    const visibility = new IntersectionObserver(([entry]) => { view.current.onScreen = entry.isIntersecting; });
    visibility.observe(wrap);
    return () => { observer.disconnect(); visibility.disconnect(); };
  }, []);

  // Boucle d'animation : rotation lente au repos, recentrage sur une zone, et redessin à la demande
  useEffect(() => {
    let frame;
    let last = performance.now();
    const tick = (now) => {
      const v = view.current;
      const dt = Math.min(now - last, 64);
      last = now;
      if (v.flight) {
        const t = Math.min((now - v.flight.start) / FLIGHT, 1);
        const eased = 1 - (1 - t) ** 3;
        v.rotation = interpolateRotation(v.flight.from, v.flight.to, eased);
        v.zoom = v.flight.fromZoom + (v.flight.toZoom - v.flight.fromZoom) * eased;
        if (t === 1)
          v.flight = null;
        v.dirty = true;
      } else if (v.spinning && v.onScreen && !document.hidden) {
        v.rotation = [wrapLongitude(v.rotation[0] + (SPIN * dt) / 1000), v.rotation[1]];
        v.dirty = true;
      }
      if (v.dirty) {
        v.dirty = false;
        draw();
      }
      frame = requestAnimationFrame(tick);
    };
    view.current.dirty = true;
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [draw]);

  const hover = (zone) => {
    view.current.hovered = zone?.id ?? null;
    const marker = zone && markers.current.find((m) => m.zone.id === zone.id);
    setTooltip(marker ? { zone, x: marker.x, y: marker.y, r: marker.r } : null);
    redraw();
  };

  const select = (zone) => {
    stopSpin();
    hover(null);
    setSelectedId(zone?.id ?? null);
    if (!zone)
      return;
    fly(rotationTo(zone.point), Math.max(view.current.zoom, FOCUS_ZOOM));
  };

  /** Recentre le globe (et zoome) en douceur, ou d'un coup si l'utilisateur préfère moins d'animations */
  const fly = (to, toZoom) => {
    const v = view.current;
    if (reduceMotion) {
      v.rotation = to;
      v.zoom = toZoom;
      v.flight = null;
    } else {
      v.flight = { from: v.rotation, to, fromZoom: v.zoom, toZoom, start: performance.now() };
    }
    redraw();
  };

  const zoomBy = (factor) => {
    stopSpin();
    view.current.zoom = clampZoom(view.current.zoom * factor);
    redraw();
  };

  const reset = () => {
    setSelectedId(null);
    fly(START, 1);
  };

  const local = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e) => {
    canvasRef.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, local(e));
    drag.current.moved = 0;
    stopSpin();
    view.current.flight = null;
  };

  const onPointerMove = (e) => {
    const p = local(e);
    const active = pointers.current;
    if (!active.has(e.pointerId)) {
      // Survol à la souris : nom de la zone sous le pointeur
      if (e.pointerType === 'mouse') {
        const zone = hitMarker(markers.current, p.x, p.y);
        if ((zone?.id ?? null) !== view.current.hovered)
          hover(zone);
      }
      return;
    }
    const previous = active.get(e.pointerId);
    if (active.size === 2) {
      // Pincement à deux doigts : zoom
      const other = [...active.entries()].find(([id]) => id !== e.pointerId)[1];
      const before = Math.hypot(previous.x - other.x, previous.y - other.y);
      const after = Math.hypot(p.x - other.x, p.y - other.y);
      if (before > 0)
        view.current.zoom = clampZoom(view.current.zoom * (after / before));
    } else {
      view.current.rotation = dragRotation(view.current.rotation, p.x - previous.x, p.y - previous.y,
        globeRadius(view.current));
    }
    drag.current.moved += Math.abs(p.x - previous.x) + Math.abs(p.y - previous.y);
    active.set(e.pointerId, p);
    if (view.current.hovered !== null)
      hover(null);
    redraw();
  };

  const onPointerUp = (e) => {
    const p = local(e);
    pointers.current.delete(e.pointerId);
    if (drag.current.moved < 6) {
      const zone = hitMarker(markers.current, p.x, p.y, e.pointerType === 'mouse' ? 4 : 12);
      if (zone)
        select(zone);
    }
  };

  const onKeyDown = (e) => {
    const step = 10 / view.current.zoom;
    const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      stopSpin();
      const [dl, dp] = moves[e.key];
      const [l, p] = view.current.rotation;
      view.current.rotation = [wrapLongitude(l + dl), Math.min(90, Math.max(-90, p + dp))];
      redraw();
    } else if (e.key === '+' || e.key === '=') {
      zoomBy(1.4);
    } else if (e.key === '-') {
      zoomBy(1 / 1.4);
    } else if (e.key === 'Escape') {
      setSelectedId(null);
    }
  };

  const loading = !world || !ecoregions;

  return (
    <section ref={sectionRef} className="container py-24" aria-labelledby="globe-title">
      <Reveal className="max-w-2xl">
        <h2 id="globe-title" className="text-3xl font-semibold sm:text-4xl">{t('D\'où viennent vos poissons\u00a0?', 'Where do your fish come from?')}</h2>
        <p className="mt-4 text-base text-muted sm:text-lg">
          {t('Faites tourner le globe et touchez une zone\u00a0: les espèces du catalogue qui y vivent à l\'état '
            + 'sauvage s\'affichent, avec leurs observations.',
          'Spin the globe and tap a zone: the catalogue species that live there in the wild appear, with their '
            + 'observations.')}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <Reveal>
          <div ref={wrapRef} className="relative mx-auto aspect-square w-[88%] max-w-[36rem] lg:w-full">
            {loading && <div className="absolute inset-[2%] animate-pulse rounded-full bg-surface-elevated/60"/>}
            <canvas
              ref={canvasRef}
              tabIndex={0}
              role="application"
              aria-label={t('Globe des zones d\'eau douce. Glissez ou utilisez les flèches pour le faire tourner, + et − pour zoomer. '
                + 'Les zones sont aussi listées à côté.', 'Globe of freshwater zones. Drag or use the arrow keys to spin it, + and − '
                + 'to zoom. The zones are also listed alongside.')}
              className="absolute inset-0 h-full w-full cursor-grab touch-none rounded-full active:cursor-grabbing"
              style={tooltip ? { cursor: 'pointer' } : undefined}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={(e) => pointers.current.delete(e.pointerId)}
              onPointerLeave={() => hover(null)}
              onKeyDown={onKeyDown}
            />
            {tooltip && (
              <div className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1 text-xs shadow-lg"
                   style={{ left: tooltip.x, top: tooltip.y - tooltip.r - 6 }}>
                {t(tooltip.zone.nom, tooltip.zone.nom_feow)} <span className="tabular-nums text-accent-glow">{tooltip.zone.especes.length}</span>
              </div>
            )}
            <div className="absolute bottom-1 right-1 flex flex-col gap-1.5 sm:bottom-3 sm:right-3">
              <button type="button" onClick={() => zoomBy(1.4)} className="btn-ghost !p-2" aria-label={t('Zoomer', 'Zoom in')}>
                <Plus className="h-4 w-4"/>
              </button>
              <button type="button" onClick={() => zoomBy(1 / 1.4)} className="btn-ghost !p-2" aria-label={t('Dézoomer', 'Zoom out')}>
                <Minus className="h-4 w-4"/>
              </button>
              <button type="button" onClick={reset} className="btn-ghost !p-2" aria-label={t('Revenir à la vue de départ', 'Back to the starting view')}>
                <RotateCcw className="h-4 w-4"/>
              </button>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted">
            Zones&nbsp;: <a href="https://www.feow.org" target="_blank" rel="noopener noreferrer"
                             className="underline-offset-4 hover:text-accent-glow hover:underline">Freshwater Ecoregions of the World</a>,
            {' '}© 2008 The Nature Conservancy {t('et', 'and')} World Wildlife Fund, Inc. Observations&nbsp;: GBIF.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="card flex h-[32rem] flex-col overflow-hidden lg:h-[36rem]">
            {loading ? (
              <div className="space-y-3 p-6">
                <div className="h-6 w-1/2 animate-pulse rounded bg-surface-elevated"/>
                <div className="h-4 w-2/3 animate-pulse rounded bg-surface-elevated"/>
              </div>
            ) : selected ? (
              <ZoneDetails zone={selected} poissons={poissonsData?.poissons} onBack={() => select(null)}/>
            ) : (
              <ZoneList zones={zones} onSelect={select}/>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
