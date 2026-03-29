import { Shield, AlertCircle, MapPin, Users, Lock, Heart, Zap, Trophy } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBranding } from '../Context/BrandingContext'

function About() {
  const { brandData } = useBranding()

  const features = [
    {
      icon: AlertCircle,
      title: 'Instant SOS Alerts',
      description: 'Send location and emergency alerts to trusted contacts in seconds'
    },
    {
      icon: MapPin,
      title: 'Live Location Sharing',
      description: 'Real-time location tracking with your trusted safety network'
    },
    {
      icon: Users,
      title: 'Trusted Network',
      description: 'Build your personal safety circle with verified contacts'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Your data stays private with end-to-end encryption'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '100K+', label: 'Alerts Sent' },
    { number: '24/7', label: 'Support' },
    { number: '99.9%', label: 'Reliability' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'We believe every woman deserves to feel safe and empowered'
    },
    {
      icon: Shield,
      title: 'Protection',
      description: 'Advanced technology to keep you and your loved ones protected'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Cutting-edge features that evolve with your needs'
    },
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'Best-in-class service and support for our community'
    }
  ]

  return (
    <div className='w-full theme-aurora-bg text-slate-100'>
      {/* Hero Section */}
      <section className='relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden flex items-center justify-center py-20'>
        {/* Animated Background */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        {/* Content */}
        <div className='relative z-10 text-center max-w-4xl mx-auto px-4 slide-up'>
          <div className='mb-6 inline-block'>
            <Shield size={80} className='text-white animate-bounce' />
          </div>
          <h1 className='text-6xl md:text-7xl font-black mb-6 leading-tight'>
            Your Private <br /> Safety Network
          </h1>
          <p className='text-xl md:text-2xl font-light text-white/90 mb-8 leading-relaxed'>
            {brandData.name} empowers women and families with instant SOS alerts, live location sharing, and trusted support.
          </p>
          <Link to="/get-started" className='inline-block btn-primary px-8 py-4 text-lg font-semibold rounded-lg shadow-2xl transform hover:scale-105 transition-all'>
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 bg-transparent'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center slide-up' style={{ animationDelay: `${index * 0.1}s` }}>
                <div className='text-4xl md:text-5xl font-black text-brand-primary mb-2'>
                  {stat.number}
                </div>
                <p className='text-slate-300 font-semibold text-sm md:text-base'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className='py-20 bg-transparent'>
        <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center'>
          <div className='slide-up'>
            <div className='relative h-96 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform'>
              <div className='absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-transparent'></div>
              <Shield size={200} className='absolute bottom-10 right-10 text-white opacity-50' />
            </div>
          </div>
          <div className='slide-up'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>Our Story</h2>
            <p className='text-lg text-slate-200 mb-4 leading-relaxed'>
              We created {brandData.name} to ensure that no one ever feels alone in moments of fear. In India, personal safety is a growing concern, and {brandData.name} was built to give every woman, child, and family the confidence that help is just one tap away.
            </p>
            <p className='text-lg text-slate-200 leading-relaxed'>
              What started as a mission has become a movement. Today, thousands of users trust {brandData.name} as their digital guardian, wherever they go.
            </p>
            <div className='mt-8 flex gap-4'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center'>
                  <Heart size={24} className='text-brand-primary' />
                </div>
                <div>
                  <p className='font-semibold text-white'>Mission-Driven</p>
                  <p className='text-sm text-slate-300'>Dedicated to safety</p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center'>
                  <Zap size={24} className='text-brand-primary' />
                </div>
                <div>
                  <p className='font-semibold text-white'>Innovation-Focused</p>
                  <p className='text-sm text-slate-300'>Cutting-edge tech</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className='py-20 bg-transparent'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center text-white mb-16'>Our Mission & Vision</h2>
          <div className='grid md:grid-cols-2 gap-12'>
            {/* Mission */}
            <div className='theme-card p-8 rounded-2xl border hover:border-brand-primary transition-all slide-up'>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-brand-primary to-red-700 flex items-center justify-center mb-6 text-white'>
                <Shield size={32} />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Mission</h3>
              <p className='text-lg text-gray-700 leading-relaxed'>
                To make safety accessible to everyone, everywhere. We believe that every person deserves to feel secure and protected, and we are committed to removing barriers to personal safety.
              </p>
              <div className='mt-6 pt-6 border-t-2 border-gray-100'>
                <p className='text-brand-primary font-semibold'>Safety for all</p>
              </div>
            </div>

            {/* Vision */}
            <div className='theme-card p-8 rounded-2xl border hover:border-brand-primary transition-all slide-up' style={{ animationDelay: '0.1s' }}>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-brand-secondary to-purple-700 flex items-center justify-center mb-6 text-white'>
                <Zap size={32} />
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>Vision</h3>
              <p className='text-lg text-gray-700 leading-relaxed'>
                A world where technology protects, empowers, and connects people instantly. We envision a future where fear does not limit freedom, and everyone can live, move, and thrive with confidence.
              </p>
              <div className='mt-6 pt-6 border-t-2 border-gray-100'>
                <p className='text-brand-secondary font-semibold'>Connected, secure, empowered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className='py-20 bg-transparent'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center text-white mb-4'>Core Features</h2>
          <p className='text-center text-slate-300 text-lg mb-16 max-w-2xl mx-auto'>
            Powerful tools designed to keep you and your loved ones safe
          </p>
          <div className='grid md:grid-cols-2 gap-8'>
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className='group p-8 rounded-2xl theme-card border hover:border-brand-primary hover:shadow-xl transition-all duration-300 slide-up'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-brand-primary to-red-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                    <IconComponent size={28} />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-700 leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className='py-20 bg-transparent'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-4xl font-bold text-center text-white mb-4'>Our Core Values</h2>
          <p className='text-center text-slate-300 text-lg mb-16 max-w-2xl mx-auto'>
            The principles that guide everything we do
          </p>
          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {values.map((value, index) => {
              const IconComponent = value.icon
              return (
                <div
                  key={index}
                  className='text-center p-6 rounded-xl theme-card-soft transition-all duration-300 slide-up'
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className='w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform'>
                    <IconComponent size={32} className='text-brand-primary' />
                  </div>
                  <h3 className='text-lg font-bold text-white mb-2'>{value.title}</h3>
                  <p className='text-slate-300 text-sm leading-relaxed'>{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className='py-20 bg-gradient-to-r from-brand-primary to-brand-secondary text-white relative overflow-hidden'>
        <div className='absolute inset-0 opacity-10'>
          <div className='absolute top-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl'></div>
        </div>
        <div className='max-w-6xl mx-auto px-4 relative z-10 text-center slide-up'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>Our Impact</h2>
          <p className='text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed'>
            {brandData.name} is trusted by thousands of users across India, helping families feel connected and secure. Every day, our platform processes thousands of safety checks and connections.
          </p>
          <div className='grid md:grid-cols-3 gap-8 mt-12'>
            <div className='backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20'>
              <p className='text-4xl font-bold mb-2'>50K+</p>
              <p className='text-white/80'>Active Users</p>
            </div>
            <div className='backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20'>
              <p className='text-4xl font-bold mb-2'>100K+</p>
              <p className='text-white/80'>Alerts Processed</p>
            </div>
            <div className='backdrop-blur-sm bg-white/10 p-6 rounded-xl border border-white/20'>
              <p className='text-4xl font-bold mb-2'>24/7</p>
              <p className='text-white/80'>Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-transparent'>
        <div className='max-w-4xl mx-auto px-4 text-center slide-up'>
          <h2 className='text-4xl md:text-5xl font-bold text-white mb-6'>
            Join the {brandData.name} Community
          </h2>
          <p className='text-xl text-slate-200 mb-8 leading-relaxed max-w-2xl mx-auto'>
            Join {brandData.name} today — because safety is not a privilege, it is your right. Become part of a movement that is changing how people stay connected and secure.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to="/get-started" className='inline-flex items-center justify-center btn-primary px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all'>
              Get Started Free
            </Link>
            <Link to="/learn" className='inline-flex items-center justify-center btn-outline px-8 py-4 text-lg font-semibold rounded-lg border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5 transition-all'>
              Learn More
            </Link>
          </div>
          <p className='text-gray-500 text-sm mt-8'>No credit card required. Join thousands of satisfied users.</p>
        </div>
      </section>

      {/* Trust & Security */}
      <section className='py-16 bg-gradient-to-r from-gray-900 to-gray-950 text-white'>
        <div className='max-w-6xl mx-auto px-4'>
          <h3 className='text-2xl font-bold text-center mb-12'>Trusted & Secure</h3>
          <div className='grid md:grid-cols-3 gap-8 text-center'>
            <div>
              <div className='text-4xl mb-3'>🔒</div>
              <p className='font-semibold mb-2'>End-to-End Encryption</p>
              <p className='text-gray-400 text-sm'>Your data is encrypted and protected</p>
            </div>
            <div>
              <div className='text-4xl mb-3'>✓</div>
              <p className='font-semibold mb-2'>Privacy First</p>
              <p className='text-gray-400 text-sm'>We respect your privacy completely</p>
            </div>
            <div>
              <div className='text-4xl mb-3'>⚡</div>
              <p className='font-semibold mb-2'>Always Available</p>
              <p className='text-gray-400 text-sm'>24/7 monitoring and support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
