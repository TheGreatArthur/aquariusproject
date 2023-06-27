/**
 * Liste des poissons correspondant aux critères de filtrage
 */

import Image from 'next/image';
import Link from 'next/link';
import Table from 'react-bootstrap/Table';


export default function TablePoissons ({ poissons }) {

  return <Table>

    <thead>
      <tr>
        <th>Nom commun</th>
        <th>Nom scientifique</th>
        <th>Famille</th>
        <th>Comportement</th>
      </tr>
    </thead>

    <tbody>
      {poissons.map((p) => (
        <tr key={p.id}>
          <td>
            <Image src={`/images/${p.id}.jpg`} alt={p.nom_commun}
                   width="90" height="70"/>{' '}
            <Link href={`/poissons/${p.id}`}>{p.nom_commun}</Link>
          </td>
          <td>{p.nom_scientifique}</td>
          <td>{p.nom_famille}</td>
          <td>{p.nom_comportement}</td>
        </tr>
      ))}
    </tbody>

  </Table>;
}
