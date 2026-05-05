import Ecosystem from '@/components/sections/ecosystem'
import Faq from '@/components/sections/faq'
import FinalCta from '@/components/sections/final-cta'
import Founders from '@/components/sections/founders'
import Hero from '@/components/sections/hero'
import LearningJourney from '@/components/sections/learning-journey'
import Location from '@/components/sections/location'
import Metrics from '@/components/sections/metrics'
import Testimonials from '@/components/sections/testimonials'
import TrustStrip from '@/components/sections/trust-strip'
import WhyWeWin from '@/components/sections/why-we-win'

const HomePage = () => {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhyWeWin />
      <LearningJourney />
      <Ecosystem />
      <Metrics />
      <Testimonials />
      <Founders />
      <Location />
      <Faq />
      <FinalCta />
    </>
  )
}

export default HomePage
