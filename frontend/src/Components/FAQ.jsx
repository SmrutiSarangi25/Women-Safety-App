import { useState } from 'react'
import { faqData } from '../data/faqData'
import { ChevronDown, Search, Lightbulb, HelpCircle } from 'lucide-react'
import { useBranding } from '../Context/BrandingContext'

function FAQ() {
  const { brandData } = useBranding()
  const [expandedCategory, setExpandedCategory] = useState(0)
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  // Filter FAQs based on search
  const filteredFaqData = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(qa => 
      qa.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qa.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className='w-full theme-aurora-bg text-slate-100'>
      {/* Hero Section */}
      <section className='relative min-h-96 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white overflow-hidden py-20 flex items-center'>
        {/* Background Animations */}
        <div className='absolute inset-0 overflow-hidden'>
          <div className='absolute top-10 right-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-10 left-10 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        {/* Content */}
        <div className='relative z-10 w-full max-w-6xl mx-auto px-4 text-center'>
          <div className='inline-block mb-6'>
            <HelpCircle size={60} className='text-white' />
          </div>
          <h1 className='text-6xl md:text-7xl font-black mb-6 leading-tight'>
            Frequently Asked <span className='text-yellow-300'>Questions</span>
          </h1>
          <p className='text-xl text-white/90 mb-8 max-w-2xl mx-auto'>
            Get answers to common questions about {brandData.name} and how to make the most of your safety network. Our comprehensive guide covers setup, features, and best practices.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className='bg-transparent py-12 border-b border-white/15'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='relative max-w-2xl mx-auto'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-300' size={24} />
            <input
              type='text'
              placeholder='Search for answers...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setExpandedCategory(0)
                setExpandedQuestion(null)
              }}
              className='w-full pl-14 pr-4 py-4 text-lg border border-white/25 bg-white/10 text-white placeholder:text-slate-300 rounded-xl focus:outline-none focus:border-cyan-300 transition-colors'
            />
          </div>
        </div>
      </section>

      <div className='max-w-6xl mx-auto px-4 py-20'>
        {/* Category Tabs */}
        <div className='flex flex-wrap gap-3 justify-center mb-16'>
          {faqData.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setExpandedCategory(index)
                setExpandedQuestion(null)
                setSearchTerm('')
              }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base transform hover:scale-105 ${
                expandedCategory === index
                  ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-lg scale-105'
                  : 'bg-white/10 text-slate-100 border border-white/25 hover:border-cyan-300 hover:text-cyan-200'
              }`}
            >
              <span className='mr-2'>{category.icon}</span>
              {category.category}
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div>
          {filteredFaqData.length === 0 ? (
            <div className='text-center py-16'>
              <Lightbulb size={80} className='text-gray-300 mx-auto mb-4' />
              <p className='text-2xl text-slate-200 font-semibold mb-2'>No results found</p>
              <p className='text-slate-300'>Try searching for something else</p>
            </div>
          ) : (
            filteredFaqData.map((category, catIndex) => (
              <div key={catIndex} className='slide-up'>
                {/* Category Title & Description */}
                <div className='mb-12'>
                  <div className='flex items-center gap-4 mb-6'>
                    <span className='text-5xl'>{category.icon}</span>
                    <div>
                      <h2 className='text-4xl font-black text-white'>
                        {category.category}
                      </h2>
                      <div className='h-1 w-32 bg-gradient-to-r from-brand-primary to-brand-secondary mt-2'></div>
                    </div>
                  </div>
                  <p className='text-slate-300 text-lg ml-20'>
                    Find answers about {category.category.toLowerCase()} and related topics
                  </p>
                </div>

                {/* Questions Accordion */}
                <div className='space-y-4'>
                  {category.questions.map((qa, qIndex) => (
                    <div
                      key={qa.id}
                      className='group theme-card rounded-2xl border overflow-hidden transition-all duration-300 hover:border-brand-primary hover:shadow-2xl transform hover:scale-105'
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleQuestion(qa.id)}
                        className='w-full p-6 md:p-8 flex items-start justify-between gap-4 hover:bg-gradient-to-r hover:from-brand-primary/5 hover:to-brand-secondary/5 transition-all text-left'
                      >
                        <div className='flex gap-4 flex-1'>
                          <div className='flex-shrink-0'>
                            <span className='inline-block w-8 h-8 rounded-full bg-brand-primary text-white text-center text-sm font-bold pt-1'>
                              {String(qIndex + 1).padStart(2, '0')}
                            </span>
                          </div>
                          <h3 className='text-lg md:text-xl font-bold text-gray-900 group-hover:text-brand-primary transition-colors flex-1'>
                            {qa.question}
                          </h3>
                        </div>
                        <ChevronDown
                          size={28}
                          className={`flex-shrink-0 text-brand-primary transition-transform duration-300 ${
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
                        <div className='px-6 md:px-8 pb-8 border-t-2 border-gray-100 bg-gradient-to-br from-gray-50 to-white'>
                          <div className='flex gap-4 pt-6'>
                            <div className='w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary text-white flex items-center justify-center text-lg font-bold flex-shrink-0'>
                              ✓
                            </div>
                            <p className='text-gray-700 leading-relaxed text-base md:text-lg'>
                              {qa.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className='mt-20 p-8 md:p-12 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-3xl text-white text-center slide-up shadow-2xl'>
          <h3 className='text-3xl md:text-4xl font-black mb-4'>Still Have Questions?</h3>
          <p className='text-lg mb-8 opacity-95 max-w-2xl mx-auto'>
            Our support team is available 24/7 to help you get the most out of {brandData.name}. Reach out anytime!
          </p>
          <div className='flex flex-col md:flex-row gap-4 justify-center'>
            <a
              href="mailto:support@raksha.app"
              className='px-8 py-4 bg-white text-brand-primary font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg'
            >
              📧 Email Support
            </a>
            <a
              href="tel:+919937012168"
              className='px-8 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-brand-primary transition-all transform hover:scale-105'
            >
              ☎️ Call Us: +91 9937012168
            </a>
          </div>
        </div>

        {/* Quick Tips */}
        <div className='mt-16 grid md:grid-cols-3 gap-8'>
          <div className='theme-card-soft p-8 rounded-2xl border border-blue-300/30'>
            <p className='text-4xl mb-4'>💡</p>
            <h4 className='text-lg font-bold text-white mb-3'>Pro Tip</h4>
            <p className='text-slate-200'>Create your first safety bubble right now to start protecting yourself and loved ones instantly.</p>
          </div>
          <div className='theme-card-soft p-8 rounded-2xl border border-green-300/30'>
            <p className='text-4xl mb-4'>🚀</p>
            <h4 className='text-lg font-bold text-white mb-3'>Quick Start</h4>
            <p className='text-slate-200'>Set up takes just 2 minutes. Invite trusted contacts and you are ready to go.</p>
          </div>
          <div className='theme-card-soft p-8 rounded-2xl border border-purple-300/30'>
            <p className='text-4xl mb-4'>🎯</p>
            <h4 className='text-lg font-bold text-white mb-3'>Next Steps</h4>
            <p className='text-slate-200'>Download the app, explore all features, and share with family and friends.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
