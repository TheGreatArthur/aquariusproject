import Link from 'next/link';
import styles from '@/app/page.module.css'

export default function Poisson({ params }) {

    const id = params.id

    return <main className={styles.main}>
        <h1>Fiche d'un poisson</h1>
        <p>Ceci est le poisson {id}</p>

        <Link href='/poissons'>Retour à la liste</Link>
    </main>;
}