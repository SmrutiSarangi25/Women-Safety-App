import { Link } from 'react-router-dom'
import { Heart, Shield, MapPin, AlertCircle, Users, Smartphone } from 'lucide-react'

function GetStarted() {
  const steps = [
    {
      icon: <Smartphone className='w-8 h-8' />,
      title: 'Download & Install',
      description: 'Get RAKSHA from your app store and complete the quick setup process'
    },
    {
      icon: <Users className='w-8 h-8' />,
      title: 'Create Your Profile',
      description: 'Sign up with your details and set up your emergency contacts'
    },
    {
      icon: <MapPin className='w-8 h-8' />,
      title: 'Enable Location',
      description: 'Allow location access for real-time emergency tracking'
    },
    {
      icon: <Shield className='w-8 h-8' />,
      title: 'Customize Alerts',
      description: 'Set up your SOS alert preferences (SMS, Email, WhatsApp)'
    }
  ]

  const features = [
    {
      icon: <AlertCircle className='w-12 h-12 text-red-600' />,
      title: 'One-Tap SOS',
      description: 'Send emergency alerts to your trusted contacts in seconds'
    },
    {
      icon: <MapPin className='w-12 h-12 text-blue-600' />,
      title: 'Real-Time Tracking',
      description: 'Share your live location with selected emergency contacts'
    },
    {
      icon: <Heart className='w-12 h-12 text-pink-600' />,
      title: 'Trusted Network',
      description: 'Build a network of people you trust for support'
    },
    {
      icon: <Shield className='w-12 h-12 text-green-600' />,
      title: 'Self Defence Tips',
      description: 'Access comprehensive self-defence guides and safety tips'
    },
    {
      icon: <Users className='w-12 h-12 text-purple-600' />,
      title: 'Community Support',
      description: 'Connect with others and share experiences safely'
    },
    {
      icon: <Smartphone className='w-12 h-12 text-orange-600' />,
      title: 'Offline Alerts',
      description: 'Send emergency SMS alerts even without internet'
    }
  ]

  const stats = [
    { number: '50K+', label: 'Active Users' },
    { number: '24/7', label: 'Emergency Support' },
    { number: '50+', label: 'Self Defence Guides' },
    { number: '100%', label: 'Data Secure' }
  ]

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started',
      features: [
        'SOS Alert to 5 contacts',
        'Location sharing',
        'Self defence guides',
        'Community access'
      ]
    },
    {
      name: 'Premium',
      price: '₹99',
      period: '/month',
      description: 'For premium protection',
      featured: true,
      features: [
        'Unlimited SOS alerts',
        'Real-time tracking dashboard',
        'Priority support',
        'Advanced analytics',
        'Safety check-ins',
        'Automated alerts'
      ]
    },
    {
      name: 'Family',
      price: '₹199',
      period: '/month',
      description: 'Protect your loved ones',
      features: [
        'Up to 5 family members',
        'All premium features',
        'Family dashboard',
        'Shared location tracking',
        'Priority support',
        'Emergency call center access'
      ]
    }
  ]

  return (
    <div className='w-full theme-aurora-bg'>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h1 className='text-5xl font-bold mb-6'>Start Your Safety Journey Today</h1>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            RAKSHA helps you stay safe with real-time emergency alerts, location tracking, and a supportive community
          </p>
          <div className='flex gap-4 justify-center flex-wrap'>
            <Link
              to="/signup"
              className='inline-flex items-center justify-center px-8 py-3 bg-white text-pink-600 rounded-lg font-semibold hover:bg-gray-100 transition'
            >
              Get Started Free
            </Link>
            <button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className='px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition'
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Quick Start Steps */}
      <section className='py-16 max-w-7xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-white mb-4'>Get Started in 4 Easy Steps</h2>
          <p className='text-slate-200 max-w-2xl mx-auto'>
            Set up RAKSHA and be protected in just minutes
          </p>
        </div>

        <div className='grid md:grid-cols-4 gap-6'>
          {steps.map((step, index) => (
            <div key={index} className='relative'>
              <div className='theme-card rounded-lg p-6 shadow-md hover:shadow-lg transition text-center'>
                <div className='w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center text-pink-600'>
                  {step.icon}
                </div>
                <div className='absolute top-0 left-0 w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold -ml-4'>
                  {index + 1}
                </div>
                <h3 className='font-semibold text-gray-800 mb-2'>{step.title}</h3>
                <p className='text-gray-600 text-sm'>{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className='hidden md:block absolute top-1/2 -right-3 w-6 h-1 bg-pink-300 transform -translate-y-1/2'></div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-transparent py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-4xl font-bold text-pink-600 mb-2'>{stat.number}</div>
                <div className='text-slate-200'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-16 max-w-7xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-white mb-4'>Powerful Safety Features</h2>
          <p className='text-slate-200 max-w-2xl mx-auto'>
            Everything you need to stay safe and connected
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {features.map((feature, index) => (
            <div key={index} className='theme-card rounded-lg p-8 shadow-md hover:shadow-lg transition'>
              <div className='mb-4'>{feature.icon}</div>
              <h3 className='text-xl font-semibold text-gray-800 mb-3'>{feature.title}</h3>
              <p className='text-gray-600'>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className='bg-transparent py-16'>
        <div className='max-w-7xl mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>Simple, Transparent Pricing</h2>
            <p className='text-slate-200 max-w-2xl mx-auto'>
              Choose the plan that is right for you
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-lg p-8 transition transform hover:scale-105 ${
                  plan.featured
                    ? 'bg-gradient-to-b from-pink-600 to-red-600 text-white shadow-xl scale-105'
                    : 'theme-card shadow-md'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${plan.featured ? 'text-white' : 'text-gray-800'}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-1 ${plan.featured ? 'text-white' : 'text-gray-800'}`}>
                  {plan.price}
                </div>
                {plan.period && (
                  <p className={`mb-4 ${plan.featured ? 'text-pink-100' : 'text-gray-600'}`}>
                    {plan.period}
                  </p>
                )}
                <p className={`mb-6 text-sm ${plan.featured ? 'text-pink-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                <Link
                  to='/signup'
                  className={`w-full py-2 px-4 rounded-lg font-semibold mb-6 transition ${
                    plan.featured
                      ? 'bg-white text-pink-600 hover:bg-gray-100'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                >
                  Get Started
                </Link>
                <ul className={`space-y-3 ${plan.featured ? 'text-pink-100' : 'text-gray-600'}`}>
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className='flex items-center'>
                      <span className='w-5 h-5 rounded-full bg-green-400 flex items-center justify-center mr-3 flex-shrink-0'>
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className='py-16 max-w-7xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-white mb-4'>Frequently Asked Questions</h2>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {[
            { q: 'Is RAKSHA really free?', ans: 'Yes! Basic features are completely free. Premium features are optional.' },
            { q: 'How secure is my data?', ans: 'We use military-grade encryption to protect your data. Your privacy is our priority.' },
            { q: 'Can I use it offline?', ans: 'Emergency SMS alerts work offline. Full features require internet connection.' },
            { q: 'What if I need help?', ans: 'Our 24/7 support team is always ready to assist you via email, phone, or chat.' }
          ].map((faq, index) => (
            <div key={index} className='theme-card p-6 rounded-lg shadow-md'>
              <h4 className='font-semibold text-gray-800 mb-3'>{faq.q}</h4>
              <p className='text-gray-600'>{faq.ans}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h2 className='text-4xl font-bold mb-6'>Ready to Stay Safe?</h2>
          <p className='text-xl mb-8 max-w-2xl mx-auto'>
            Join thousands of women using RAKSHA to protect themselves and their loved ones
          </p>
          <Link
            to='/signup'
            className='inline-flex px-10 py-4 bg-white text-pink-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition'
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  )
}

export default GetStarted
