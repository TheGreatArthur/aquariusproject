'use client'

import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import BasicExample from '@/app/nav';
import styles from './Formulaire.module.css';

function Formulaire() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');

  const envoyerFormulaire = (e) => {
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
    <div className={styles.container}>
      <BasicExample />
      <h1>Nous contacter</h1>
      <form onSubmit={envoyerFormulaire} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="nom" className={styles.label}>Nom:</label>
          <input
            type="text"
            id="nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="prenom" className={styles.label}>Prénom :</label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>Votre texte :</label>
          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>Envoyer</button>
      </form>
    </div>
  );
}

export default Formulaire;
