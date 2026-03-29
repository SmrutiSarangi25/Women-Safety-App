import { Link } from 'react-router-dom'

function FindEssentials() {
  return (
    <div className='w-full py-20 bg-white'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='grid md:grid-cols-2 gap-12 items-center'>
          <div>
            <h2 className='text-4xl md:text-5xl font-black text-gray-800 mb-6'>
              Find your essentials. Alert your people in one tap.
            </h2>
            <p className='text-lg text-gray-600 mb-6'>
              Ring your keys/wallet nearby. Tap SOS to alert trusted contacts
            </p>
            <div className='space-y-4 mb-8'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Find Nearby — ring the tag within Bluetooth range</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>Last Known Spot — where it last connected to your phone</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>1-Tap SOS Alert — SMS + in-app alerts from your phone</span>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-pink-500 rounded-full'></div>
                <span className='text-gray-700'>*Works when tag is connected to phone and in bluetooth range.</span>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                to='/shop'
                className='bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300 shadow-lg'
              >
                Buy Now
              </Link>
              <Link
                to='/shop'
                className='border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-300'
              >
                Bluetooth Tags
              </Link>
            </div>
          </div>
          <div className='flex justify-center'>
            <img
              src="https://static.wixstatic.com/media/a3633f_5e2c139240734dd5983d60592fb56d1b~mv2.png/v1/crop/x_14,y_0,w_1625,h_1321/fill/w_48,h_39,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048096216.png"
              alt="Bluetooth tag illustration"
              className='w-24 h-20 object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FindEssentials