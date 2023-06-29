import Image from 'next/image';
import Link from 'next/link';
import Table from 'react-bootstrap/Table';


export default function TablePoissons({ poissons }) {

  return (
    <Table hover className='table-dark'>

      <thead>
        <tr>
          <th></th>
          <th>Nom commun</th>
          <th>Nom scientifique</th>
          <th>Famille</th>
        </tr>
      </thead>

      <tbody>
        {poissons.map((p) => (
          <tr key={p.id}>
            <td>
              {p.id && (
                <Image
                  src={`/images/${p.id}.jpg`}
                  alt={p.nom_commun}
                  width="90"
                  height="70"
                />
              )}
            </td>
            <td>
              {p.id && (
                <Link href={`/poissons/${p.id}`}>{p.nom_commun}</Link>
              )}
            </td>
            <td>{p.nom_scientifique}</td>
            <td>{p.nom_famille}</td>
          </tr>
        ))}
      </tbody>

    </Table>
  );
}
