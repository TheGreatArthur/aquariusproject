import { useRouter } from 'next/router'
import Link from 'next/link';

export default function Poisson(props) {

const router = useRouter()

    return <>
    <h1>Fiche d'un poisson</h1>
    <p>Ceci est le poisson {router.query.id}</p>
 
    <Link href='/poissons'>Retour à la liste</Link>
    </>;
}