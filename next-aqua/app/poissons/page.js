import styles from '@/app/page.module.css'



export const poissons = [
    {
        id: 1,
        nom: 'Guppy',
        famille: 'Vivipares'
    },
    {
        id: 2,
        nom: 'Néon',
        famille: 'Vivipares'
    },
    {
        id: 3,
        nom: 'Corydoras',
        famille: 'Vivipares'
    },
]

export default function Poissons() {
    return <main className={styles.main}>
        <h1>Liste des poissons</h1>

        <ul>
            {poissons.map(p => <li><a href={`/poissons/${p.id}`}>{p.nom}</a> ({p.famille})</li>)}
        </ul>

    </main>
}