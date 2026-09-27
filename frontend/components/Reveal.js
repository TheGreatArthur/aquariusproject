'use client';

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];

/**
 * Apparition au scroll (une seule fois).
 * Si l'utilisateur préfère moins d'animations, l'apparition est instantanée (durée nulle) : on garde
 * les mêmes états initial/final que le rendu serveur, sinon erreur d'hydratation ou opacité 0 jamais levée.
 */
export default function Reveal ({ children, delay = 0, y = 28, className, as = 'div' }) {
  const reduce = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}
