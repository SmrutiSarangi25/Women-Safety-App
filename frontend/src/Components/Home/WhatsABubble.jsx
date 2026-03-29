function WhatsABubble() {
  return (
    <div className='w-full py-16 bg-white relative'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-2 gap-12 items-center relative'>
          {/* Left side - Text content */}
          <div>
            <h2 className='text-4xl font-bold text-gray-800 mb-6'>
              What&apos;s a <span className='text-pink-500'>Bubble?</span>
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
              A Bubble is a private group where members share live location, speed, battery,
              and phone status with each other.
            </p>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Mutual and invite-only</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Check-In — tap to say &ldquo;I&apos;m safe&rdquo;</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Private Mode — hide location anytime</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Request Check-In — ask others to confirm they&apos;re okay</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Admins manage settings and controls</span>
              </div>
            </div>
            <div className='mt-8'>
              <a
                href="#"
                className='bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg inline-block'
              >
                Create your first bubble
              </a>
            </div>
          </div>

          {/* Right side - Phone Mockup with layered background */}
          <div className='relative h-full flex items-center justify-center'>
            {/* Bubble background layer */}
            <div className='absolute w-96 h-96 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 opacity-60 blur-3xl'></div>
            
            {/* Decorative circles */}
            <div className='absolute top-10 right-20 w-40 h-40 rounded-full bg-pink-200 opacity-40 blur-2xl'></div>
            <div className='absolute bottom-20 left-10 w-32 h-32 rounded-full bg-purple-200 opacity-30 blur-2xl'></div>
            
            {/* Phone mockup - using external image URL */}
            <img
              src="https://static.wixstatic.com/media/a3633f_225e4420c6bb4d839fcdee8fd85eb435~mv2.png/v1/fill/w_510,h_515,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pink%20Poppy%20Flowers.png"
              alt="RAKSHA App - Bubble Feature"
              className='relative z-10 w-80 h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsABubble