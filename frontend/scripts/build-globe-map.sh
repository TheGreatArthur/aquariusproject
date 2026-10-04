#!/usr/bin/env bash
# Builds public/maps/globe-110m.json, the base map of the home page globe: land (countries merged, no borders),
# large lakes and main rivers from Natural Earth 1:110m (public domain), packed as TopoJSON with mapshaper.
# The globe is redrawn at every frame while it turns, so it needs far fewer points than the 1:50m range maps.
set -euo pipefail

cd "$(dirname "$0")/.."
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

NE=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
for layer in land lakes rivers_lake_centerlines; do
  curl -sfL -o "$TMP/$layer.geojson" "$NE/ne_110m_$layer.geojson"
done

mkdir -p public/maps
npx -y mapshaper@0.7.70 \
  -i "$TMP/land.geojson" "$TMP/lakes.geojson" "$TMP/rivers_lake_centerlines.geojson" combine-files \
  -rename-layers terres,lacs,fleuves \
  -filter-fields target=terres featurecla \
  -filter-fields target=lacs,fleuves name \
  -rename-fields target=lacs,fleuves nom=name \
  -o public/maps/globe-110m.json format=topojson quantization=50000 target=*

ls -lh public/maps/globe-110m.json
