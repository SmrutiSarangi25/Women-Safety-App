import React from 'react'

function WeDont() {
  return (
    <div className='w-full py-16 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-gray-800 mb-8'>
            We don't.
          </h2>
          <div className='text-2xl font-semibold text-gray-700 mb-8'>
            No ads No data sale No Surveillance
          </div>
          <div className='max-w-4xl mx-auto'>
            <img
              src="https://static.wixstatic.com/media/a3633f_306d48df870f4074891bc26544d85e36~mv2.png/v1/fill/w_239,h_53,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pink%20Poppy%20Flowers.png"
              alt="Privacy illustration"
              className='w-48 h-12 object-contain mx-auto mb-8'
            />
            <p className='text-lg text-gray-600 mb-8'>
              Most safety and tracking apps monitor you, and sell your data.
            </p>
            <div className='text-center'>
              <span className='text-pink-500 font-semibold text-lg'>We don't.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeDont