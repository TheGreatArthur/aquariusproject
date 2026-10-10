/**
 * Espèces du bac : poissons, invertébrés et plantes ramenés aux champs que lisent les règles
 */

/**
 * Points de population d'un invertébré (1 point ≈ 1 litre) : un point par tranche de 3 cm, 1 si la taille est
 * inconnue. Il salit bien moins qu'un poisson de même taille (une Red Cherry de 3 cm : 1 point, un néon : 5).
 */
export const pointsInvertebre = (taille) => Math.max(1, Math.ceil((taille ?? 0) / 3));

export const TYPES = {
  poisson: { label: 'Poissons', api: '/api/poissons', liste: 'poissons', page: '/poissons' },
  invertebre: { label: 'Invertébrés', api: '/api/invertebres', liste: 'invertebres', page: '/invertebres' },
  plante: { label: 'Plantes', api: '/api/plantes', liste: 'plantes', page: '/plantes' },
};

// Les poissons de test et ceux d'un ancien bac n'ont pas de type
export const estPoisson = (p) => (p.kind ?? 'poisson') === 'poisson';
export const estAnimal = (p) => p.kind !== 'plante';

/**
 * Espèce prête pour le moteur : un identifiant unique entre les trois catalogues (`ref` garde celui de l'API) et les
 * noms de champs des poissons. Les plantes ne comptent pas dans la charge du bac.
 */
export function espece (kind, item) {
  const base = { ...item, kind, ref: item.id, id: `${kind}-${item.id}` };
  if (kind === 'invertebre')
    return {
      ...base, nom_famille: item.famille, nom_comportement: item.comportement, nom_mode_vie: item.mode_vie,
      nom_zone_geo: item.zone_geo, points: pointsInvertebre(item.taille), nb_individus: item.nb_individus ?? 1,
    };
  if (kind === 'plante')
    return { ...base, nom_famille: item.famille, points: 0, nb_individus: 1 };
  return base;
}
