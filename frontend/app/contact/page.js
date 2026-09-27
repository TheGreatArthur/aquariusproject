'use client';

import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import emailjs from '@emailjs/browser';
import styles from './Formulaire.module.scss';


export default function Formulaire() {

  const { register, reset, handleSubmit } = useForm();

  const envoyerFormulaire = ({ nom, prenom, email, sujet, message }) => {

    const emailContent = `Nom : ${nom}\nPrénom : ${prenom}\nEmail : ${email}\nSujet : ${sujet}\nMessage : ${message}`;

    // Envoyer l'e-mail via EmailJS
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      {
        to_email: process.env.NEXT_PUBLIC_EMAILJS_TO,
        from_name: `${nom} ${prenom}`,
        from_email: email,
        subject: sujet,
        message: emailContent
      },
      process.env.NEXT_PUBLIC_EMAILJS_KEY
    )
      .then((response) => {
        console.log('E-mail envoyé avec succès !', response);
        reset(); // Réinitialiser le formulaire
      })
      .catch((error) => {
        console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      });
  };

  return <div className={styles.container}>

    <div className='shade'>

      <h1>Nous contacter</h1>

      <form onSubmit={handleSubmit(envoyerFormulaire)}>

        <div className={styles.formGroup}>
          <label htmlFor="nom">Nom :</label>
          <input type="text" required {...register('nom')} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="prenom">Prénom :</label>
          <input type="text" required {...register('prenom')} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email :</label>
          <input type="email" required {...register('email')} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="sujet">Sujet :</label>
          <input type="text" required {...register('sujet')} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">Message :</label>
          <textarea rows="4" required {...register('message')} />
        </div>

        <Button type="submit" className={styles.submitButton}>Envoyer</Button>

      </form>
    </div>

  </div>;
}
