import { Users, Share2, Lock } from 'lucide-react'

function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Users,
      title: 'Create a Bubble',
      description: 'Invite people you trust to your personal safety network',
      color: 'from-red-500 to-pink-500'
    },
    {
      number: '02',
      icon: Share2,
      title: 'Share Live Info',
      description: 'See each other\'s location, speed, battery, and phone status in real-time',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: '03',
      icon: Lock,
      title: 'Stay in Control',
      description: 'Check in, request check-ins, or go private anytime you want',
      color: 'from-blue-500 to-purple-500'
    }
  ]

  return (
    <div className='w-full py-24 bg-gradient-to-b from-white to-gray-50'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-20 slide-up'>
          <h2 className='text-5xl md:text-6xl font-black text-gray-900 mb-6'>
            How <span className='text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary'>It Works</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Three simple steps to build your personal safety network and stay connected with people you trust
          </p>
        </div>

        {/* Steps Grid */}
        <div className='grid md:grid-cols-3 gap-8 mb-16'>
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div 
                key={index} 
                className='group slide-up'
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className='relative h-full'>
                  {/* Card */}
                  <div className='bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-brand-primary hover:shadow-2xl transition-all duration-300 h-full flex flex-col'>
                    {/* Step Number Badge */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} text-white font-black text-xl mb-6 group-hover:scale-110 transition-transform`}>
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className='mb-6'>
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} text-white mb-4`}>
                        <IconComponent size={40} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className='text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-primary transition-colors'>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className='text-gray-700 text-lg leading-relaxed flex-grow'>
                      {step.description}
                    </p>

                    {/* Arrow */}
                    {index < 2 && (
                      <div className='hidden md:flex absolute -right-12 top-1/2 transform -translate-y-1/2 text-brand-primary text-4xl font-black opacity-30'>
                        →
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-12 text-white text-center slide-up'>
          <h3 className='text-3xl font-bold mb-4'>Ready to Get Started?</h3>
          <p className='text-lg mb-8 opacity-90 max-w-xl mx-auto'>
            Download Raksha today and create your first safety bubble in minutes
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors'>
              Download App
            </button>
            <button className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-brand-primary transition-colors'>
              Watch Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks