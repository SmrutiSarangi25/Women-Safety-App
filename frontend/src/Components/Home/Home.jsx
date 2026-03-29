import HeroSection from './HeroSection'
import WhatsABubble from './WhatsABubble'
import HowItWorks from './HowItWorks'
import WeDont from './WeDont'
import FindEssentials from './FindEssentials'
import Features from './Features'
import QuickActions from './QuickActions'
import TrustBadges from './TrustBadges'
import TrustedAroundWorld from './TrustedAroundWorld'
import Testimonials from './Testimonials'
import RealStories from './RealStories'
import Footer from '../Footer'

function Home() {
  return (
    <div className='w-full theme-aurora-bg theme-shell'>
      <HeroSection />
      <section aria-label='What is Bubble'>
        <WhatsABubble />
      </section>
      <section aria-label='How it works'>
        <HowItWorks />
      </section>
      <section aria-label='What we do not do'>
        <WeDont />
      </section>
      <section aria-label='Quick safety actions'>
        <QuickActions />
      </section>
      <section aria-label='Find essentials'>
        <FindEssentials />
      </section>
      <section aria-label='Features'>
        <Features />
      </section>
      <section aria-label='Trusted by organizations'>
        <TrustBadges />
      </section>
      <section aria-label='Global trust'>
        <TrustedAroundWorld />
      </section>
      <section aria-label='Testimonials'>
        <Testimonials />
      </section>
      <section aria-label='Real stories'>
        <RealStories />
      </section>
      <Footer />
    </div>
  )
}

export default Home