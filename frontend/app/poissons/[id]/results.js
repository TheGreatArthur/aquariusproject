/**
 * Fiche technique
 */

import Table from 'react-bootstrap/Table';

export default function Results ({ data }) {

  return <Table>
    <tbody>
      <tr>
        <th>Nom scientifique</th>
        <td>{data.nom_scientifique}</td>
      </tr>
      <tr>
        <th>Famille</th>
        <td>{data.nom_famille}</td>
      </tr>
      <tr>
        <th>Genre</th>
        <td>{data.nom_genre}</td>
      </tr>
      <tr>
        <th>Taille moyenne</th>
        <td>{data.taille} cm</td>
      </tr>
      <tr>
        <th>Longévité</th>
        <td>{data.longevite} ans</td>
      </tr>
      <tr>
        <th>Comportement</th>
        <td>{data.nom_comportement}</td>
      </tr>
      <tr>
        <th>Litrage minimum</th>
        <td>{data.litrage_mini} L</td>
      </tr>
      <tr>
        <th>Nombre d&apos;individus minimum</th>
        <td>{data.nb_individus}</td>
      </tr>
      <tr>
        <th>pH minimum</th>
        <td>{data.ph_mini}</td>
      </tr>
      <tr>
        <th>pH maximum</th>
        <td>{data.ph_maxi}</td>
      </tr>
      <tr>
        <th>gH minimum</th>
        <td>{data.gh_mini}</td>
      </tr>
      <tr>
        <th>gH maximum</th>
        <td>{data.gh_maxi}</td>
      </tr>
      <tr>
        <th>Température minimum</th>
        <td>{data.temp_mini} °C</td>
      </tr>
      <tr>
        <th>Température maximum</th>
        <td>{data.temp_maxi} °C</td>
      </tr>

    </tbody>

  </Table>;

}