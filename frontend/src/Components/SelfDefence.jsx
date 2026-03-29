import { useState } from 'react'
import { useBranding } from '../Context/BrandingContext'
import { AlertCircle, Phone, Eye, Heart, MapPin, Shield, BookOpen, Users, ChevronRight } from 'lucide-react'

function SelfDefence() {
  const { brandData } = useBranding()
  const [activeTab, setActiveTab] = useState('basics')
  const [expandedTechnique, setExpandedTechnique] = useState(null)

  const tabs = [
    { id: 'basics', label: 'Basic Techniques', icon: Shield, description: 'Essential physical techniques' },
    { id: 'awareness', label: 'Awareness Tips', icon: Eye, description: 'Prevention and awareness' },
    { id: 'resources', label: 'Resources', icon: BookOpen, description: 'Learning materials' }
  ]

  const techniques = [
    {
      id: 'palm-strike',
      title: 'Palm Strike',
      icon: '👋',
      targets: 'Nose, chin, throat',
      difficulty: 'Easy',
      effectiveness: 'High',
      description: 'Make a fist and strike with the heel of your palm. More powerful than a punch and safer for your hand.',
      steps: [
        'Form a fist with your hand',
        'Position palm heel forward',
        'Strike upward with force',
        'Follow through completely'
      ]
    },
    {
      id: 'knee-strike',
      title: 'Knee Strike',
      icon: '🦵',
      targets: 'Groin area',
      difficulty: 'Easy',
      effectiveness: 'Very High',
      description: 'Lift your knee forcefully upward. Works from very close range and can incapacitate temporarily.',
      steps: [
        'Position yourself close to attacker',
        'Drive knee upward with power',
        'Make contact with groin area',
        'Create distance immediately'
      ]
    },
    {
      id: 'elbow-strike',
      title: 'Elbow Strike',
      icon: '💪',
      targets: 'Face, ribs, arms',
      difficulty: 'Easy',
      effectiveness: 'High',
      description: 'Swing your elbow horizontally or vertically. Elbows are strong and effective from close range.',
      steps: [
        'Bend your arm at elbow',
        'Rotate from your core',
        'Swing elbow toward target',
        'Use body weight for power'
      ]
    },
    {
      id: 'eye-gouge',
      title: 'Eye Gouge',
      icon: '👁️',
      targets: 'Eyes',
      difficulty: 'Easy',
      effectiveness: 'Very High',
      description: 'Use your fingers to poke or scratch at the attacker eyes. Creates intense pain and temporary blindness.',
      steps: [
        'Locate attacker eyes quickly',
        'Use thumbs or fingers',
        'Apply firm pressure',
        'Pull fingers away decisively'
      ]
    },
    {
      id: 'groin-kick',
      title: 'Groin Kick',
      icon: '🦶',
      targets: 'Groin area',
      difficulty: 'Medium',
      effectiveness: 'Very High',
      description: 'Kick upward with the top of your foot or shin. Effective from standing position and creates distance.',
      steps: [
        'Face threat directly',
        'Lift knee to waist height',
        'Extend leg forcefully',
        'Follow through with the kick'
      ]
    },
    {
      id: 'escape-hold',
      title: 'Escape Hold',
      icon: '🏃‍♀️',
      targets: 'When grabbed',
      difficulty: 'Medium',
      effectiveness: 'High',
      description: 'Drop your weight and twist away from grabber. Use momentum to break free and run.',
      steps: [
        'Drop your body weight down',
        'Twist your hips away',
        'Push away with your hands',
        'Run to safety immediately'
      ]
    }
  ]

  const awarenessItems = [
    {
      icon: '🚶',
      title: 'Walking Safely',
      tips: [
        'Walk confidently with purpose and awareness',
        'Stay on well-lit, populated routes',
        'Avoid isolated areas whenever possible',
        'Keep your phone charged and accessible',
        'Trust your instincts - leave if something feels wrong',
        'Vary your routine to avoid predictable patterns'
      ]
    },
    {
      icon: '🚗',
      title: 'Transportation Safety',
      tips: [
        'Share your location with trusted contacts',
        'Use registered ride services only',
        'Sit in the back seat if traveling alone',
        'Keep emergency contacts updated',
        'Have a backup plan for getting home',
        'Never get in a vehicle with strangers'
      ]
    },
    {
      icon: '🏠',
      title: 'Home Safety',
      tips: [
        'Secure all doors and windows with locks',
        'Do not open door to strangers',
        'Install good security lighting outside',
        'Keep emergency numbers handy nearby',
        'Tell someone when you expect to arrive home',
        'Never provide personal details to visitors'
      ]
    },
    {
      icon: '📱',
      title: 'Digital Awareness',
      tips: [
        'Be cautious sharing location online',
        'Never share travel plans publicly',
        'Use maximum privacy on social media',
        'Report suspicious online behavior',
        'Never meet strangers from online alone',
        'Keep personal information completely private'
      ]
    }
  ]

  return (
    <div className='w-full'>
      {/* Hero Section */}
      <section className='relative min-h-screen bg-gradient-to-br from-red-50 via-white to-purple-50 flex items-center py-20 overflow-hidden'>
        {/* Background Animations */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-10 w-96 h-96 bg-red-200 opacity-15 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-200 opacity-15 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        {/* Content */}
        <div className='relative z-10 w-full max-w-6xl mx-auto px-4'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            {/* Left Content */}
            <div className='slide-up'>
              <div className='inline-block mb-6'>
                <span className='bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full font-bold text-sm'>
                  EMPOWERMENT & SAFETY
                </span>
              </div>
              <h1 className='text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight'>
                Master <span className='text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary'>Self-Defense</span>
              </h1>
              <p className='text-xl text-gray-700 mb-6 leading-relaxed'>
                Learn practical, science-backed self-defense techniques designed for real-world situations. Gain confidence, strength, and awareness to protect yourself and loved ones.
              </p>
              <div className='flex gap-4'>
                <button className='btn-primary px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform'>
                  Start Learning
                </button>
                <button className='btn-outline px-8 py-4 rounded-lg font-bold text-lg border-2 border-brand-primary text-brand-primary'>
                  Watch Videos
                </button>
              </div>
            </div>

            {/* Right Visual */}
            <div className='slide-up' style={{ animationDelay: '0.2s' }}>
              <div className='relative h-96'>
                <div className='absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 rounded-3xl backdrop-blur-sm border-2 border-white/50 flex items-center justify-center'>
                  <Shield size={150} className='text-brand-primary opacity-60' />
                </div>
                {/* Floating Cards */}
                <div className='absolute -top-10 right-10 bg-white p-6 rounded-2xl shadow-2xl border-2 border-gray-100 max-w-xs animate-bounce'>
                  <p className='font-bold text-gray-900'>Confidence</p>
                  <p className='text-gray-600 text-sm'>Built through knowledge and practice</p>
                </div>
                <div className='absolute bottom-10 left-0 bg-white p-6 rounded-2xl shadow-2xl border-2 border-gray-100 max-w-xs' style={{ animation: 'bounce 2s infinite 0.75s' }}>
                  <p className='font-bold text-gray-900'>Awareness</p>
                  <p className='text-gray-600 text-sm'>Prevention is the best defense</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className='sticky top-20 z-40 bg-white shadow-md border-b-2 border-gray-100 py-4'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-3 gap-4'>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg'
                      : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-brand-primary'
                  }`}
                >
                  <div className='flex items-center gap-3'>
                    <Icon className={activeTab === tab.id ? 'text-white' : 'text-brand-primary'} size={24} />
                    <div className='text-left hidden sm:block'>
                      <p className='font-bold text-sm'>{tab.label}</p>
                      <p className={`text-xs ${activeTab === tab.id ? 'text-white/80' : 'text-gray-600'}`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className='py-20 bg-gradient-to-b from-white to-gray-50'>
        <div className='max-w-6xl mx-auto px-4'>
          {/* Basic Techniques */}
          {activeTab === 'basics' && (
            <div className='slide-up'>
              <div className='text-center mb-16'>
                <h2 className='text-5xl font-black text-gray-900 mb-4'>Basic Self-Defense Techniques</h2>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                  Fundamental techniques focusing on using your body's natural weapons to create distance and escape danger.
                </p>
              </div>

              {/* Techniques Grid */}
              <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
                {techniques.map((technique, index) => (
                  <div
                    key={technique.id}
                    className='group slide-up'
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className='bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-brand-primary hover:shadow-2xl transition-all duration-300 cursor-pointer'
                      onClick={() => setExpandedTechnique(expandedTechnique === technique.id ? null : technique.id)}
                    >
                      {/* Header */}
                      <div className='bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 p-6 border-b-2 border-gray-100'>
                        <div className='text-5xl mb-3'>{technique.icon}</div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-2'>{technique.title}</h3>
                        <div className='flex gap-3 flex-wrap'>
                          <span className='text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full'>
                            Target: {technique.targets}
                          </span>
                          <span className='text-xs font-bold px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full'>
                            {technique.difficulty}
                          </span>
                          <span className='text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full'>
                            {technique.effectiveness}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className='p-6'>
                        <p className='text-gray-700 mb-4'>{technique.description}</p>
                        <div className='flex items-center text-brand-primary font-bold group-hover:gap-2 transition-all'>
                          Learn <ChevronRight size={20} />
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedTechnique === technique.id && (
                        <div className='border-t-2 border-gray-100 p-6 bg-gray-50'>
                          <h4 className='font-bold text-gray-900 mb-4 flex items-center gap-2'>
                            <span className='text-xl'>📋</span> Step-by-Step Guide
                          </h4>
                          <ol className='space-y-3'>
                            {technique.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className='flex gap-3'>
                                <span className='w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0'>
                                  {stepIndex + 1}
                                </span>
                                <span className='text-gray-700'>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Important Note */}
              <div className='bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-8'>
                <div className='flex gap-4'>
                  <AlertCircle className='text-orange-600 flex-shrink-0' size={32} />
                  <div>
                    <h4 className='font-black text-orange-900 mb-2 text-lg'>Important Safety Note</h4>
                    <p className='text-orange-800'>
                      These techniques are for emergency situations only. Always prioritize running away and calling emergency services (Police: 100 in India). Practice with certified instructors. {brandData.name} is a complement to, not a replacement for, professional self-defense training.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Awareness Tips */}
          {activeTab === 'awareness' && (
            <div className='slide-up'>
              <div className='text-center mb-16'>
                <h2 className='text-5xl font-black text-gray-900 mb-4'>Situational Awareness</h2>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                  Prevention is the best self-defense. Learn to recognize threats and avoid dangerous situations before they escalate.
                </p>
              </div>

              {/* Awareness Grid */}
              <div className='grid md:grid-cols-2 gap-8'>
                {awarenessItems.map((item, index) => (
                  <div
                    key={index}
                    className='slide-up'
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className='bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-brand-primary hover:shadow-2xl transition-all duration-300 h-full'>
                      {/* Header */}
                      <div className='bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 p-6 border-b-2 border-gray-100'>
                        <div className='text-5xl mb-3'>{item.icon}</div>
                        <h3 className='text-2xl font-bold text-gray-900'>{item.title}</h3>
                      </div>

                      {/* Tips */}
                      <div className='p-6'>
                        <ul className='space-y-3'>
                          {item.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className='flex gap-3'>
                              <span className='text-brand-primary font-bold mt-1'>✓</span>
                              <span className='text-gray-700'>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {activeTab === 'resources' && (
            <div className='slide-up'>
              <div className='text-center mb-16'>
                <h2 className='text-5xl font-black text-gray-900 mb-4'>Learning Resources</h2>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                  Professional training and reliable resources to help you build confidence and skills.
                </p>
              </div>

              {/* Resources Grid */}
              <div className='grid md:grid-cols-2 gap-8 mb-16'>
                {/* Local Classes */}
                <div className='slide-up'>
                  <div className='bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-primary hover:shadow-2xl transition-all p-8 h-full'>
                    <div className='text-5xl mb-4'>🏋️</div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-4'>Local Classes</h3>
                    <p className='text-gray-600 mb-6'>Find certified instructors in your area:</p>
                    <ul className='space-y-3'>
                      {[
                        'Krav Maga training centers',
                        'Women martial arts studios',
                        'Community center programs',
                        'University self-defense courses',
                        'Police department training'
                      ].map((item, idx) => (
                        <li key={idx} className='flex gap-2'>
                          <span className='text-brand-primary font-bold'>•</span>
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Online Resources */}
                <div className='slide-up' style={{ animationDelay: '0.1s' }}>
                  <div className='bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-primary hover:shadow-2xl transition-all p-8 h-full'>
                    <div className='text-5xl mb-4'>🎥</div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-4'>Online Learning</h3>
                    <p className='text-gray-600 mb-6'>Free and paid courses:</p>
                    <ul className='space-y-3'>
                      {[
                        'YouTube self-defense channels',
                        'Udemy specialization courses',
                        'Skillshare workshops',
                        'Coursera certified programs',
                        'Women safety platforms'
                      ].map((item, idx) => (
                        <li key={idx} className='flex gap-2'>
                          <span className='text-brand-primary font-bold'>•</span>
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Books & Resources */}
                <div className='slide-up' style={{ animationDelay: '0.2s' }}>
                  <div className='bg-white rounded-2xl border-2 border-gray-200 hover:border-brand-primary hover:shadow-2xl transition-all p-8 h-full'>
                    <div className='text-5xl mb-4'>📚</div>
                    <h3 className='text-2xl font-bold text-gray-900 mb-4'>Recommended Reading</h3>
                    <p className='text-gray-600 mb-6'>Essential books on safety:</p>
                    <ul className='space-y-3'>
                      {[
                        '"The Gift of Fear" - Gavin de Becker',
                        '"Defend Yourself" - Alison Mackie',
                        '"Safety Guide for Women" - Expert compiled',
                        '"Mind Over Muscle" - Self-defense psychology',
                        'Community safety guides'
                      ].map((item, idx) => (
                        <li key={idx} className='flex gap-2'>
                          <span className='text-brand-primary font-bold'>•</span>
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div className='slide-up' style={{ animationDelay: '0.3s' }}>
                  <div className='bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border-2 border-red-200 hover:shadow-2xl transition-all p-8 h-full'>
                    <div className='text-5xl mb-4'>☎️</div>
                    <h3 className='text-2xl font-bold text-red-900 mb-4'>Emergency Numbers</h3>
                    <p className='text-red-800 mb-6'>Keep these numbers handy:</p>
                    <ul className='space-y-3'>
                      {[
                        '📞 Emergency: 112 (India)',
                        '🚔 Police: 100 (India)',
                        '👩‍⚕️ Medical: 102 (India)',
                        '🚐 Ambulance: 108 (India)',
                        '📲 Women Helpline: 181 (India)'
                      ].map((item, idx) => (
                        <li key={idx} className='font-bold text-red-900'>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* {brandData.name} Integration */}
              <div className='bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-8 text-white'>
                <div className='grid md:grid-cols-2 gap-8 items-center'>
                  <div>
                    <h3 className='text-3xl font-bold mb-4'>Combine with {brandData.name}</h3>
                    <p className='text-lg mb-6 opacity-90'>
                      Self-defense training works best with {brandData.name}. Build your safety bubble, share your location, and have emergency features always ready.
                    </p>
                    <button className='bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-all'>
                      Set Up Your Safety Bubble
                    </button>
                  </div>
                  <div className='flex items-center justify-center'>
                    <Shield size={150} className='opacity-20' />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className='bg-gradient-to-r from-brand-primary to-brand-secondary py-16 text-white'>
        <div className='max-w-6xl mx-auto px-4 text-center'>
          <h2 className='text-4xl font-black mb-4'>Ready to Take Control of Your Safety?</h2>
          <p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
            Knowledge is power, but action is protection. Start learning today and download {brandData.name} to activate emergency features.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-white text-brand-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all'>
              Start Free Course
            </button>
            <button className='border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-brand-primary transition-all'>
              Download {brandData.name}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SelfDefence