#!/usr/bin/env bash
# Builds public/maps/world-50m.json, the base map of the fish range maps:
# countries (ISO 3166 alpha-3 code + French, English and Japanese names), lakes and rivers from Natural Earth
# 1:50m (public domain), simplified and packed as TopoJSON with mapshaper. French Guiana (GUF), part of France in the
# countries layer, is added from the map units layer because FishBase lists it as a territory of its own.
set -euo pipefail

cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

NE=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
for layer in admin_0_countries admin_0_map_units lakes rivers_lake_centerlines; do
  curl -sfL -o "$TMP/$layer.geojson" "$NE/ne_50m_$layer.geojson"
done

mkdir -p public/maps
npx -y mapshaper@0.7.70 \
  -i "$TMP/admin_0_countries.geojson" "$TMP/admin_0_map_units.geojson" "$TMP/lakes.geojson" \
     "$TMP/rivers_lake_centerlines.geojson" combine-files \
  -rename-layers pays,unites,lacs,fleuves \
  -filter 'GU_A3 == "GUF"' target=unites \
  -each 'ADM0_A3 = GU_A3, NAME_EN = "French Guiana", NAME_JA = "フランス領ギアナ"' target=unites \
  -merge-layers target=pays,unites name=pays force \
  -filter-fields target=pays ADM0_A3,NAME_FR,NAME_EN,NAME_JA \
  -rename-fields target=pays iso=ADM0_A3,nom=NAME_FR,name=NAME_EN,ja=NAME_JA \
  -filter 'scalerank <= 4' target=lacs \
  -filter-fields target=lacs name \
  -rename-fields target=lacs nom=name \
  -filter-fields target=fleuves name \
  -rename-fields target=fleuves nom=name \
  -simplify 35% keep-shapes target=* \
  -o public/maps/world-50m.json format=topojson quantization=100000 target=*

ls -lh public/maps/world-50m.json
