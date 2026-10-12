'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Loader2, Send } from 'lucide-react';

import { useI18n } from '@/components/I18nProvider';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';

const FIELDS = [
  { name: 'nom', label: 'Nom', en: 'Last name', ja: '姓', type: 'text', autoComplete: 'family-name', max: 100, half: true },
  { name: 'prenom', label: 'Prénom', en: 'First name', ja: '名', type: 'text', autoComplete: 'given-name', max: 100, half: true },
  { name: 'email', label: 'Email', en: 'Email', ja: 'メールアドレス', type: 'email', autoComplete: 'email', max: 254, spellCheck: false },
  { name: 'sujet', label: 'Sujet', en: 'Subject', ja: '件名', type: 'text', max: 150 },
];

// Erreurs renvoyées par l'API (backend/contact.py), par champ
const ERREURS = {
  requis: ['Champ obligatoire.', 'Required field.', '必須項目です。'],
  'trop long': ['Texte trop long.', 'Text too long.', '文字数が多すぎます。'],
  invalide: ['Valeur invalide.', 'Invalid value.', '入力内容が正しくありません。'],
};

export default function Formulaire () {
  const { t, href } = useI18n();
  const { register, reset, handleSubmit, formState: { isSubmitting } } = useForm();
  const [status, setStatus] = useState('idle'); // idle | sent | error | unavailable
  const [erreurs, setErreurs] = useState({});
  // Moment où le formulaire s'affiche : l'API écarte les envois trop rapides pour un humain
  const affiche = useRef(0);
  useEffect(() => { affiche.current = Date.now(); }, []);

  const envoyer = async (champs) => {
    setErreurs({});
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...champs, delai: Date.now() - affiche.current }),
      });
      if (res.status === 400) {
        setErreurs((await res.json()).erreurs ?? {});
        setStatus('idle');
      } else if (res.ok) {
        setStatus('sent');
        reset();
      } else
        setStatus(res.status === 503 ? 'unavailable' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const erreur = (name) => erreurs[name] && (
    <p id={`${name}-erreur`} className="mt-1.5 text-sm text-danger">{t(...ERREURS[erreurs[name]])}</p>
  );

  return <>
    <PageHeader eyebrow="Contact" title={t('Une question, une espèce à ajouter ?', 'A question, a species to add?', 'ご質問や追加してほしい種はありますか？')}>
      {t('Écrivez-nous : suggestions, erreurs dans une fiche ou simple conseil, nous répondons à chaque message.',
        'Write to us: suggestions, mistakes in a profile or simple advice, we answer every message.',
        'ご提案、図鑑の誤り、ちょっとした相談など、お気軽にどうぞ。すべてのメッセージにお返事します。')}
    </PageHeader>

    <div className="container grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <Reveal className="space-y-4">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">{t('Une donnée semble fausse ?', 'Does something look wrong?', '情報に誤りがありますか？')}</h2>
          <p className="mt-2 text-sm text-muted">
            {t('Indiquez le nom de l\'espèce et la source de votre information : nous vérifions et corrigeons la fiche.',
              'Give the species name and the source of your information: we check and correct the profile.',
              '種名と情報の出典をお知らせください。確認のうえ図鑑を修正します。')}
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold">{t('Où va votre message ?', 'Where does your message go?', 'メッセージの送り先')}</h2>
          <p className="mt-2 text-sm text-muted">
            {t('Directement dans la boîte mail de l\'éditeur, sans service tiers. Vos nom et adresse ne servent qu\'à vous '
              + 'répondre. ',
            'Straight to the publisher\'s mailbox, with no third-party service. Your name and address are only used to '
              + 'answer you. ',
            '外部のサービスを通さず、運営者のメールボックスに直接届きます。お名前とアドレスは返信のためだけに使います。')}
            <Link href={`${href('/cgu')}#donnees`} className="text-accent-glow underline-offset-4 hover:underline">
              {t('Vos données', 'Your data', '個人情報について')}
            </Link>
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        {/* handleSubmit appelé au moment de l'envoi, pas au rendu : envoyer lit l'heure et la référence */}
        <form onSubmit={(e) => handleSubmit(envoyer)(e)} className="card relative grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
          {FIELDS.map(({ name, label, en, ja, type, autoComplete, spellCheck, max, half }) => (
            <div key={name} className={half ? '' : 'sm:col-span-2'}>
              <label htmlFor={name} className="label">{t(label, en, ja)}</label>
              <input id={name} type={type} autoComplete={autoComplete ?? 'off'} spellCheck={spellCheck} required
                     maxLength={max} aria-invalid={erreurs[name] ? 'true' : undefined}
                     aria-describedby={erreurs[name] ? `${name}-erreur` : undefined}
                     className="input" {...register(name)}/>
              {erreur(name)}
            </div>
          ))}

          <div className="sm:col-span-2">
            <label htmlFor="message" className="label">Message</label>
            <textarea id="message" rows="5" required maxLength={5000} className="input resize-y"
                      aria-invalid={erreurs.message ? 'true' : undefined}
                      aria-describedby={erreurs.message ? 'message-erreur' : undefined} {...register('message')}/>
            {erreur('message')}
          </div>

          {/* Piège à robots : invisible et hors du parcours au clavier, un humain le laisse vide */}
          <div className="absolute -left-[9999px] top-0" aria-hidden="true">
            <label htmlFor="site">Site</label>
            <input id="site" type="text" tabIndex={-1} autoComplete="off" {...register('site')}/>
          </div>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <p role="status" className="text-sm">
              {status === 'sent' && (
                <span className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4"/> {t('Message envoyé, merci !', 'Message sent, thank you!', '送信しました。ありがとうございます！')}
                </span>
              )}
              {status === 'error' && (
                <span className="text-danger">
                  {t('L\'envoi a échoué. Réessayez dans quelques minutes.', 'Sending failed. Please try again in a few minutes.',
                    '送信に失敗しました。数分後にもう一度お試しください。')}
                </span>
              )}
              {status === 'unavailable' && (
                <span className="text-danger">
                  {t('Le formulaire n\'est pas encore relié à une boîte mail. Réessayez plus tard.',
                    'The form is not connected to a mailbox yet. Please try again later.',
                    'このフォームはまだメールボックスに接続されていません。しばらくしてからお試しください。')}
                </span>
              )}
            </p>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
              {isSubmitting ? t('Envoi…', 'Sending…', '送信中…') : t('Envoyer', 'Send', '送信')}
            </button>
          </div>
        </form>
      </Reveal>
    </div>
  </>;
}
