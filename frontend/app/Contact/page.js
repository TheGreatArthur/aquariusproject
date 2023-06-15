'use client'

import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function Formulaire() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');

  const envoyerFormulaire = (e) => {
    console.log(e)
    e.preventDefault();

    const emailContent = `Nom : ${nom}\nPrénom : ${prenom}\nEmail : ${email}\nSujet : ${sujet}\nMessage : ${message}`;

    // Envoyer l'e-mail via EmailJS
    emailjs.send(
      'aquarius.service',
      'template_x2ip0k9',
      {
        to_email: 'projet.aquarius.pro@gmail.com',
        from_name: `${nom} ${prenom}`,
        from_email: email,
        subject: sujet,
        message: emailContent
      },
      process.env.NEXT_PUBLIC_EMAIL_JS_KEY
    )
      .then((response) => {
        console.log('E-mail envoyé avec succès !', response);
        // Réinitialiser le formulaire
        setNom('');
        setPrenom('');
        setEmail('');
        setSujet('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      });
  };

  return (
    <div>
      <h1>Nous contacter</h1>
      <form onSubmit={envoyerFormulaire}>
        <label htmlFor="nom">Nom :</label>
        <input
          type="text"
          id="nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="prenom">Prénom :</label>
        <input
          type="text"
          id="prenom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="sujet">Sujet :</label>
        <input
          type="text"
          id="sujet"
          value={sujet}
          onChange={(e) => setSujet(e.target.value)}
          required
        /><br /><br />

        <label htmlFor="message">Message :</label><br />
        <textarea
          id="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea><br /><br />

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default Formulaire;
