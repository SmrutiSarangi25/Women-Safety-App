import { AlertCircle, Phone, Mic, LifeBuoy, Tag, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'

function Features() {
  const features = [
    {
      icon: AlertCircle,
      title: 'Instant SOS',
      description: 'Send emergency alerts with your location to trusted contacts with one tap',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Phone,
      title: 'Fake Call',
      description: 'Trigger a realistic incoming call to escape uncomfortable situations',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Mic,
      title: 'Voice Record',
      description: 'Discreetly capture audio, photo, location, and timestamp for evidence',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: LifeBuoy,
      title: 'Ask for Help',
      description: 'Send help requests and get verified support from your network',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Tag,
      title: 'Tags & Trackers',
      description: 'Attach to kids, elders, pets, bags for continuous tracking',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'End-to-end encryption ensures your data stays completely private',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  return (
    <div className='w-full py-24 bg-gradient-to-b from-white to-rose-50/30'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-20 slide-up'>
          <h2 className='text-5xl md:text-6xl font-black text-gray-900 mb-6'>
            Not Just Another <span className='text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-orange-500'>Safety App</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Packed with powerful features designed for real-world safety and peace of mind
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div
                key={index}
                className='group slide-up'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-brand-primary hover:shadow-2xl transition-all duration-300 h-full flex flex-col'>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent size={32} />
                  </div>

                  {/* Title */}
                  <h3 className='text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors'>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className='text-gray-700 leading-relaxed flex-grow'>
                    {feature.description}
                  </p>

                  {/* Arrow Link */}
                  <div className='mt-6 flex items-center text-brand-primary font-semibold opacity-0 group-hover:opacity-100 transition-opacity'>
                    Learn more →
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-brand-primary to-orange-500 rounded-2xl p-12 text-white text-center slide-up'>
          <h3 className='text-3xl md:text-4xl font-bold mb-4'>
            Your Safety Network Starts Here
          </h3>
          <p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
            Experience all these powerful features with complete privacy and security
          </p>
          <Link
            to='/get-started'
            className='inline-flex items-center justify-center bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl'
          >
            See All Safety Features
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Features