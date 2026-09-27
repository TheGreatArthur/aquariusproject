'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

import { lsGet, lsSet } from '@/lib/localstorage';
import TablePoissons from './results';
import Panier from './panier';
import { validation } from '@/lib/validation';

const FORM_LABEL_WIDTH = 7;  // Largeur des labels (1 à 12)

export default function SimulationStart () {

  const router = useRouter();

  const [poissonsCompatibles, setPoissonsCompatibles] = useState([]);
  const [listePoissons, setListePoissons] = useState(() => lsGet('listePoissons') || []);
  const [range, setRange] = useState([4, 12]);
  console.log('range=', range);

  const { data: poissonsData, error: poissonsError } = useSWR('/api/poissons');

  const { register, formState: { errors }, reset, watch } = useForm();

  const litrage = watch('litrage');
  const pH = watch('pH');
  const gH = watch('gH');
  const tempMoyenne = watch('tempMoyenne');

  const environnement = { litrage, pH, gH, tempMoyenne };

  useEffect(() => {
    lsSet('listePoissons', listePoissons);
  }, [listePoissons]);

  useEffect(() => {
    if (poissonsData && poissonsData.poissons) {
      const poissonsFiltres = poissonsData.poissons.filter(poisson =>
        poisson.litrage_mini <= litrage &&
        (!pH || (pH >= poisson.ph_mini && pH <= poisson.ph_maxi)) &&
        (!gH || (gH >= poisson.gh_mini && gH <= poisson.gh_maxi)) &&
        (!tempMoyenne || (tempMoyenne >= poisson.temp_mini && tempMoyenne <= poisson.temp_maxi))
      );
      setPoissonsCompatibles(poissonsFiltres);

      const idsPoissonsFiltres = poissonsFiltres.map(x => x.id);
      const newListePoissons = listePoissons.filter(
        x => idsPoissonsFiltres.indexOf(x.id) >= 0);
      setListePoissons(newListePoissons);
    }
  }, [poissonsData, litrage, pH, gH, tempMoyenne]);

  useEffect(() => {
    const cachedFormData = lsGet('form_data');
    if (cachedFormData) {
      reset(cachedFormData);
    }
  }, []);

  useEffect(() => {
    const formData = { litrage, pH, gH, tempMoyenne };
    lsSet('form_data', formData);
  }, [litrage, pH, gH, tempMoyenne]);

  const { ok, messages, ids } = validation(listePoissons, environnement);

  return <>

    <Row style={{ marginTop: 70 }}>

      <Col sm={4} className='ms-3'>
        <Form>
          <Form.Group as={Row} className="mb-3" controlId="litrage">
            <Form.Label column sm={FORM_LABEL_WIDTH}>Litrage de votre aquarium:</Form.Label>
            <Col sm={12 - FORM_LABEL_WIDTH}>
              <Form.Control type="number" {...register('litrage', {})} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="pH">
            <Form.Label column sm={FORM_LABEL_WIDTH}>pH moyen de votre aquarium:</Form.Label>
            <Col sm={12 - FORM_LABEL_WIDTH}>
              <Form.Control type="text" {...register('pH', { pattern: /^\d*\.?\d*$/, min: 0, max: 14 })} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="gH">
            <Form.Label column sm={FORM_LABEL_WIDTH}>gH moyen de votre aquarium:</Form.Label>
            <Col sm={12 - FORM_LABEL_WIDTH}>
              <Form.Control type="text" {...register('gH', { pattern: /^\d*\.?\d*$/ })} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="tempMoyenne">
            <Form.Label column sm={FORM_LABEL_WIDTH}>Température moyenne de votre aquarium:</Form.Label>
            <Col sm={12 - FORM_LABEL_WIDTH}>
              <Form.Control type="text" {...register('tempMoyenne', { pattern: /^-?\d*\.?\d*$/ })} />
            </Col>
          </Form.Group>
          <RangeSlider min={4} max={12} step={0.1} value={range} onInput={setRange}/>

          <Row className="mt-3">
            <Col>
              Valeur minimale: {range[0]}
            </Col>
            <Col>
              Valeur maximale: {range[1]}
            </Col>
          </Row>
        </Form>
      </Col>
      <Col>
        <h2>Résultats : {ok ? 'OK' : 'Pas OK'}</h2>
        {messages && <ul>
          {messages.map((m, index) => <li key={index}>{m}</li>)}
        </ul>}
        Les ids concernés sont {ids.join(', ')}
      </Col>
    </Row>

    {poissonsError ? (
      <h1>Une erreur est survenue lors du chargement des poissons.</h1>
    ) : poissonsCompatibles.length > 0 ? (
      <>
        <Panier listePoissons={listePoissons}
                setListePoissons={setListePoissons}
                environnement={environnement}/>
        <TablePoissons poissons={poissonsCompatibles}
                       listePoissons={listePoissons}
                       setListePoissons={setListePoissons}/>
      </>
    ) : null}

    <Button onClick={() => router.back()}>Retour à la page précédente</Button>

  </>;
}
