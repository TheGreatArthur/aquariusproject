"use client"

import Image from 'next/image'
import Link from 'next/link'

import styles from './page.module.css'
import { ControlledCarousel } from './ControlledCarousel';




export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <ControlledCarousel/>
      </div>

      <div className={styles.grid}>
        <Link
          href="/poissons"
          className={styles.card}
        >
          <h2>
            Poissons <span>-&gt;</span>
          </h2>
          <p>La liste des poissons d'aquarium.</p>
        </Link>

        <Link
          href="/Simulation"
          className={styles.card}
        >
          <h2>
            Simulation <span>-&gt;</span>
          </h2>
          <p>Simulez l'environnement de votre propre aquarium.
</p>
        </Link>

        <a
          href="/Contact"
          className={styles.card}
        >
          <h2>
            Contact <span>-&gt;</span>
          </h2>
          <p>Remplissez ce formlaire pour nous contacter.</p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className={styles.card}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2>
            A propos <span>-&gt;</span>
          </h2>
          <p>
            A propos de nous et de nos objectifs.
          </p>
        </a>
      </div>
    </main>
  )
}
