import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([{}]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});

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
  }

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Traitement des données du formulaire ici
    console.log(formData);
  };

  return (
    <div>
      <button className="login-button">Login</button>

      <h1>Aquarius</h1>
      <button onClick={handleSimulationClick}>Simulation</button>
      <button>Liste du vivant</button>

      {showForm ? (
        <form onSubmit={handleSubmit}>
          <label>
            Litrage de l'aquarium (en L):
            <input
              type="text"
              name="litrage"
              value={formData.litrage || ''}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Longueur de l'aquarium (en cm):
            <input
              type="text"
              name="longueur"
              value={formData.longueur || ''}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            pH moyen de l'aquarium:
            <input
              type="text"
              name="pH"
              value={formData.pH || ''}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            température moyenne de l'aquarium:
            <input
              type="text"
              name="température"
              value={formData.temperature || ''}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            gH moyen de l'aquarium:
            <input
              type="text"
              name="gH"
              value={formData.gH || ''}
              onChange={handleInputChange}
            />
          </label>
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
