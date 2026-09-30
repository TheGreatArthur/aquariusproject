"""
Corrections de données appliquées à l'import, par-dessus le classeur Excel

Chaque correction est versionnée ici avec sa justification, pour qu'elle soit relue en pull request.
Les valeurs douteuses non tranchées sont listées par `audit_data.py` (voir docs/data-audit.md),
pas corrigées à l'aveugle.

Sources citées : FB = FishBase, SF = Seriously Fish (liens dans data/profiles/<espèce>.json), vérifiées
avec tools/compare_sources.py (voir docs/data-sources-check.md). Une plage n'est corrigée que si elle
sort nettement des plages publiées ; SL = longueur standard (sans la queue), TL = longueur totale.
"""


def _range(field: str, low: float, high: float, reason: str) -> dict[str, tuple[float, str]]:
    """ Correction d'une plage (ph, gh, temp) : les deux bornes avec la même justification """
    return {f'{field}_mini': (low, reason), f'{field}_maxi': (high, reason)}


# nom_scientifique (tel qu'il est écrit dans le classeur) -> {champ: (nouvelle valeur, justification)}
CORRECTIONS: dict[str, dict[str, tuple[object, str]]] = {
    'Cichla ocellaris': {
        'comportement': (
            'prédateur',
            'Cichla ocellaris (Mariposa, "peacock bass") is a piscivore reaching 60 cm; '
            'it was labelled "peu agressif", which hid every predation risk in the simulator.',
        ),
    },

    # --- Names ---------------------------------------------------------------------------------------
    'Placidochromis Electra': {
        'nom_scientifique': ('Placidochromis electra', 'Species epithets are lowercase (FB: Placidochromis electra).'),
        'nom_commun': ('Placidochromis electra', 'Common name was a copy of the misspelt scientific name.'),
        'taille': (14, 'FB max length 12 cm SL (about 15 cm TL); 11 cm was below the usual adult size.'),
    },
    'Laetacara Fulvipinnis': {
        'nom_scientifique': ('Laetacara fulvipinnis', 'Species epithets are lowercase (FB: Laetacara fulvipinnis).'),
        'nom_commun': ('Laetacara fulvipinnis', 'Common name was a copy of the misspelt scientific name.'),
        'taille': (7, 'FB max length 7.4 cm SL, SF 75 mm SL; 5 cm was the size of a juvenile.'),
    },
    'Badis': {
        'nom_scientifique': ('Badis badis', 'The workbook gave the genus only; the fish is Badis badis (FB, SF).'),
    },
    'Thayeria boehlkei': {
        'nom_commun': ('Tétra pingouin', 'Typo ("Pinguin") and casing.'),
        'taille': (5, 'FB 3.6 cm SL, up to 6 cm TL; SF 36 mm SL. 7 cm overstated the adult size.'),
    },
    'Gymnocorymbus ternetzi': {
        'nom_commun': ('Veuve noire', 'Agreement typo ("Veuve noir").'),
    },
    'Rasbora patrickyapi': {
        'nom_commun': ('Rasbora patrickyapi', 'Stray "+" at the end of the common name.'),
    },
    'Trichopsis pumila': {
        'nom_commun': ('Gourami grogneur nain', 'Plural typo ("Gouramis").'),
    },
    'Aulonocara baenschi': {
        'nom_commun': ('Baenschi', 'Typo ("Baenchi"); the species is Aulonocara baenschi.'),
    },
    'Hypancistrus zebra': {
        'nom_commun': (
            'Pléco zèbre',
            '"Poisson-zèbre" is the French name of Danio rerio; H. zebra (L046) is known as the zebra pleco.',
        ),
    },
    'Aphyosemion striatum': {
        'nom_commun': (
            'Aphyosemion strié',
            '"Poisson du paradis" is the French name of Macropodus opercularis, not of this killifish.',
        ),
        **_range('gh', 3, 10, 'FB dH 5-12, SF 3-12 dGH; 1-3 was far softer than any published range.'),
        'comportement': ('peu agressif', 'SF: "very peaceful, relatively shy"; males only spar with each other.'),
    },

    # --- Families (FishBase classification, keeping the site's "Cichlidae africain/américain" split) ---
    'Acnodon normani': {
        'famille': ('Serrasalmidae', 'Pacus belong to Serrasalmidae (FB, SF), like the piranhas already in the base.'),
    },
    'Pterophyllum scalare': {
        'famille': (
            'Cichlidae américain',
            'Every other South American cichlid uses this label; P. altum already does.',
        ),
    },
    'Chromobotia macracanthus': {
        'famille': ('Botiidae', 'Botiid loaches are a family of their own, separate from Cobitidae (FB).'),
        'taille': (30, 'FB max length 30.5 cm TL; 26 cm understated the space it needs.'),
        **_range('temp', 24, 30, 'FB 25-30 °C, SF 24-30 °C.'),
    },
    'Ambastaia sidthimunki': {
        'famille': ('Botiidae', 'Botiid loaches are a family of their own, separate from Cobitidae (FB).'),
    },
    'Gastromyzon punctulatus': {
        'famille': ('Gastromyzontidae', 'Hillstream loach of the family Gastromyzontidae, not Balitoridae (FB).'),
    },
    'Beaufortia leveretti': {
        'famille': ('Gastromyzontidae', 'Hillstream loach of the family Gastromyzontidae, not Balitoridae (FB).'),
    },
    'Aborichthys elongatus': {
        'famille': ('Nemacheilidae', 'Stone loach of the family Nemacheilidae, not Balitoridae (FB).'),
        **_range('temp', 16, 22, 'SF 15-21 °C: cool, fast Himalayan foothill streams; 21-26 °C was too warm.'),
    },
    'Pseudepiplatys annulatus': {
        'famille': (
            'Nothobranchiidae',
            'African killifish (FB: Epiplatys annulatus, Nothobranchiidae), not Cynolebiidae.',
        ),
        'taille': (4, 'FB 4 cm TL, SF 35 mm SL.'),
    },
    'Nothobranchius rachovii': {
        'famille': (
            'Nothobranchiidae',
            'Nothobranchius is the type genus of Nothobranchiidae (FB), not Cyprinodontidae.',
        ),
    },
    'Fundulopanchax gardneri': {
        'litrage_mini': (
            50,
            'FB: minimum aquarium length 60 cm (about 50 L); 20 L was too small for a male and two females.',
        ),
        'famille': ('Nothobranchiidae', 'African killifish of the family Nothobranchiidae (FB), not Cynolebiidae.'),
        **_range('ph', 6.0, 7.2, 'FB pH 6.0-7.2, SF 6.0-7.5.'),
    },

    # --- Regions ------------------------------------------------------------------------------------
    'Astyanax jordani': {
        'zone_geo': (
            'Amérique centrale',
            'Cave fish from north-eastern Mexico (FB); same label as the Mexican platys.',
        ),
    },
    'Xiphophorus maculatus': {
        'zone_geo': ('Amérique centrale', 'Native from Veracruz (Mexico) to Belize and Honduras (FB, SF).'),
    },
    'Xiphophorus hellerii': {
        'zone_geo': (
            'Amérique centrale',
            'Native from Veracruz (Mexico) to Honduras (FB, SF); "International" meant nothing.',
        ),
        'taille': (12, 'FB max length 14 cm TL (male), 16 cm (female).'),
    },
    'Poecilia sphenops': {
        'zone_geo': (
            'Amérique centrale',
            'Native from Mexico to Colombia and Venezuela, mostly Central America (FB, SF).',
        ),
        'taille': (7, 'FB 7.5 cm SL, SF 80 mm SL.'),
        **_range('gh', 10, 30, 'FB dH 11-30, SF 15-30 dGH: a hard-water livebearer.'),
    },
    'Gambusia holbrooki': {
        'zone_geo': (
            'Amérique du Nord',
            'Native to the eastern USA only; European populations are introductions (FB).',
        ),
        'comportement': (
            'moyennement agressif',
            'Fin-nipping, aggressive livebearer that threatens native fish where introduced (FB, SF).',
        ),
    },
    'Melanotaenia boesemani': {
        'zone_geo': ('Océanie', 'Ajamaru lakes, New Guinea (FB lists it under Oceania).'),
        **_range('temp', 25, 30, 'FB 27-30 °C, SF 27-30 °C.'),
        **_range('ph', 7.0, 8.0, 'FB pH 7-8, SF 7-8; the lakes are hard and alkaline (pH 8-9).'),
    },
    'Glossolepis incisus': {
        'zone_geo': ('Océanie', 'Lake Sentani, New Guinea (FB).'),
        **_range('temp', 24, 29, 'FB 29-30 °C (lake surface), SF 22-25 °C; 29-30 °C alone was not a keeping range.'),
        'taille': (12, 'FB max length 12 cm SL (male).'),
    },
    'Melanotaenia lacustris': {
        'zone_geo': ('Océanie', 'Lake Kutubu, Papua New Guinea (FB).'),
    },

    # --- Water parameters and sizes -----------------------------------------------------------------
    'Paracheirodon simulans': {
        **_range('temp', 24, 30, 'FB 23-27 °C; SF 21-35 °C are wild extremes. 34 °C is not a keeping temperature.'),
    },
    'Tyttocharax tambopatensis': {
        'taille': (2, 'FB max length 1.6 cm SL (about 2 cm TL).'),
    },
    'Thayeria ifati': {
        'taille': (5, 'FB up to 5 cm SL, SF 50 mm SL.'),
    },
    'Hyphessobrycon heterorhabdus': {
        **_range(
            'gh', 2, 12,
            'SF 1-12 dGH (soft clear-water igarapés); FB max 15. A minimum of 10 excluded soft water.',
        ),
        'taille': (4, 'FB 3.6 cm TL, SF 35 mm SL.'),
    },
    'Hyphessobrycon herbertaxelrodi': {
        **_range('gh', 2, 12, 'SF 1-12 dGH, FB max 15. A minimum of 10 excluded soft water.'),
    },
    'Hemigrammus pulcher': {
        'comportement': ('pacifique', 'SF: "lively, peaceful", rather shy; no fin-nipping reported.'),
    },
    'Puntigrus tetrazona': {
        **_range('temp', 20, 26, 'FB 20-26 °C, SF 20-26 °C; 26-29 °C was outside both.'),
        'comportement': (
            'peu agressif',
            'Notorious fin nipper; FB: "not to be kept with long-finned fishes". It was labelled peaceful.',
        ),
    },
    'Trigonostigma hengeli': {
        'taille': (3, 'FB 3.0 cm SL, SF 30 mm SL.'),
    },
    'Celestichthys erythromicron': {
        'taille': (3, 'FB 3.0 cm, SF 20 mm SL: a miniature species.'),
    },
    'Betta bellica': {
        **_range('gh', 1, 6, 'SF 1-5 dGH; peat-swamp black water with negligible hardness.'),
    },
    'Betta macrostoma': {
        **_range('gh', 1, 5, 'SF 0-5 dGH; black water with pH 4.4-5.7 (FB).'),
        'mode_vie': ('couple', 'SF: "best maintained in a pair"; males fight, females form a hierarchy.'),
        'nb_individus': (2, 'Kept as a pair (SF), consistent with the "couple" way of life.'),
    },
    'Betta gladiator': {
        'comportement': (
            'territorial',
            'FB: "aggressive and territorial"; captive fish fight continuously and must be kept apart.',
        ),
    },
    'Osphronemus goramy': {
        **_range('gh', 5, 25, 'SF 5-25 dGH, FB max 25: values are German degrees, only the minimum of 20 was wrong.'),
    },
    'Corydoras sterbai': {
        **_range('gh', 2, 15, 'SF 1-15 dGH, FB 2-25; soft-water catfish, a minimum of 20 excluded it from most tanks.'),
        **_range('temp', 22, 28, 'FB 21-25 °C, SF 24-28 °C; 31 °C was above both.'),
    },
    'Corydoras pygmaeus': {
        **_range('gh', 2, 10, 'SF 0-8 dGH, FB 2-25; a minimum of 6 dGH excluded soft water.'),
    },
    'Corydoras hastatus': {
        'taille': (3, 'FB 2.4 cm SL, SF 32 mm SL.'),
    },
    'Corydoras habrosus': {
        **_range('gh', 2, 12, 'SF 2-10 dGH, FB 2-25; a minimum of 8 dGH excluded soft water.'),
    },
    'Kryptopterus vitreolus': {
        'taille': (8, 'FB 6.5 cm SL, SF 65 mm SL; 14 cm is the size of the larger K. bicirrhis.'),
    },
    'Kryptopterus minor': {
        'taille': (8, 'FB max length 6.8 cm SL; 10 cm was the size of a larger congener.'),
        **_range('temp', 22, 28, 'FB 24-28 °C; 21 °C was below the published range.'),
    },
    'Poecilia reticulata': {
        **_range('ph', 6.8, 8.5, 'FB pH 7.0-8.0, SF 7.0-8.5; guppies do poorly in acidic water.'),
    },
    'Poecilia wingei': {
        **_range('gh', 10, 30, 'SF 15-35 dGH: warm, hard lagoon water; 2 dGH was far too soft.'),
    },
    'Xiphophorus variatus': {
        **_range('temp', 20, 26, 'FB 15-25 °C (subtropical), SF 20-26 °C.'),
    },
    'Poecilia latipinna': {
        **_range('gh', 12, 30, 'SF 15-35 dGH: coastal, often brackish habitats.'),
        **_range('temp', 21, 28, 'FB 20-28 °C, SF 21-26 °C.'),
    },
    'Girardinus metallicus': {
        'taille': (6, 'FB 5 cm TL (male) and 9 cm (female), SF 60 mm SL.'),
    },
    'Peckoltia compta': {
        'taille': (8, 'FB max length 6.2 cm SL.'),
    },
    'Panaque nigrolineatus': {
        **_range('temp', 22, 28, 'FB 22-26 °C; 30 °C was above published ranges.'),
        'taille': (40, 'FB max length 43 cm SL.'),
        'nb_individus': (
            1,
            'Solitary and territorial towards other large plecos; "solitaire" with 3 fish was contradictory.',
        ),
    },
    'Baryancistrus chrysolomus': {
        'comportement': (
            'territorial',
            'SF: males become highly intolerant of conspecifics and bottom-dwellers with age.',
        ),
    },
    'Tahuantinsuyoa macantzatza': {
        **_range('temp', 24, 28, 'FB 25-28 °C (Aguaytía basin); 22 °C was below the published range.'),
        **_range('ph', 6.0, 7.5, 'FB pH 6.3-7.7 measured in its streams; pH 5.5 was too acidic.'),
        'taille': (10, 'FB max length 12 cm TL; 7 cm was the size of a juvenile.'),
    },
    'Satanoperca daemon': {
        'nb_individus': (5, 'SF: loose groups of at least 5-8, otherwise weaker fish are bullied.'),
    },
    'Neolamprologus brichardi': {
        'comportement': ('territorial', 'SF: "aggressively territorial, especially when protecting fry".'),
    },
    'Pangio kuhlii': {
        **_range('gh', 1, 8, 'SF 0-8 dGH, FB max 5: peat-swamp water with negligible hardness.'),
    },
    'Channa bleheri': {
        **_range('temp', 14, 25, 'SF 14-28 °C; 12 °C was below published ranges.'),
    },
    'Austrolebias nigripinnis': {
        **_range('temp', 16, 22, 'FB 18-22 °C; a cool-water annual killifish, but 10 °C is not a keeping temperature.'),
        **_range('gh', 4, 12, 'FB dH 5-12; 1-3 was far softer than the published range.'),
    },
    'Aphyosemion australe': {
        **_range('ph', 5.5, 7.0, 'FB pH 6-7, SF 5.5-7.0; pH 4.5 was more acidic than both.'),
        **_range('gh', 2, 10, 'SF 1-10 dGH, FB 5-12; 1-3 was softer than both.'),
        'comportement': ('peu agressif', 'SF: "very peaceful, shy"; males only spar with each other.'),
    },
    'Aphyosemion celiae': {
        **_range('gh', 1, 6, 'SF 0-5 dGH; soft-water killifish, 10 dGH was above the published range.'),
    },
}


def apply_corrections(fish: dict) -> dict:
    """ Applique les corrections connues à un poisson (dictionnaire de valeurs lues dans l'Excel)
    """
    for field, (value, _reason) in CORRECTIONS.get(fish['nom_scientifique'], {}).items():
        fish[field] = value
    return fish
