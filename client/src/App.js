import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

function App() {
  const [data, setData] = useState([{}]);
  const [showForm, setShowForm] = useState(false);
  const [hasFish, setHasFish] = useState(false); // State to track checkbox value
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    fetch("/members")
      .then(res => res.json())
      .then(data => {
        setData(data);
        console.log(data);
      });
  }, []);

  const handleSimulationClick = () => {
    setShowForm(true);
  };

  const doSimulation = (data) => {
    console.log(data);
  };

  const handleCheckboxChange = (event) => {
    setHasFish(event.target.checked);
  };

  return (
    <div>
      <button className="login-button">Login</button>

      <h1>Aquarius</h1>
      <button onClick={handleSimulationClick}>Simulation</button>
      <button>Liste du vivant</button>

      {showForm ? (
        <form onSubmit={handleSubmit(doSimulation)}>
          <label>
            Litrage de l'aquarium (en L):
            <input type="text" {...register('litrage')} />
          </label>
          <br />
          <label>
            Longueur de l'aquarium (en cm):
            <input type="text" {...register('longueur')} />
          </label>
          <br />
          <label>
            pH moyen de l'aquarium:
            <input type="text" {...register('pH')} />
          </label>
          <br />
          <label>
            gH moyen de l'aquarium:
            <input type="text" {...register('gH')} />
          </label>
          <br />
          <label>
            température moyenne de l'aquarium:
            <input type="text" {...register('°C')} />
          </label>
          <br />
          <label>
            Avez-vous des poissons dans cet aquarium?
            <input type="checkbox" onChange={handleCheckboxChange} />
          </label>
          <br />
          {hasFish && (
            <label>
              Type de poisson:
              <select {...register('fishType')}>
              <option value="guppy">Guppy ()</option>
              <option value="tetra">Tetra ()</option>
              <option value="poisson-rouge">Poisson rouge ()</option>
              {/* Ajoutez plus d'options au besoin */}
            </select>
           </label>
          )}
          <br />
          <button type="submit">Soumettre</button>
        </form>
      ) : (
        typeof data.members === 'undefined' ? (
          <p>Loading...</p>
        ) : (
          data.members.map((member, i) => (
            <p key={i}>{member}</p>
          ))
        )
      )}
    </div>
  );
}

export default App;
