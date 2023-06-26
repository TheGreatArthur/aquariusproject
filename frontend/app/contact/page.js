'use client';

import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import emailjs from '@emailjs/browser';

function Formulaire () {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const envoyerFormulaire = ({ nom, prenom, email, sujet, message }) => {

    const emailContent = `Nom : ${nom}\nPrénom : ${prenom}\nEmail : ${email}\nSujet : ${sujet}\nMessage : ${message}`;

    // Envoyer l'e-mail via EmailJS
    emailjs.send(
      'aquarius.service',
      'template_x2ip0k9',
      {
        to_email:   'projet.aquarius.pro@gmail.com',
        from_name:  `${nom} ${prenom}`,
        from_email: email,
        subject:    sujet,
        message:    emailContent
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

  return <>

    <h1>Nous contacter</h1>

    <form onSubmit={handleSubmit(envoyerFormulaire)}>

      <label htmlFor="nom">Nom :</label>
      <input type="text" required{...register('nom')}/>
      <br/><br/>

      <label htmlFor="prenom">Prénom :</label>
      <input type="text" required{...register('nom')}/>
      <br/><br/>

      <label htmlFor="email">Email :</label>
      <input type="email" required{...register('email')}/>
      <br/><br/>

      <label htmlFor="sujet">Sujet :</label>
      <input type="text" required{...register('sujet')}/>
      <br/><br/>

      <label htmlFor="message">Message :</label><br/>
      <textarea rows="4" required{...register('message')}/>
      <br/><br/>

      <Button type="submit">Envoyer</Button>

    </form>

  </>;
}

export default Formulaire;
