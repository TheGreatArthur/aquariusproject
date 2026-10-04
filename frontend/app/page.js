/**
 * Page d'accueil
 */

import CallToAction from '@/components/home/CallToAction';
import FamilyGrid from '@/components/home/FamilyGrid';
import FishGlobe from '@/components/home/FishGlobe';
import Hero from '@/components/home/Hero';
import HowItWorks from '@/components/home/HowItWorks';

export default function HomePage () {
  return (
    <>
      <Hero/>
      <HowItWorks/>
      <FishGlobe/>
      <FamilyGrid/>
      <CallToAction/>
    </>
  );
}
