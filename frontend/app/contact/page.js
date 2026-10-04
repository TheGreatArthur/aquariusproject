'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

import { InstagramIcon } from '@/components/icons';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { INSTAGRAM_URL } from '@/lib/navigation';

const FIELDS = [
  { name: 'nom', label: 'Nom', type: 'text', autoComplete: 'family-name', half: true },
  { name: 'prenom', label: 'Prénom', type: 'text', autoComplete: 'given-name', half: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', spellCheck: false },
  { name: 'sujet', label: 'Sujet', type: 'text' },
];

export default function Formulaire() {

  const { register, reset, handleSubmit, formState: { isSubmitting } } = useForm();
  const [status, setStatus] = useState('idle'); // idle | sent | error

  const envoyerFormulaire = async ({ nom, prenom, email, sujet, message }) => {

    const emailContent = `Nom : ${nom}\nPrénom : ${prenom}\nEmail : ${email}\nSujet : ${sujet}\nMessage : ${message}`;

    // Envoyer l'e-mail via EmailJS
    try {
      await emailjs.send(
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
      );
      setStatus('sent');
      reset(); // Réinitialiser le formulaire
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
      setStatus('error');
    }
  };

  return <>
    <PageHeader eyebrow="Contact" title={'Une question, une espèce à ajouter\u00a0?'}>
      Écrivez-nous : suggestions, erreurs dans une fiche ou simple conseil, nous répondons à chaque message.
    </PageHeader>

    <div className="container grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <Reveal className="space-y-4">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Suivre le projet</h2>
          <p className="mt-2 text-sm text-muted">Photos de bacs, nouvelles espèces et coulisses du projet.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5">
            <InstagramIcon className="h-4 w-4"/> @projet.aquarius.pro
          </a>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Une donnée semble fausse&nbsp;?</h2>
          <p className="mt-2 text-sm text-muted">
            Indiquez le nom de l&apos;espèce et la source de votre information : nous vérifions et corrigeons la fiche.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <form onSubmit={handleSubmit(envoyerFormulaire)} className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          {FIELDS.map(({ name, label, type, autoComplete, spellCheck, half }) => (
            <div key={name} className={half ? '' : 'sm:col-span-2'}>
              <label htmlFor={name} className="label">{label}</label>
              <input id={name} type={type} autoComplete={autoComplete ?? 'off'} spellCheck={spellCheck} required
                     className="input" {...register(name)}/>
            </div>
          ))}

          <div className="sm:col-span-2">
            <label htmlFor="message" className="label">Message</label>
            <textarea id="message" rows="5" required className="input resize-y" {...register('message')}/>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p role="status" className="text-sm">
              {status === 'sent' && (
                <span className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4"/> Message envoyé, merci&nbsp;!
                </span>
              )}
              {status === 'error' && (
                <span className="text-danger">L&apos;envoi a échoué. Réessayez ou contactez-nous sur Instagram.</span>
              )}
            </p>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
              {isSubmitting ? 'Envoi…' : 'Envoyer'}
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  </>;
}
