import { Shield, AlertCircle, MapPin, Users, Lock, Heart, Zap, Trophy, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useBranding } from '../Context/BrandingContext'

function About() {
  const { brandData } = useBranding()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('story')

  const features = [
    { icon: AlertCircle, title: 'Instant SOS Alerts', description: 'Send location and emergency alerts to trusted contacts in seconds' },
    { icon: MapPin, title: 'Live Location Sharing', description: 'Real-time location tracking with your trusted safety network' },
    { icon: Users, title: 'Trusted Network', description: 'Build your personal safety circle with verified contacts' },
    { icon: Lock, title: 'Privacy First', description: 'Your data stays private with end-to-end encryption' }
  ]

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '100K+', label: 'Alerts Sent' },
    { number: '24/7', label: 'Support' },
    { number: '99.9%', label: 'Reliability' }
  ]

  const values = [
    { icon: Heart, title: 'Empowerment', description: 'We believe every woman deserves to feel safe and empowered' },
    { icon: Shield, title: 'Protection', description: 'Advanced technology to keep you and your loved ones protected' },
    { icon: Zap, title: 'Innovation', description: 'Cutting-edge features that evolve with your needs' },
    { icon: Trophy, title: 'Excellence', description: 'Best-in-class service and support for our community' }
  ]

  const sections = [
    { id: 'story', name: 'Our Story', icon: '📖' },
    { id: 'mission', name: 'Mission & Vision', icon: '🎯' },
    { id: 'features', name: 'Features', icon: '✨' },
    { id: 'values', name: 'Our Values', icon: '💜' },
    { id: 'impact', name: 'Our Impact', icon: '🚀' }
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className='w-full bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 text-slate-900'>
      {/* Hero Section */}
      <section className='relative min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 text-white overflow-hidden flex items-center justify-center py-20'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-white opacity-15 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>
        <div className='relative z-10 text-center max-w-4xl mx-auto px-4'>
          <div className='mb-6 inline-block'>
            <Shield size={80} className='text-white animate-bounce' />
          </div>
          <h1 className='text-6xl md:text-7xl font-black mb-6 leading-tight'>Your Private <br /> Safety Network</h1>
          <p className='text-xl md:text-2xl font-light text-white/90 mb-8 leading-relaxed'>
            {brandData.name} empowers women and families with instant SOS alerts, live location sharing, and trusted support.
          </p>
          <Link to="/get-started" className='inline-block px-8 py-4 text-lg font-semibold rounded-lg shadow-2xl transform hover:scale-105 transition-all bg-white text-pink-600 hover:bg-purple-50'>
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Navigation Bar */}
      <section className='sticky top-0 z-40 bg-white shadow-lg border-b-2 border-purple-200'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='flex items-center justify-between'>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='lg:hidden px-4 py-3 text-purple-600 hover:bg-purple-50 rounded-lg transition-all'
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className='hidden lg:flex items-center gap-2 py-4'>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-sm ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
                  }`}
                >
                  <span className='mr-2'>{section.icon}</span>
                  {section.name}
                </button>
              ))}
            </div>

            {mobileMenuOpen && (
              <div className='lg:hidden absolute top-full left-0 right-0 bg-white border-t-2 border-purple-200 shadow-lg p-4 space-y-2'>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-semibold ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'text-slate-700 hover:bg-purple-100'
                    }`}
                  >
                    <span className='mr-2'>{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 bg-white border-b-2 border-purple-200'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
                  {stat.number}
                </div>
                <p className='text-slate-700 font-semibold text-sm md:text-base'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section id='section-story' className='py-24 scroll-mt-32'>
        <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <div className='relative h-96 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform'>
              <Shield size={200} className='absolute bottom-10 right-10 text-white opacity-50' />
            </div>
          </div>
          <div>
            <h2 className='text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-6'>Our Story</h2>
            <p className='text-lg text-slate-700 mb-4 leading-relaxed font-medium'>
              We created {brandData.name} to ensure that no one ever feels alone in moments of fear. In India, personal safety is a growing concern, and {brandData.name} was built to give every woman, child, and family the confidence that help is just one tap away.
            </p>
            <p className='text-lg text-slate-700 leading-relaxed font-medium mb-8'>
              What started as a mission has become a movement. Today, thousands of users trust {brandData.name} as their digital guardian, wherever they go.
            </p>
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-4 p-4 bg-purple-50 rounded-xl border-2 border-purple-300'>
                <Heart size={24} className='text-white bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-2' />
                <div>
                  <p className='font-bold text-purple-900'>Mission-Driven</p>
                  <p className='text-sm text-slate-600'>Dedicated to safety & empowerment</p>
                </div>
              </div>
              <div className='flex items-center gap-4 p-4 bg-pink-50 rounded-xl border-2 border-pink-300'>
                <Zap size={24} className='text-white bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-2' />
                <div>
                  <p className='font-bold text-pink-900'>Innovation-Focused</p>
                  <p className='text-sm text-slate-600'>Cutting-edge technology</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id='section-mission' className='py-24 bg-gradient-to-b from-purple-50 to-pink-50 scroll-mt-32'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-16'>Mission & Vision</h2>
          <div className='grid md:grid-cols-2 gap-12'>
            <div className='bg-white p-8 rounded-2xl border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6 text-white shadow-lg'>
                <Shield size={32} />
              </div>
              <h3 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-4'>Mission</h3>
              <p className='text-lg text-slate-700 leading-relaxed font-medium'>
                To make safety accessible to everyone, everywhere. We believe that every person deserves to feel secure and protected, and we are committed to removing barriers to personal safety.
              </p>
              <div className='mt-6 pt-6 border-t-2 border-purple-200'>
                <p className='text-purple-700 font-bold'>🎯 Safety for all</p>
              </div>
            </div>

            <div className='bg-white p-8 rounded-2xl border-2 border-pink-300 shadow-lg hover:shadow-xl transition-all hover:scale-105'>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center mb-6 text-white shadow-lg'>
                <Zap size={32} />
              </div>
              <h3 className='text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 mb-4'>Vision</h3>
              <p className='text-lg text-slate-700 leading-relaxed font-medium'>
                A world where technology protects, empowers, and connects people instantly. We envision a future where fear does not limit freedom, and everyone can live, move, and thrive with confidence.
              </p>
              <div className='mt-6 pt-6 border-t-2 border-pink-200'>
                <p className='text-pink-700 font-bold'>💫 Connected, secure, empowered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id='section-features' className='py-24 scroll-mt-32'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-6'>Core Features</h2>
          <p className='text-center text-slate-700 text-lg mb-16 max-w-2xl mx-auto font-medium'>
            Powerful tools designed to keep you and your loved ones safe
          </p>
          <div className='grid md:grid-cols-2 gap-8'>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className='group p-8 rounded-2xl bg-white border-2 border-purple-200 hover:border-pink-500 hover:shadow-xl transition-all duration-300'
                >
                  <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg'>
                    <IconComponent size={28} />
                  </div>
                  <h3 className='text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-pink-600 transition-all'>
                    {feature.title}
                  </h3>
                  <p className='text-slate-700 leading-relaxed font-medium'>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section id='section-values' className='py-24 bg-gradient-to-b from-purple-50 to-pink-50 scroll-mt-32'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-5xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-6'>Our Core Values</h2>
          <p className='text-center text-slate-700 text-lg mb-16 max-w-2xl mx-auto font-medium'>
            The principles that guide everything we do
          </p>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={index}
                  className='text-center p-6 bg-white rounded-2xl border-2 border-purple-200 hover:border-pink-500 transition-all hover:shadow-lg'
                >
                  <div className='w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-lg'>
                    <IconComponent size={32} className='text-white' />
                  </div>
                  <h3 className='text-xl font-bold text-slate-900 mb-2'>{value.title}</h3>
                  <p className='text-slate-700 text-sm leading-relaxed font-medium'>{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id='section-impact' className='py-24 bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 text-white relative overflow-hidden scroll-mt-32'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl'></div>
        </div>
        <div className='max-w-6xl mx-auto px-4 relative z-10'>
          <h2 className='text-5xl font-black text-center mb-6'>Our Impact</h2>
          <p className='text-xl text-white/90 text-center mb-12 max-w-3xl mx-auto leading-relaxed font-medium'>
            {brandData.name} is trusted by thousands of users across India, helping families feel connected and secure. Every day, our platform processes thousands of safety checks and connections.
          </p>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='backdrop-blur-sm bg-white/15 p-8 rounded-2xl border-2 border-white/30 text-center hover:bg-white/20 transition-all hover:scale-105'>
              <p className='text-5xl font-black mb-3'>50K+</p>
              <p className='text-lg font-bold text-white/90'>Active Users</p>
            </div>
            <div className='backdrop-blur-sm bg-white/15 p-8 rounded-2xl border-2 border-white/30 text-center hover:bg-white/20 transition-all hover:scale-105'>
              <p className='text-5xl font-black mb-3'>100K+</p>
              <p className='text-lg font-bold text-white/90'>Alerts Processed</p>
            </div>
            <div className='backdrop-blur-sm bg-white/15 p-8 rounded-2xl border-2 border-white/30 text-center hover:bg-white/20 transition-all hover:scale-105'>
              <p className='text-5xl font-black mb-3'>24/7</p>
              <p className='text-lg font-bold text-white/90'>Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24'>
        <div className='max-w-4xl mx-auto px-4 text-center'>
          <h2 className='text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-6'>
            Join the {brandData.name} Community
          </h2>
          <p className='text-xl text-slate-700 mb-12 leading-relaxed max-w-2xl mx-auto font-medium'>
            Join {brandData.name} today — because safety is not a privilege, it is your right. Become part of a movement that is changing how people stay connected and secure.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to="/get-started" className='inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-purple-600 to-pink-600 text-white'>
              Get Started Free
            </Link>
            <Link to="/learn" className='inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-lg border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all'>
              Learn More
            </Link>
          </div>
          <p className='text-slate-600 text-sm mt-8 font-medium'>No credit card required. Join thousands of satisfied users.</p>
        </div>
      </section>

      {/* Trust & Security */}
      <section className='py-16 bg-gradient-to-r from-slate-900 to-slate-950 text-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <h3 className='text-3xl font-bold text-center mb-12'>Trusted & Secure</h3>
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            <div className='p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500 transition-all'>
              <div className='text-5xl mb-4'>🔒</div>
              <p className='font-bold mb-2 text-lg'>End-to-End Encryption</p>
              <p className='text-gray-300 font-medium'>Your data is encrypted and protected</p>
            </div>
            <div className='p-6 rounded-xl bg-white/5 border border-white/10 hover:border-pink-500 transition-all'>
              <div className='text-5xl mb-4'>✓</div>
              <p className='font-bold mb-2 text-lg'>Privacy First</p>
              <p className='text-gray-300 font-medium'>We respect your privacy completely</p>
            </div>
            <div className='p-6 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500 transition-all'>
              <div className='text-5xl mb-4'>⚡</div>
              <p className='font-bold mb-2 text-lg'>Always Available</p>
              <p className='text-gray-300 font-medium'>24/7 monitoring and support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
