/**
 * Page d'accueil
 */

import CallToAction from '@/components/home/CallToAction';
import FamilyGrid from '@/components/home/FamilyGrid';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';

export default function HomePage () {
  return (
    <>
      <Hero/>
      <HowItWorks/>
      <FamilyGrid/>
      <CallToAction/>
    </>
  );
}
