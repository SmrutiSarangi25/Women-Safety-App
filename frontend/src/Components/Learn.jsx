import React from 'react'
import { Link } from 'react-router-dom'
import { useBranding } from '../Context/BrandingContext'

function Learn() {
  const { brandData } = useBranding()
  return (
    <div className='w-full min-h-screen theme-aurora-bg'>
      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-white mb-4'>Learn About Women\'s Safety</h1>
          <p className='text-xl text-slate-200 max-w-3xl mx-auto'>
            Knowledge is power. Equip yourself with essential safety information, emergency preparedness tips, and self-defense techniques.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'>
          <div className='theme-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='w-8 h-8 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Emergency Preparedness</h3>
            <p className='text-gray-600 mb-6'>Learn how to prepare for emergencies, create safety plans, and respond effectively in crisis situations.</p>
            <ul className='text-gray-600 space-y-2'>
              <li>• Create emergency contact lists</li>
              <li>• Develop safety plans for different scenarios</li>
              <li>• Learn basic first aid techniques</li>
              <li>• Understand when and how to call emergency services</li>
            </ul>
          </div>

          <div className='theme-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Digital Safety</h3>
            <p className='text-gray-600 mb-6'>Protect yourself online and understand cyber threats that can affect your personal safety.</p>
            <ul className='text-gray-600 space-y-2'>
              <li>• Recognize online harassment</li>
              <li>• Protect personal information</li>
              <li>• Use privacy settings effectively</li>
              <li>• Report cyber threats safely</li>
            </ul>
          </div>

          <div className='theme-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='w-8 h-8 text-purple-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Legal Rights</h3>
            <p className='text-gray-600 mb-6'>Know your legal rights and how to seek help through proper legal channels.</p>
            <ul className='text-gray-600 space-y-2'>
              <li>• Understanding domestic violence laws</li>
              <li>• Workplace harassment rights</li>
              <li>• Protection orders and restraining orders</li>
              <li>• Support services and helplines</li>
            </ul>
          </div>

          <div className='theme-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='w-8 h-8 text-orange-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Community Support</h3>
            <p className='text-gray-600 mb-6'>Connect with support networks and understand the importance of community in safety.</p>
            <ul className='text-gray-600 space-y-2'>
              <li>• Finding local support groups</li>
              <li>• Building a personal safety network</li>
              <li>• Mental health support resources</li>
              <li>• Community safety initiatives</li>
            </ul>
          </div>

          <div className='theme-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Situational Awareness</h3>
            <p className='text-gray-600 mb-6'>Develop the skills to recognize potential threats and avoid dangerous situations.</p>
            <ul className='text-gray-600 space-y-2'>
              <li>• Reading social cues and body language</li>
              <li>• Safe transportation practices</li>
              <li>• Public space safety tips</li>
              <li>• Trusting your instincts</li>
            </ul>
          </div>

          <div className='theme-card p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='w-8 h-8 text-pink-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' />
              </svg>
            </div>
            <h3 className='text-2xl font-semibold mb-4'>Self-Care & Recovery</h3>
            <p className='text-gray-600 mb-6'>Learn about emotional healing and building resilience after traumatic experiences.</p>
            <ul className='text-gray-600 space-y-2'>
              <li>• Coping with trauma</li>
              <li>• Building emotional strength</li>
              <li>• Seeking professional help</li>
              <li>• Self-care practices</li>
            </ul>
          </div>
        </div>

        <div className='theme-card-soft p-8 rounded-xl shadow-lg text-center'>
          <h3 className='text-2xl font-bold text-white mb-4'>Ready to Take the Next Step?</h3>
          <p className='text-slate-200 mb-6'>Knowledge alone isn't enough. Combine learning with practical safety tools.</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link to="/get-started" className='inline-flex items-center justify-center bg-gradient-to-r from-rose-500 to-orange-500 hover:opacity-95 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300'>
              {brandData.name} Get Started
            </Link>
            <Link to="/self-defence" className='inline-flex items-center justify-center border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300'>
              Explore Self Defense
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Learn