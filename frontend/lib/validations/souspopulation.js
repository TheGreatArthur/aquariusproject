/**
 * Validation : risque de sous-population ?
 * @param panier
 * @param environnement
 * @returns {{ok: boolean}|{ok: boolean, messages: string[], ids: number[]}}
*/
export default function souspopulation (panier, environnement) {

    let ok = true;
    let messages = [];
    let ids = [];

    // On parcourt le panier pour trouver les poissons en quantité insuffisante
    for (let p of panier) {
        if (p.quantite < p.nb_individus) {
            ok = false;
            messages.push(`Sous-population de ${p.nom_commun} (${p.quantite} au lieu de ${p.nb_individus} mini)`);
            ids.push(p.id);
        }
    }
    return {ok, messages, ids};
}
