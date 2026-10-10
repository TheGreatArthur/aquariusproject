'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import emailjs from '@emailjs/browser';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import { InstagramIcon } from '@/components/icons';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import { INSTAGRAM_URL } from '@/lib/navigation';

const FIELDS = [
  { name: 'nom', label: 'Nom', en: 'Last name', type: 'text', autoComplete: 'family-name', half: true },
  { name: 'prenom', label: 'Prénom', en: 'First name', type: 'text', autoComplete: 'given-name', half: true },
  { name: 'email', label: 'Email', en: 'Email', type: 'email', autoComplete: 'email', spellCheck: false },
  { name: 'sujet', label: 'Sujet', en: 'Subject', type: 'text' },
];

export default function Formulaire() {
  const { t } = useI18n();

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
    <PageHeader eyebrow="Contact" title={t('Une question, une espèce à ajouter\u00a0?', 'A question, a species to add?')}>
      {t('Écrivez-nous : suggestions, erreurs dans une fiche ou simple conseil, nous répondons à chaque message.',
        'Write to us: suggestions, mistakes in a profile or simple advice, we answer every message.')}
    </PageHeader>

    <div className="container grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <Reveal className="space-y-4">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">{t('Suivre le projet', 'Follow the project')}</h2>
          <p className="mt-2 text-sm text-muted">
            {t('Photos de bacs, nouvelles espèces et coulisses du projet.', 'Tank photos, new species and behind the scenes.')}
          </p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-5">
            <InstagramIcon className="h-4 w-4"/> @projet.aquarius.pro
          </a>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">{t('Une donnée semble fausse\u00a0?', 'Does something look wrong?')}</h2>
          <p className="mt-2 text-sm text-muted">
            {t('Indiquez le nom de l\'espèce et la source de votre information : nous vérifions et corrigeons la fiche.',
              'Give the species name and the source of your information: we check and correct the profile.')}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <form onSubmit={handleSubmit(envoyerFormulaire)} className="card grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          {FIELDS.map(({ name, label, en, type, autoComplete, spellCheck, half }) => (
            <div key={name} className={half ? '' : 'sm:col-span-2'}>
              <label htmlFor={name} className="label">{t(label, en)}</label>
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
                  <CheckCircle2 className="h-4 w-4"/> {t('Message envoyé, merci\u00a0!', 'Message sent, thank you!')}
                </span>
              )}
              {status === 'error' && (
                <span className="text-danger">
                  {t('L\'envoi a échoué. Réessayez ou contactez-nous sur Instagram.', 'Sending failed. Try again or contact us on Instagram.')}
                </span>
              )}
            </p>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
              {isSubmitting ? t('Envoi…', 'Sending…') : t('Envoyer', 'Send')}
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  </>;
}
