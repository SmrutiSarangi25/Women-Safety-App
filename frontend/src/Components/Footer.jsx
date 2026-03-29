import React from 'react'
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useBranding } from '../Context/BrandingContext'

function Footer() {
  const { brandData } = useBranding()
  
  return (
    <footer className='w-full bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100'>      
      <div className='max-w-7xl mx-auto px-4 py-16'>
        {/* Top Section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-12 mb-12'>
          {/* Brand Column */}
          <div>
            {brandData.logo.image ? (
              <div className='mb-4 inline-flex rounded-xl border border-white/10 bg-white/5 px-2 py-1 shadow-lg'>
                <img className='h-14 w-auto object-contain drop-shadow-md' src={brandData.logo.image} alt={brandData.name} />
              </div>
            ) : (
              <h3 className='text-2xl font-bold brand-primary mb-4'>{brandData.name}</h3>
            )}
            <p className='text-gray-400 text-sm leading-relaxed'>
              Empowering women with advanced safety technology. Your personal guardian that never sleeps.
            </p>
            {/* Social Links */}
            <div className='flex gap-4 mt-6'>
              <a href="#" className='text-gray-400 hover:text-brand-primary transition-colors'>
                <FaInstagram size={20} />
              </a>
              <a href="#" className='text-gray-400 hover:text-brand-primary transition-colors'>
                <FaFacebook size={20} />
              </a>
              <a href="#" className='text-gray-400 hover:text-brand-primary transition-colors'>
                <FaLinkedin size={20} />
              </a>
              <a href="#" className='text-gray-400 hover:text-brand-primary transition-colors'>
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className='text-white font-semibold mb-4 text-sm uppercase tracking-wide'>Product</h4>
            <ul className='space-y-2'>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Features</a></li>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Pricing</a></li>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Security</a></li>
              <li><a href="/faq" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>FAQ</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className='text-white font-semibold mb-4 text-sm uppercase tracking-wide'>Company</h4>
            <ul className='space-y-2'>
              <li><a href="/about" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>About</a></li>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Careers</a></li>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Contact</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className='text-white font-semibold mb-4 text-sm uppercase tracking-wide'>Legal</h4>
            <ul className='space-y-2'>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Privacy Policy</a></li>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Terms of Service</a></li>
              <li><a href="#" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>Disclaimer</a></li>
              <li><a href="mailto:support@raksha.app" className='text-gray-400 hover:text-brand-primary transition-colors text-sm'>support@raksha.app</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t border-gray-700 py-8'></div>

        {/* Bottom Section */}
        <div className='flex flex-col md:flex-row justify-between items-center text-sm text-gray-400'>
          <p className='mb-4 md:mb-0'>© 2026 {brandData.name}. All rights reserved.</p>
          <p>Protecting women. Empowering safety. Building trust.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer