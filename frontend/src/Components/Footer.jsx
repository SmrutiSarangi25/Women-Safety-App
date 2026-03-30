import React from 'react'
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useBranding } from '../Context/BrandingContext'
import { Shield, Heart, Zap } from 'lucide-react';

function Footer() {
  const { brandData } = useBranding()
  
  return (
    <footer className='w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-gray-100 border-t-2 border-purple-600'>      
      {/* Top CTA Section */}
      <div className='bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white py-12'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h3 className='text-3xl md:text-4xl font-black mb-4'>Stay Safe. Stay Connected.</h3>
          <p className='text-lg text-white/90 mb-6 max-w-2xl mx-auto'>Join millions of users who trust {brandData.name} for their safety</p>
          <Link to="/get-started" className='inline-block px-8 py-3 bg-white text-pink-600 font-bold rounded-lg hover:bg-purple-50 transform hover:scale-105 transition-all shadow-lg'>
            Download Now
          </Link>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-16'>
        {/* Main Content Section */}
        <div className='grid grid-cols-1 md:grid-cols-5 gap-8 mb-12'>
          {/* Brand Column */}
          <div className='md:col-span-1'>
            {brandData.logo.image ? (
              <div className='mb-4 inline-flex rounded-xl border border-purple-500/30 bg-purple-500/10 px-3 py-2 shadow-lg'>
                <img className='h-12 w-auto object-contain drop-shadow-md' src={brandData.logo.image} alt={brandData.name} />
              </div>
            ) : (
              <h3 className='text-2xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4'>{brandData.name}</h3>
            )}
            <p className='text-gray-400 text-sm leading-relaxed mb-6 max-w-xs'>
              Empowering women with advanced safety technology. Your personal guardian that never sleeps.
            </p>
            {/* Social Links */}
            <div className='flex gap-4'>
              <a href="#" className='w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-gray-300 hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110'>
                <FaInstagram size={16} />
              </a>
              <a href="#" className='w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-gray-300 hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110'>
                <FaFacebook size={16} />
              </a>
              <a href="#" className='w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-gray-300 hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110'>
                <FaLinkedin size={16} />
              </a>
              <a href="#" className='w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center text-gray-300 hover:bg-purple-600 hover:text-white transition-all transform hover:scale-110'>
                <FaTwitter size={16} />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className='text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2'>
              <Shield size={16} className='text-purple-400' />
              Product
            </h4>
            <ul className='space-y-3'>
              <li><a href="/get-started" className='text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium'>Features</a></li>
              <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium'>Pricing</a></li>
              <li><a href="#" className='text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium'>Security</a></li>
              <li><a href="/faq" className='text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium'>FAQ</a></li>
              <li><a href="/shop" className='text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium'>Shop</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className='text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2'>
              <Heart size={16} className='text-pink-400' />
              Company
            </h4>
            <ul className='space-y-3'>
              <li><Link to="/about" className='text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium'>About Us</Link></li>
              <li><a href="#" className='text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium'>Careers</a></li>
              <li><Link to="/contact-us" className='text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium'>Contact</Link></li>
              <li><Link to="/learn" className='text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium'>Learn</Link></li>
              <li><Link to="/self-defence" className='text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium'>Self Defense</Link></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className='text-white font-bold mb-6 text-sm uppercase tracking-widest flex items-center gap-2'>
              <Zap size={16} className='text-rose-400' />
              Resources
            </h4>
            <ul className='space-y-3'>
              <li><a href="#" className='text-gray-400 hover:text-rose-400 transition-colors text-sm font-medium'>Blog</a></li>
              <li><a href="#" className='text-gray-400 hover:text-rose-400 transition-colors text-sm font-medium'>Help Center</a></li>
              <li><a href="#" className='text-gray-400 hover:text-rose-400 transition-colors text-sm font-medium'>Community</a></li>
              <li><a href="#" className='text-gray-400 hover:text-rose-400 transition-colors text-sm font-medium'>Updates</a></li>
              <li><a href="#" className='text-gray-400 hover:text-rose-400 transition-colors text-sm font-medium'>Webinars</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className='text-white font-bold mb-6 text-sm uppercase tracking-widest'>Contact</h4>
            <ul className='space-y-4'>
              <li className='flex items-start gap-3'>
                <FaPhone className='text-purple-400 mt-1 flex-shrink-0' size={14} />
                <a href="tel:+919876543210" className='text-gray-400 hover:text-purple-400 transition-colors text-sm font-medium'>+91 98765 43210</a>
              </li>
              <li className='flex items-start gap-3'>
                <FaEnvelope className='text-pink-400 mt-1 flex-shrink-0' size={14} />
                <a href="mailto:support@raksha.app" className='text-gray-400 hover:text-pink-400 transition-colors text-sm font-medium break-all'>support@raksha.app</a>
              </li>
              <li className='flex items-start gap-3'>
                <FaMapMarkerAlt className='text-rose-400 mt-1 flex-shrink-0' size={14} />
                <span className='text-gray-400 text-sm'>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 py-12 border-y border-gray-700'>
          <div className='flex items-start gap-4 p-4 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition-colors'>
            <Shield size={24} className='text-purple-400 flex-shrink-0' />
            <div>
              <h5 className='font-bold text-white mb-1'>Advanced Security</h5>
              <p className='text-sm text-gray-400'>End-to-end encryption for your safety data</p>
            </div>
          </div>
          <div className='flex items-start gap-4 p-4 rounded-lg bg-pink-600/10 hover:bg-pink-600/20 transition-colors'>
            <Heart size={24} className='text-pink-400 flex-shrink-0' />
            <div>
              <h5 className='font-bold text-white mb-1'>24/7 Support</h5>
              <p className='text-sm text-gray-400'>Always available when you need us</p>
            </div>
          </div>
          <div className='flex items-start gap-4 p-4 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 transition-colors'>
            <Zap size={24} className='text-rose-400 flex-shrink-0' />
            <div>
              <h5 className='font-bold text-white mb-1'>Instant Alerts</h5>
              <p className='text-sm text-gray-400'>Real-time notifications for safety</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4'>
          <p>© 2026 {brandData.name}. All rights reserved.</p>
          <div className='flex gap-4 flex-wrap justify-center md:justify-end'>
            <a href="#" className='hover:text-purple-400 transition-colors'>Privacy Policy</a>
            <span className='text-gray-600'>•</span>
            <a href="#" className='hover:text-pink-400 transition-colors'>Terms of Service</a>
            <span className='text-gray-600'>•</span>
            <a href="#" className='hover:text-rose-400 transition-colors'>Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer