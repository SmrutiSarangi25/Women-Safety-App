import { useState, useEffect } from 'react'
import { faqData } from '../data/faqData'
import { ChevronDown, Search, Lightbulb, HelpCircle, Menu, X } from 'lucide-react'
import { useBranding } from '../Context/BrandingContext'

function FAQ() {
  const { brandData } = useBranding()
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  // Scroll to section smoothly
  const scrollToSection = (categoryName) => {
    const element = document.getElementById(`section-${categoryName.toLowerCase().replace(/\s+/g, '-')}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(categoryName.toLowerCase().replace(/\s+/g, '-'))
      setMobileMenuOpen(false)
    }
  }

  // Filter FAQs based on search
  const filteredFaqData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(qa => 
      qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const getTableOfContents = () => {
    return faqData.map(cat => ({
      name: cat.category,
      id: cat.category.toLowerCase().replace(/\s+/g, '-'),
      icon: cat.icon
    }))
  }

  return (
    <div className='w-full bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 text-slate-900'>
      {/* Hero Section */}
      <section className='relative min-h-96 bg-gradient-to-br from-purple-700 via-pink-600 to-rose-500 text-white overflow-hidden py-20 flex items-center shadow-2xl'>
        {/* Background Animations */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-10 right-10 w-96 h-96 bg-white opacity-15 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-yellow-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        {/* Content */}
        <div className='relative z-10 w-full max-w-6xl mx-auto px-4 text-center'>
          <div className='inline-block mb-6'>
            <HelpCircle size={60} className='text-white' />
          </div>
          <h1 className='text-6xl md:text-7xl font-black mb-6 leading-tight text-white'>
            Frequently Asked <span className='text-yellow-200'>Questions</span>
          </h1>
          <p className='text-xl text-white/95 mb-8 max-w-2xl mx-auto'>
            Get answers to common questions about {brandData.name} and how to make the most of your safety network.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className='bg-white py-12 border-b-2 border-purple-200 sticky top-0 z-40 shadow-md'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='relative max-w-2xl mx-auto'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-600' size={24} />
            <input
              type='text'
              placeholder='Search for answers...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-14 pr-4 py-4 text-lg border-2 border-purple-300 bg-purple-50 text-slate-900 placeholder:text-slate-500 rounded-xl focus:outline-none focus:border-pink-500 focus:bg-white transition-all shadow-sm'
            />
          </div>
        </div>
      </section>

      <div className='max-w-7xl mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          
          {/* Table of Contents - Sidebar */}
          <div className='lg:col-span-1'>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='lg:hidden w-full mb-4 flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 border-0 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl transition-all'
            >
              <span className='flex items-center gap-2'>
                <Menu size={20} /> Categories
              </span>
              {mobileMenuOpen ? <X size={20} /> : <ChevronDown size={20} />}
            </button>

            {/* Table of Contents */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block sticky top-32 space-y-2`}>
              <div className='bg-white rounded-2xl p-6 border-2 border-purple-300 shadow-lg'>
                <h3 className='text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-4 uppercase tracking-widest'>Quick Navigation</h3>
                <nav className='space-y-2'>
                  {getTableOfContents().map((item, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(item.name)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-semibold text-sm group ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                          : 'text-slate-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 border-2 border-purple-200 hover:border-purple-500'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <span className='text-xl'>{item.icon}</span>
                        <span className='group-hover:translate-x-1 transition-transform'>{item.name}</span>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Stats Card */}
              <div className='bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 text-center text-white shadow-lg'>
                <p className='text-3xl font-black mb-1'>{faqData.reduce((sum, cat) => sum + cat.questions.length, 0)}</p>
                <p className='text-xs text-purple-100'>Questions Answered</p>
              </div>
            </div>
          </div>

          {/* FAQ Content - Main */}
          <div className='lg:col-span-3'>
            {searchTerm && filteredFaqData.length === 0 ? (
              <div className='text-center py-16'>
                <Lightbulb size={80} className='text-slate-400 mx-auto mb-4' />
                <p className='text-2xl text-slate-700 font-semibold mb-2'>No results found</p>
                <p className='text-slate-600'>Try searching for something else</p>
              </div>
            ) : filteredFaqData.length === 0 ? (
              <div className='text-center py-16'>
                <Lightbulb size={80} className='text-slate-400 mx-auto mb-4' />
                <p className='text-2xl text-slate-700 font-semibold mb-2'>No categories to display</p>
              </div>
            ) : (
              filteredFaqData.map((category, catIndex) => {
                const sectionId = `section-${category.category.toLowerCase().replace(/\s+/g, '-')}`
                return (
                  <div key={catIndex} id={sectionId} className='scroll-mt-32'>
                    {/* Category Header with Visual Separator */}
                    <div className='mb-12 pb-8 border-b-4 border-gradient-to-r from-purple-400 via-pink-400 to-rose-300'>
                      <div className='flex items-center gap-4 mb-4'>
                        <div className='text-6xl'>{category.icon}</div>
                        <div className='flex-1'>
                          <p className='text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 uppercase tracking-widest mb-1'>
                            Category {catIndex + 1}
                          </p>
                          <h2 className='text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-pink-700 to-rose-600'>
                            {category.category}
                          </h2>
                        </div>
                        <div className='hidden md:flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg'>
                          {category.questions.length}
                        </div>
                      </div>
                      <p className='text-slate-700 text-lg font-medium'>
                        {category.category === 'General' && 'Everything you need to know about Raksha'}
                        {category.category === 'Setup & Account' && 'Get started and manage your account'}
                        {category.category === 'Features & Usage' && 'Learn how to use all app features'}
                        {category.category === 'Privacy & Security' && 'Your safety and privacy matter most'}
                        {category.category === 'Support' && 'Get help when you need it'}
                      </p>
                    </div>

                    {/* Questions Grid/List */}
                    <div className='space-y-4 mb-16'>
                      {category.questions.map((qa, qIndex) => (
                        <div
                          key={qa.id}
                          className='group bg-white rounded-2xl border-2 border-purple-200 overflow-hidden transition-all duration-300 hover:border-pink-500 hover:shadow-xl hover:shadow-pink-200'
                        >
                          {/* Question Button */}
                          <button
                            onClick={() => toggleQuestion(qa.id)}
                            className='w-full p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all text-left active:scale-95'
                          >
                            <div className='flex gap-4 flex-1 min-w-0'>
                              <div className='flex-shrink-0'>
                                <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold text-sm shadow-md'>
                                  {String(qIndex + 1).padStart(2, '0')}
                                </span>
                              </div>
                              <h3 className='text-lg md:text-xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-pink-600 transition-all flex-1'>
                                {qa.question}
                              </h3>
                            </div>
                            <ChevronDown
                              size={28}
                              className={`flex-shrink-0 text-pink-600 transition-transform duration-300 font-bold ${
                                expandedQuestion === qa.id ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          {/* Answer */}
                          <div
                            className={`overflow-hidden transition-all duration-300 ${
                              expandedQuestion === qa.id ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <div className='px-6 md:px-8 pb-8 border-t-4 border-gradient-to-r from-purple-300 to-pink-300 bg-gradient-to-br from-purple-50 to-pink-50'>
                              <div className='flex gap-4 pt-6'>
                                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-md'>
                                  ✓
                                </div>
                                <p className='text-slate-800 leading-relaxed text-base md:text-lg font-medium'>
                                  {qa.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}

            {/* CTA Section */}
            <div className='mt-20 p-8 md:p-12 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 rounded-3xl text-white text-center shadow-2xl'>
              <h3 className='text-3xl md:text-4xl font-black mb-4'>Still Have Questions?</h3>
              <p className='text-lg mb-8 opacity-95 max-w-2xl mx-auto'>
                Our support team is available 24/7 to help you get the most out of {brandData.name}. Reach out anytime!
              </p>
              <div className='flex flex-col md:flex-row gap-4 justify-center'>
                <a
                  href="mailto:support@raksha.app"
                  className='px-8 py-4 bg-white text-pink-600 font-bold rounded-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl'
                >
                  📧 Email Support
                </a>
                <a
                  href="tel:+919937012168"
                  className='px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-pink-600 transition-all transform hover:scale-105'
                >
                  ☎️ Call Us: +91 9937012168
                </a>
              </div>
            </div>

            {/* Quick Tips */}
            <div className='mt-16 grid md:grid-cols-3 gap-8'>
              <div className='bg-white p-8 rounded-2xl border-2 border-purple-300 hover:border-purple-500 transition-all shadow-lg hover:shadow-xl'>
                <p className='text-4xl mb-4'>💡</p>
                <h4 className='text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-3'>Pro Tip</h4>
                <p className='text-slate-700 font-medium'>Create your first safety bubble right now to start protecting yourself and loved ones instantly.</p>
              </div>
              <div className='bg-white p-8 rounded-2xl border-2 border-teal-400 hover:border-teal-500 transition-all shadow-lg hover:shadow-xl'>
                <p className='text-4xl mb-4'>🚀</p>
                <h4 className='text-lg font-bold text-teal-700 mb-3'>Quick Start</h4>
                <p className='text-slate-700 font-medium'>Set up takes just 2 minutes. Invite trusted contacts and you are ready to go.</p>
              </div>
              <div className='bg-white p-8 rounded-2xl border-2 border-rose-300 hover:border-rose-500 transition-all shadow-lg hover:shadow-xl'>
                <p className='text-4xl mb-4'>🎯</p>
                <h4 className='text-lg font-bold text-rose-700 mb-3'>Next Steps</h4>
                <p className='text-slate-700 font-medium'>Download the app, explore all features, and share with family and friends.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
