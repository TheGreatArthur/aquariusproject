# Fish data checked against reference sources

Date: 2026-09-30. Every one of the 135 fish was checked against [FishBase](https://www.fishbase.se) (FB) and
[Seriously Fish](https://www.seriouslyfish.com) (SF), with [GBIF](https://www.gbif.org) for names and
distribution; FishBase covers 134 fish and Seriously Fish 107 (the remaining catfishes, loaches and killifishes rely on
FishBase and the literature cited in each profile). See [ADR 0006](adr/0006-fish-profiles-and-sources.md).

## Method

1. `make sources` fetches and caches the pages (`backend/tools/fetch_sources.py`, cache not versioned), then
   `backend/tools/compare_sources.py` compares family, region, size, temperature, pH and hardness with the base.
2. A value is only corrected when it falls clearly outside the published ranges (±2 °C, ±0.5 pH, ±4 dGH,
   size off by more than 40 %), or when a label is plainly wrong. The base keeps aquarium ranges, which are
   narrower than the extremes measured in the wild.
3. Each correction is versioned in [`backend/corrections.py`](../backend/corrections.py) with its reason and
   sources, so the Excel workbook stays untouched. The French family label "Cyprinidé" is normalized to
   "Cyprinidae" at import (`backend/normalize.py`, 4 fish).

GH values in the workbook are German degrees (°dGH), like FishBase's "dH": the "°d or °f?" question raised by
the previous audit is settled — only a few minimums were wrong (*Corydoras sterbai* 20–30, *Osphronemus goramy*
20–25).

## Corrections applied (98 values on 63 fish)

| | Count |
|---|---|
| Size | 20 |
| Hardness (GH) | 16 |
| Temperature | 14 |
| Family | 10 (+ 4 "Cyprinidé" labels) |
| Common name | 9 |
| Region | 8 |
| Behaviour | 8 |
| pH | 5 |
| Scientific name | 3 |
| Minimum group, way of life, minimum volume | 5 |

Notable ones: the tiger barb was kept at 26–29 °C (sources: 20–26 °C) and labelled peaceful although it is a
notorious fin nipper; the red-tailed hillstream loach *Aborichthys elongatus* lives in cool Himalayan streams
(15–21 °C, not 21–26 °C); platys, swordtails and the molly come from Central America, not South America; the
rainbowfishes come from New Guinea (new region "Océanie"); *Hypancistrus zebra* was called "Poisson-zèbre",
the French name of *Danio rerio*, and *Aphyosemion striatum* "Poisson du paradis", the name of *Macropodus
opercularis*.

| Fish | Field | Before | After | Reason |
|---|---|---|---|---|
| *Placidochromis Electra* | Scientific name | Placidochromis Electra | Placidochromis electra | Species epithets are lowercase (FB: Placidochromis electra). |
| *Placidochromis Electra* | Common name | Placidochromis Electra | Placidochromis electra | Common name was a copy of the misspelt scientific name. |
| *Placidochromis Electra* | Size (cm) | 11 | 14 | FB max length 12 cm SL (about 15 cm TL); 11 cm was below the usual adult size. |
| *Laetacara Fulvipinnis* | Scientific name | Laetacara Fulvipinnis | Laetacara fulvipinnis | Species epithets are lowercase (FB: Laetacara fulvipinnis). |
| *Laetacara Fulvipinnis* | Common name | Laetacara Fulvipinnis | Laetacara fulvipinnis | Common name was a copy of the misspelt scientific name. |
| *Laetacara Fulvipinnis* | Size (cm) | 5 | 7 | FB max length 7.4 cm SL, SF 75 mm SL; 5 cm was the size of a juvenile. |
| *Badis* | Scientific name | Badis | Badis badis | The workbook gave the genus only; the fish is Badis badis (FB, SF). |
| *Thayeria boehlkei* | Common name | Tétra Pinguin | Tétra pingouin | Typo ("Pinguin") and casing. |
| *Thayeria boehlkei* | Size (cm) | 7 | 5 | FB 3.6 cm SL, up to 6 cm TL; SF 36 mm SL. 7 cm overstated the adult size. |
| *Gymnocorymbus ternetzi* | Common name | Veuve noir | Veuve noire | Agreement typo ("Veuve noir"). |
| *Rasbora patrickyapi* | Common name | Rasbora patrickyapi+ | Rasbora patrickyapi | Stray "+" at the end of the common name. |
| *Trichopsis pumila* | Common name | Gouramis grogneur nain | Gourami grogneur nain | Plural typo ("Gouramis"). |
| *Aulonocara baenschi* | Common name | Baenchi | Baenschi | Typo ("Baenchi"); the species is Aulonocara baenschi. |
| *Hypancistrus zebra* | Common name | Poisson-zèbre | Pléco zèbre | "Poisson-zèbre" is the French name of Danio rerio; H. zebra (L046) is known as the zebra pleco. |
| *Aphyosemion striatum* | Common name | Poisson du paradis | Aphyosemion strié | "Poisson du paradis" is the French name of Macropodus opercularis, not of this killifish. |
| *Aphyosemion striatum* | GH (°dGH) | 1–3 | 3–10 | FB dH 5-12, SF 3-12 dGH; 1-3 was far softer than any published range. |
| *Aphyosemion striatum* | Behaviour | moyennement agressif | peu agressif | SF: "very peaceful, relatively shy"; males only spar with each other. |
| *Acnodon normani* | Family | Characidae | Serrasalmidae | Pacus belong to Serrasalmidae (FB, SF), like the piranhas already in the base. |
| *Pterophyllum scalare* | Family | Cichlidae | Cichlidae américain | Every other South American cichlid uses this label; P. altum already does. |
| *Chromobotia macracanthus* | Family | Cobitidae | Botiidae | Botiid loaches are a family of their own, separate from Cobitidae (FB). |
| *Chromobotia macracanthus* | Size (cm) | 26 | 30 | FB max length 30.5 cm TL; 26 cm understated the space it needs. |
| *Chromobotia macracanthus* | Temperature (°C) | 22–30 | 24–30 | FB 25-30 °C, SF 24-30 °C. |
| *Ambastaia sidthimunki* | Family | Cobitidae | Botiidae | Botiid loaches are a family of their own, separate from Cobitidae (FB). |
| *Gastromyzon punctulatus* | Family | Balitoridae | Gastromyzontidae | Hillstream loach of the family Gastromyzontidae, not Balitoridae (FB). |
| *Beaufortia leveretti* | Family | Balitoridae | Gastromyzontidae | Hillstream loach of the family Gastromyzontidae, not Balitoridae (FB). |
| *Aborichthys elongatus* | Family | Balitoridae | Nemacheilidae | Stone loach of the family Nemacheilidae, not Balitoridae (FB). |
| *Aborichthys elongatus* | Temperature (°C) | 21–26 | 16–22 | SF 15-21 °C: cool, fast Himalayan foothill streams; 21-26 °C was too warm. |
| *Pseudepiplatys annulatus* | Family | Cynolebiidae | Nothobranchiidae | African killifish (FB: Epiplatys annulatus, Nothobranchiidae), not Cynolebiidae. |
| *Pseudepiplatys annulatus* | Size (cm) | 2 | 4 | FB 4 cm TL, SF 35 mm SL. |
| *Nothobranchius rachovii* | Family | Cyprinodontidae | Nothobranchiidae | Nothobranchius is the type genus of Nothobranchiidae (FB), not Cyprinodontidae. |
| *Fundulopanchax gardneri* | Min. volume (L) | 20 | 50 | FB: minimum aquarium length 60 cm (about 50 L); 20 L was too small for a male and two females. |
| *Fundulopanchax gardneri* | Family | Cynolebiidae | Nothobranchiidae | African killifish of the family Nothobranchiidae (FB), not Cynolebiidae. |
| *Fundulopanchax gardneri* | pH | 5–6.8 | 6–7.2 | FB pH 6.0-7.2, SF 6.0-7.5. |
| *Astyanax jordani* | Region | Amérique du Sud | Amérique centrale | Cave fish from north-eastern Mexico (FB); same label as the Mexican platys. |
| *Xiphophorus maculatus* | Region | Amérique du Sud | Amérique centrale | Native from Veracruz (Mexico) to Belize and Honduras (FB, SF). |
| *Xiphophorus hellerii* | Region | International | Amérique centrale | Native from Veracruz (Mexico) to Honduras (FB, SF); "International" meant nothing. |
| *Xiphophorus hellerii* | Size (cm) | 10 | 12 | FB max length 14 cm TL (male), 16 cm (female). |
| *Poecilia sphenops* | Region | Amérique du Sud | Amérique centrale | Native from Mexico to Colombia and Venezuela, mostly Central America (FB, SF). |
| *Poecilia sphenops* | Size (cm) | 5 | 7 | FB 7.5 cm SL, SF 80 mm SL. |
| *Poecilia sphenops* | GH (°dGH) | 7–20 | 10–30 | FB dH 11-30, SF 15-30 dGH: a hard-water livebearer. |
| *Gambusia holbrooki* | Region | Amérique du Sud et Europe | Amérique du Nord | Native to the eastern USA only; European populations are introductions (FB). |
| *Gambusia holbrooki* | Behaviour | pacifique | moyennement agressif | Fin-nipping, aggressive livebearer that threatens native fish where introduced (FB, SF). |
| *Melanotaenia boesemani* | Region | Asie | Océanie | Ajamaru lakes, New Guinea (FB lists it under Oceania). |
| *Melanotaenia boesemani* | Temperature (°C) | 23–30 | 25–30 | FB 27-30 °C, SF 27-30 °C. |
| *Melanotaenia boesemani* | pH | 6.8–7.2 | 7–8 | FB pH 7-8, SF 7-8; the lakes are hard and alkaline (pH 8-9). |
| *Glossolepis incisus* | Region | Asie | Océanie | Lake Sentani, New Guinea (FB). |
| *Glossolepis incisus* | Temperature (°C) | 29–30 | 24–29 | FB 29-30 °C (lake surface), SF 22-25 °C; 29-30 °C alone was not a keeping range. |
| *Glossolepis incisus* | Size (cm) | 10 | 12 | FB max length 12 cm SL (male). |
| *Melanotaenia lacustris* | Region | Asie | Océanie | Lake Kutubu, Papua New Guinea (FB). |
| *Paracheirodon simulans* | Temperature (°C) | 25–34 | 24–30 | FB 23-27 °C; SF 21-35 °C are wild extremes. 34 °C is not a keeping temperature. |
| *Tyttocharax tambopatensis* | Size (cm) | 1 | 2 | FB max length 1.6 cm SL (about 2 cm TL). |
| *Thayeria ifati* | Size (cm) | 4 | 5 | FB up to 5 cm SL, SF 50 mm SL. |
| *Hyphessobrycon heterorhabdus* | GH (°dGH) | 10–15 | 2–12 | SF 1-12 dGH (soft clear-water igarapés); FB max 15. A minimum of 10 excluded soft water. |
| *Hyphessobrycon heterorhabdus* | Size (cm) | 5 | 4 | FB 3.6 cm TL, SF 35 mm SL. |
| *Hyphessobrycon herbertaxelrodi* | GH (°dGH) | 10–15 | 2–12 | SF 1-12 dGH, FB max 15. A minimum of 10 excluded soft water. |
| *Hemigrammus pulcher* | Behaviour | peu agressif | pacifique | SF: "lively, peaceful", rather shy; no fin-nipping reported. |
| *Puntigrus tetrazona* | Temperature (°C) | 26–29 | 20–26 | FB 20-26 °C, SF 20-26 °C; 26-29 °C was outside both. |
| *Puntigrus tetrazona* | Behaviour | pacifique | peu agressif | Notorious fin nipper; FB: "not to be kept with long-finned fishes". It was labelled peaceful. |
| *Trigonostigma hengeli* | Size (cm) | 2 | 3 | FB 3.0 cm SL, SF 30 mm SL. |
| *Celestichthys erythromicron* | Size (cm) | 4 | 3 | FB 3.0 cm, SF 20 mm SL: a miniature species. |
| *Betta bellica* | GH (°dGH) | 5–12 | 1–6 | SF 1-5 dGH; peat-swamp black water with negligible hardness. |
| *Betta macrostoma* | GH (°dGH) | 6–10 | 1–5 | SF 0-5 dGH; black water with pH 4.4-5.7 (FB). |
| *Betta macrostoma* | Way of life | solitaire | couple | SF: "best maintained in a pair"; males fight, females form a hierarchy. |
| *Betta macrostoma* | Min. group | 1 | 2 | Kept as a pair (SF), consistent with the "couple" way of life. |
| *Betta gladiator* | Behaviour | peu agressif | territorial | FB: "aggressive and territorial"; captive fish fight continuously and must be kept apart. |
| *Osphronemus goramy* | GH (°dGH) | 20–25 | 5–25 | SF 5-25 dGH, FB max 25: values are German degrees, only the minimum of 20 was wrong. |
| *Corydoras sterbai* | GH (°dGH) | 20–30 | 2–15 | SF 1-15 dGH, FB 2-25; soft-water catfish, a minimum of 20 excluded it from most tanks. |
| *Corydoras sterbai* | Temperature (°C) | 22–31 | 22–28 | FB 21-25 °C, SF 24-28 °C; 31 °C was above both. |
| *Corydoras pygmaeus* | GH (°dGH) | 6–16 | 2–10 | SF 0-8 dGH, FB 2-25; a minimum of 6 dGH excluded soft water. |
| *Corydoras hastatus* | Size (cm) | 4 | 3 | FB 2.4 cm SL, SF 32 mm SL. |
| *Corydoras habrosus* | GH (°dGH) | 8–15 | 2–12 | SF 2-10 dGH, FB 2-25; a minimum of 8 dGH excluded soft water. |
| *Kryptopterus vitreolus* | Size (cm) | 14 | 8 | FB 6.5 cm SL, SF 65 mm SL; 14 cm is the size of the larger K. bicirrhis. |
| *Kryptopterus minor* | Size (cm) | 10 | 8 | FB max length 6.8 cm SL; 10 cm was the size of a larger congener. |
| *Kryptopterus minor* | Temperature (°C) | 21–26 | 22–28 | FB 24-28 °C; 21 °C was below the published range. |
| *Poecilia reticulata* | pH | 5.5–8 | 6.8–8.5 | FB pH 7.0-8.0, SF 7.0-8.5; guppies do poorly in acidic water. |
| *Poecilia wingei* | GH (°dGH) | 2–30 | 10–30 | SF 15-35 dGH: warm, hard lagoon water; 2 dGH was far too soft. |
| *Xiphophorus variatus* | Temperature (°C) | 23–28 | 20–26 | FB 15-25 °C (subtropical), SF 20-26 °C. |
| *Poecilia latipinna* | GH (°dGH) | 8–18 | 12–30 | SF 15-35 dGH: coastal, often brackish habitats. |
| *Poecilia latipinna* | Temperature (°C) | 25–28 | 21–28 | FB 20-28 °C, SF 21-26 °C. |
| *Girardinus metallicus* | Size (cm) | 4 | 6 | FB 5 cm TL (male) and 9 cm (female), SF 60 mm SL. |
| *Peckoltia compta* | Size (cm) | 10 | 8 | FB max length 6.2 cm SL. |
| *Panaque nigrolineatus* | Temperature (°C) | 22–30 | 22–28 | FB 22-26 °C; 30 °C was above published ranges. |
| *Panaque nigrolineatus* | Size (cm) | 30 | 40 | FB max length 43 cm SL. |
| *Panaque nigrolineatus* | Min. group | 3 | 1 | Solitary and territorial towards other large plecos; "solitaire" with 3 fish was contradictory. |
| *Baryancistrus chrysolomus* | Behaviour | peu agressif | territorial | SF: males become highly intolerant of conspecifics and bottom-dwellers with age. |
| *Tahuantinsuyoa macantzatza* | Temperature (°C) | 22–27 | 24–28 | FB 25-28 °C (Aguaytía basin); 22 °C was below the published range. |
| *Tahuantinsuyoa macantzatza* | pH | 5.5–7 | 6–7.5 | FB pH 6.3-7.7 measured in its streams; pH 5.5 was too acidic. |
| *Tahuantinsuyoa macantzatza* | Size (cm) | 7 | 10 | FB max length 12 cm TL; 7 cm was the size of a juvenile. |
| *Satanoperca daemon* | Min. group | 2 | 5 | SF: loose groups of at least 5-8, otherwise weaker fish are bullied. |
| *Neolamprologus brichardi* | Behaviour | peu agressif | territorial | SF: "aggressively territorial, especially when protecting fry". |
| *Pangio kuhlii* | GH (°dGH) | 1–13 | 1–8 | SF 0-8 dGH, FB max 5: peat-swamp water with negligible hardness. |
| *Channa bleheri* | Temperature (°C) | 12–25 | 14–25 | SF 14-28 °C; 12 °C was below published ranges. |
| *Austrolebias nigripinnis* | Temperature (°C) | 10–25 | 16–22 | FB 18-22 °C; a cool-water annual killifish, but 10 °C is not a keeping temperature. |
| *Austrolebias nigripinnis* | GH (°dGH) | 1–3 | 4–12 | FB dH 5-12; 1-3 was far softer than the published range. |
| *Aphyosemion australe* | pH | 4.5–6.5 | 5.5–7 | FB pH 6-7, SF 5.5-7.0; pH 4.5 was more acidic than both. |
| *Aphyosemion australe* | GH (°dGH) | 1–3 | 2–10 | SF 1-10 dGH, FB 5-12; 1-3 was softer than both. |
| *Aphyosemion australe* | Behaviour | moyennement agressif | peu agressif | SF: "very peaceful, shy"; males only spar with each other. |
| *Aphyosemion celiae* | GH (°dGH) | 3–10 | 1–6 | SF 0-5 dGH; soft-water killifish, 10 dGH was above the published range. |

## Values confirmed by the sources (still listed by `make audit`)

The [audit](data-audit.md) is a plausibility check; these values look unusual but are correct:

- pH 4.0–4.2 minimums for black-water species: cardinal tetra (FB 4.0–6.0, SF 3.5–7.5), *Betta bellica*
  (SF 4–7), *B. macrostoma* (FB 4.4–5.7), *B. gladiator* (FB 4.2–4.8), *Dicrossus filamentosus* (Rio Negro,
  breeds around pH 4.5 according to SF).
- GH 20–40 for *Micropoecilia picta* (FB dH 20–40: brackish coastal ditches).
- 15–32 °C for *Gambusia holbrooki* (FB 15–35 °C, temperate to subtropical) and 14–25 °C for *Channa bleheri*
  (SF 14–28 °C, cool Assam winters).

## Newer taxonomy, not applied (decision needed)

FishBase already follows several recent revisions. The base keeps the names used in the aquarium trade; each
profile shows the current valid name (`nom_valide`) and classification.

| In the base | Current name (FishBase) |
|---|---|
| *Corydoras aeneus* | *Osteogaster aenea* |
| *Corydoras habrosus*, *julii*, *panda*, *sterbai*, *trilineatus*, *weitzmani* | *Hoplisoma* … |
| *Corydoras hastatus*, *C. pygmaeus* | *Gastrodermus* … |
| *Corydoras robineae* | *Brochis robineae* |
| *Hyphessobrycon bentosi*, *copelandi*, *eques*, *erythrostigma* | *Megalamphodus* … |
| *Hemigrammus bleheri* | *Petitella bleheri* |
| *Hemigrammus pulcher* | *Holopristis pulchra* |
| *Austrolebias nigripinnis* | *Argolebias nigripinnis* |
| *Pseudepiplatys annulatus* | *Epiplatys annulatus* |
| *Micropoecilia picta* | *Poecilia picta* |
| *Celestichthys erythromicron* | *Danio erythromicron* |
| *Glossolepis incisus* | *Glossolepis incisa* |

Families: 21 tetras labelled "Characidae" are in **Acestrorhamphidae** since the 2024 revision of the tetras,
and the two *Tyttocharax* in **Stevardiidae**; *Austrolebias* is in Rivulidae for FishBase (Cynolebiidae for
other authors). Moving them would change the family filters of the site, so it is left for a separate decision.

## Open questions

- *Hemigrammus pulcher* is called "Tétra diamant", a name usually given to *Moenkhausia pittieri*.
- Two fish share "Tétra pingouin" (*Thayeria boehlkei* and *T. ifati*) and two share "Corydoras nain"
  (*C. pygmaeus* and *C. hastatus*).
- *Hyphessobrycon copelandi* is called "Yaya", the Guianese Creole name for any small tetra.
- *Nandus nebulosus* keeps FishBase's pH 7.0–7.5, although it also lives in acidic peat swamps.
- Some sizes are the usual adult size rather than the published maximum (*Betta splendens*, *Trichogaster*
  gouramis, *Placidochromis electra*); they were kept.
- *Danio rerio* var. *frankei* is a captive-bred mutant of *Danio rerio* and *Rineloricaria* sp. "red" has no
  known wild population: their profiles have no range map.
