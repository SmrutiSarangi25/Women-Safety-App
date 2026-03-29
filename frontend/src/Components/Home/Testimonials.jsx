import { Star } from 'lucide-react'

function Testimonials() {
  const testimonials = [
    {
      name: 'Matthe',
      location: 'India',
      content: 'This app makes us feel so safe and comfortable.',
      avatar: '👩‍🦰',
      rating: 5
    },
    {
      name: 'Nishanth',
      location: 'UK',
      content: 'Very good help line for women safety, thank you so much.',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Priya',
      location: 'India',
      content: 'Happy. Coming out of a safe home with my son tomorrow. I did not know apps like this existed. Thank you!',
      avatar: '👩',
      rating: 5
    },
    {
      name: 'Sarah',
      location: 'South Africa',
      content: 'This is a great initiative for South African users especially. Thank you for that.',
      avatar: '👩‍🦱',
      rating: 5
    },
    {
      name: 'Anjali',
      location: 'India',
      content: 'I feel it is one of the best steps taken towards women safety. I am satisfied and impressed.',
      avatar: '👩‍💻',
      rating: 5
    },
    {
      name: 'Zara',
      location: 'Dubai',
      content: 'Thank you for your app. This is an amazing app.',
      avatar: '👩‍💼',
      rating: 5
    }
  ]

  return (
    <div className='w-full py-24 bg-gradient-to-b from-white to-gray-50'>
      <div className='max-w-7xl mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-20 slide-up'>
          <h2 className='text-5xl md:text-6xl font-black text-gray-900 mb-6'>
            Trusted by <span className='text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary'>Thousands</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Real stories from real people who have found safety and peace of mind with Raksha
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className='slide-up'
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className='bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 hover:border-brand-primary hover:shadow-xl transition-all duration-300 h-full flex flex-col'>
                {/* Stars */}
                <div className='flex gap-1 mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className='fill-yellow-400 text-yellow-400' />
                  ))}
                </div>

                {/* Quote */}
                <p className='text-gray-700 text-lg leading-relaxed mb-6 flex-grow italic'>
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className='flex items-center gap-3 border-t-2 border-gray-100 pt-4'>
                  <div className='text-4xl'>{testimonial.avatar}</div>
                  <div>
                    <p className='font-bold text-gray-900'>{testimonial.name}</p>
                    <p className='text-sm text-gray-600'>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className='bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl p-12 text-white text-center slide-up'>
          <h3 className='text-3xl md:text-4xl font-bold mb-4'>Join Our Safety Community</h3>
          <p className='text-lg mb-8 opacity-90 max-w-2xl mx-auto'>
            Download the app and create your first safety bubble today. Become part of a movement that is changing how people stay protected.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <button className='bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all'>
              Download iOS App
            </button>
            <button className='bg-white text-brand-primary px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-all'>
              Download Android App
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className='mt-16 grid md:grid-cols-4 gap-8 text-center slide-up'>
          <div>
            <p className='text-4xl font-black text-brand-primary'>50K+</p>
            <p className='text-gray-600 font-semibold mt-2'>Active Users</p>
          </div>
          <div>
            <p className='text-4xl font-black text-brand-primary'>100K+</p>
            <p className='text-gray-600 font-semibold mt-2'>Alerts Sent</p>
          </div>
          <div>
            <p className='text-4xl font-black text-brand-primary'>4.8★</p>
            <p className='text-gray-600 font-semibold mt-2'>App Rating</p>
          </div>
          <div>
            <p className='text-4xl font-black text-brand-primary'>24/7</p>
            <p className='text-gray-600 font-semibold mt-2'>Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testimonials