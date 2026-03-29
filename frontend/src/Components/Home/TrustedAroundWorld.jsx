function TrustedAroundWorld() {
  return (
    <div className='w-full py-16 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl font-bold text-gray-800 mb-4'>Trusted Around the World</h2>
          <p className='text-xl text-gray-600'>Built with care. Secured with trust.</p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Microsoft Blockchain */}
          <div className='text-center'>
            <div className='mb-6'>
              <img
                src="https://static.wixstatic.com/media/a3633f_2ca677581ee84bf593bfe15ba3223cc6~mv2.png/v1/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096138.png"
                alt="Microsoft Blockchain"
                className='w-16 h-16 object-contain mx-auto mb-4'
              />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Secured by Microsoft&apos;s blockchain-backed technology</h3>
          </div>

          {/* Global Users */}
          <div className='text-center'>
            <div className='mb-6'>
              <img
                src="https://static.wixstatic.com/media/a3633f_b09db09b95ef426a8fe97f771ccb63db~mv2.png/v1/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096139.png"
                alt="Global Users"
                className='w-16 h-16 object-contain mx-auto mb-4'
              />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Used by families, students, and communities in 150+ countries</h3>
          </div>

          {/* App Store Rating */}
          <div className='text-center'>
            <div className='mb-6'>
              <img
                src="https://static.wixstatic.com/media/a3633f_c9ddb9ac059e4b0093dae520c470dca7~mv2.png/v1/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096140.png"
                alt="App Store Rating"
                className='w-16 h-16 object-contain mx-auto mb-4'
              />
            </div>
            <h3 className='text-lg font-semibold mb-2'>Rated 4.8★ on the App Store and Google Play</h3>
          </div>

          {/* No Surveillance */}
          <div className='text-center'>
            <div className='mb-6'>
              <img
                src="https://static.wixstatic.com/media/a3633f_1b54585460044d6c964793cd505573e0~mv2.png/v1/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096141.png"
                alt="No Surveillance"
                className='w-16 h-16 object-contain mx-auto mb-4'
              />
            </div>
            <h3 className='text-lg font-semibold mb-2'>No surveillance, no ads, no data selling. Ever!</h3>
          </div>

          {/* Full Control */}
          <div className='text-center md:col-span-2 lg:col-span-4'>
            <div className='mb-6'>
              <img
                src="https://static.wixstatic.com/media/a3633f_1f40dd3ca7074bea956ce10cddd46a47~mv2.png/v1/fill/w_70,h_70,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096142.png"
                alt="Full Control"
                className='w-16 h-16 object-contain mx-auto mb-4'
              />
            </div>
            <h3 className='text-lg font-semibold mb-4'>Full control: delete your account and data anytime</h3>
            <div className='flex justify-center mb-6'>
              <img
                src="https://static.wixstatic.com/media/a3633f_92e24c12d65e40bcaff071ae007a5f41~mv2.png/v1/fill/w_68,h_58,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096091.png"
                alt="Security badge"
                className='w-16 h-14 object-contain'
              />
            </div>
            <p className='text-gray-700 font-medium'>Secured by Microsoft&apos;s blockchain. Tamper-proof, private, and built on trust.</p>
            <div className='mt-6'>
              <a
                href="#"
                className='bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg'
              >
                Coming Soon
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrustedAroundWorld