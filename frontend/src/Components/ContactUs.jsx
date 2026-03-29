import React, { useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useBranding } from '../Context/BrandingContext'
import api from '../../API/CustomApi'
import { Config } from '../../API/Config'

const SUBJECT_OPTIONS = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'emergency', label: 'Emergency Priority' }
]

function ContactUs() {
  const { brandData } = useBranding()
  const fileInputRef = useRef(null)
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [submissionMeta, setSubmissionMeta] = useState(null)
  const [liveStatus, setLiveStatus] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      terms: false
    }
  })

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const internationalPhoneRegex = /^\+?[1-9]\d{7,14}$/
  const messageValue = watch('message', '')
  const subjectValue = watch('subject', '')

  const messageCounterTone = useMemo(() => {
    const count = messageValue.length
    if (count > 950) return 'text-red-600'
    if (count > 800) return 'text-amber-600'
    return 'text-slate-500'
  }, [messageValue])

  const onSubmit = async (data) => {
    try {
      setLiveStatus('Submitting your request...')

      const formDataToSend = new FormData()
      formDataToSend.append('name', data.name)
      formDataToSend.append('email', data.email)
      formDataToSend.append('phone', data.phone)
      formDataToSend.append('subject', data.subject)
      formDataToSend.append('message', data.message)

      if (attachmentFile) {
        formDataToSend.append('attachment', attachmentFile)
      }

      const response = await api.post(Config.CONTACT_US_SUBMIT_URL, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.status === 201 || response.status === 200) {
        const submissionId = response?.data?.submissionId
        const priority = response?.data?.priority || 'normal'

        setSubmissionMeta({
          id: submissionId,
          priority,
          message: response?.data?.message || 'Your message has been received successfully.'
        })

        setLiveStatus('Request submitted successfully.')
        toast.success('Your message is in. Our team will respond soon.', {
          position: 'top-right',
          autoClose: 5000
        })

        reset()
        setAttachmentFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setLiveStatus('Submission failed. Please try again.')
      setSubmissionMeta(null)
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.', {
        position: 'top-right',
        autoClose: 5000
      })
    }
  }

  return (
    <div className='relative w-full min-h-screen overflow-hidden bg-slate-950'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -left-20 top-16 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl'></div>
        <div className='absolute right-0 top-10 h-72 w-72 rounded-full bg-rose-500/25 blur-3xl'></div>
        <div className='absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl'></div>
      </div>

      <div className='relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8'>
        <div className='mb-12 text-center'>
          <p className='inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100'>
            Human Support, Fast Response
          </p>
          <h1 className='mt-4 text-4xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-6xl'>
            Contact The {brandData.name} Team
          </h1>
          <p className='mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-200 sm:text-lg'>
            Questions and urgent safety concerns are all welcome here. Share details and our team will reply with the right next step.
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-12'>
          <div className='space-y-6 lg:col-span-5'>
            <section className='rounded-2xl border border-white/20 bg-white/10 p-7 shadow-2xl backdrop-blur'>
              <h2 className='text-2xl font-extrabold uppercase tracking-wide text-white'>Get In Touch</h2>
              <p className='mt-2 text-sm text-slate-200'>
                Every query is reviewed by a real support operator.
              </p>

              <div className='mt-7 space-y-5'>
                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/20'>
                    <svg className='h-6 w-6 text-rose-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-bold text-white'>Email</h3>
                    <p className='text-slate-200'>support@raksha.app</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20'>
                    <svg className='h-6 w-6 text-cyan-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-bold text-white'>Phone</h3>
                    <p className='text-slate-200'>+919937012168</p>
                    <p className='text-slate-200'>+917978626668</p>
                    <p className='text-sm text-slate-300'>Mon-Fri 9AM-6PM IST</p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20'>
                    <svg className='h-6 w-6 text-emerald-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                    </svg>
                  </div>
                  <div>
                    <h3 className='font-bold text-white'>Office</h3>
                    <p className='text-slate-200'>BHUBANESWAR, ODISHA, INDIA</p>
                  </div>
                </div>
              </div>
            </section>

            <section className='rounded-2xl border border-red-300/30 bg-red-600/20 p-6'>
              <h3 className='text-lg font-extrabold uppercase tracking-wide text-red-100'>Emergency Support</h3>
              <p className='mt-2 text-sm text-red-50'>
                If you are in immediate danger, call emergency services before sending this form.
              </p>
              <p className='mt-3 font-bold text-red-100'>India: 112 or 100</p>
            </section>

            {submissionMeta && (
              <section className='rounded-2xl border border-emerald-300/40 bg-emerald-500/20 p-6 text-emerald-50'>
                <h3 className='text-lg font-extrabold uppercase tracking-wide'>Submission Received</h3>
                <p className='mt-2 text-sm'>{submissionMeta.message}</p>
                {submissionMeta.id && <p className='mt-2 text-xs'>Reference: {submissionMeta.id}</p>}
                <p className='mt-1 text-xs'>Priority: {submissionMeta.priority === 'high' ? 'High' : 'Normal'}</p>
              </section>
            )}
          </div>

          <div className='rounded-2xl border border-white/15 bg-white p-7 shadow-2xl lg:col-span-7'>
            <div className='mb-6 flex items-center justify-between gap-4'>
              <h2 className='text-2xl font-extrabold uppercase tracking-wide text-slate-900'>Send A Message</h2>
              <p className='text-xs font-semibold uppercase tracking-[0.15em] text-slate-500'>Response within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-5' noValidate>
              <div className='grid gap-5 md:grid-cols-2'>
                <div>
                  <label htmlFor='name' className='mb-2 block text-sm font-semibold text-slate-700'>
                    Full Name *
                  </label>
                  <input
                    type='text'
                    id='name'
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : 'name-help'}
                    {...register('name', {
                      required: 'Full name is required',
                      minLength: { value: 3, message: 'Name must be at least 3 characters' },
                      maxLength: { value: 60, message: 'Name cannot exceed 60 characters' }
                    })}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder='Your full name'
                  />
                  {!errors.name && <p id='name-help' className='mt-1 text-xs text-slate-500'>Use your legal or preferred name.</p>}
                  {errors.name && <p id='name-error' className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor='email' className='mb-2 block text-sm font-semibold text-slate-700'>
                    Email Address *
                  </label>
                  <input
                    type='email'
                    id='email'
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : 'email-help'}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: emailRegex, message: 'Please enter a valid email address' }
                    })}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder='your.email@example.com'
                  />
                  {!errors.email && <p id='email-help' className='mt-1 text-xs text-slate-500'>We only use this to respond to your query.</p>}
                  {errors.email && <p id='email-error' className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
                </div>
              </div>

              <div className='grid gap-5 md:grid-cols-2'>
                <div>
                  <label htmlFor='phone' className='mb-2 block text-sm font-semibold text-slate-700'>
                    Phone Number *
                  </label>
                  <input
                    type='tel'
                    id='phone'
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'phone-error' : 'phone-help'}
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: internationalPhoneRegex,
                        message: 'Use international format like +14155552671'
                      }
                    })}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder='+91XXXXXXXXXX'
                  />
                  {!errors.phone && <p id='phone-help' className='mt-1 text-xs text-slate-500'>Include country code for faster follow-up.</p>}
                  {errors.phone && <p id='phone-error' className='mt-1 text-sm text-red-600'>{errors.phone.message}</p>}
                </div>

                <div>
                  <label htmlFor='subject' className='mb-2 block text-sm font-semibold text-slate-700'>
                    Subject *
                  </label>
                  <select
                    id='subject'
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    aria-describedby={errors.subject ? 'subject-error' : 'subject-help'}
                    {...register('subject', { required: 'Please select a subject' })}
                    className={`w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 ${errors.subject ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <option value=''>Select a subject</option>
                    {SUBJECT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {!errors.subject && <p id='subject-help' className='mt-1 text-xs text-slate-500'>Emergency priority messages are escalated.</p>}
                  {errors.subject && <p id='subject-error' className='mt-1 text-sm text-red-600'>{errors.subject.message}</p>}
                </div>
              </div>

              {subjectValue === 'emergency' && (
                <div className='rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
                  Emergency submissions are tagged high priority for immediate review.
                </div>
              )}

              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label htmlFor='message' className='block text-sm font-semibold text-slate-700'>
                    Message *
                  </label>
                  <span className={`text-xs font-semibold ${messageCounterTone}`} aria-live='polite'>
                    {messageValue.length}/1000
                  </span>
                </div>
                <textarea
                  id='message'
                  aria-invalid={errors.message ? 'true' : 'false'}
                  aria-describedby={errors.message ? 'message-error' : 'message-help'}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' },
                    maxLength: { value: 1000, message: 'Message cannot exceed 1000 characters' }
                  })}
                  rows={6}
                  className={`w-full rounded-xl border px-4 py-3 text-slate-900 shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-4 focus:ring-cyan-200 ${errors.message ? 'border-red-500' : 'border-slate-300'}`}
                  placeholder='Tell us how we can help you...'
                />
                {!errors.message && <p id='message-help' className='mt-1 text-xs text-slate-500'>Include important context so we can resolve faster.</p>}
                {errors.message && <p id='message-error' className='mt-1 text-sm text-red-600'>{errors.message.message}</p>}
              </div>

              <div>
                <label htmlFor='attachment' className='mb-2 block text-sm font-semibold text-slate-700'>
                  Attachment (Optional)
                </label>
                <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    id='attachment'
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && file.size > 5 * 1024 * 1024) {
                        toast.error('File must be less than 5MB')
                        e.target.value = ''
                        setAttachmentFile(null)
                      } else {
                        setAttachmentFile(file || null)
                      }
                    }}
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    className='w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-cyan-700'
                  />
                  <p className='mt-2 text-xs text-slate-500'>Accepted: PDF, DOC, DOCX, JPG, PNG. Max 5MB.</p>
                  {attachmentFile && (
                    <p className='mt-2 text-xs font-semibold text-slate-700'>Selected: {attachmentFile.name}</p>
                  )}
                </div>
              </div>

              <div className='rounded-xl border border-slate-200 bg-slate-50 px-4 py-3'>
                <div className='flex items-start gap-2'>
                  <input
                    type='checkbox'
                    id='terms'
                    aria-invalid={errors.terms ? 'true' : 'false'}
                    aria-describedby={errors.terms ? 'terms-error' : undefined}
                    {...register('terms', { required: 'You must agree to the terms' })}
                    className='mt-1 h-4 w-4 rounded border-slate-300'
                  />
                  <label htmlFor='terms' className='text-sm text-slate-700'>
                    I agree to the terms and privacy policy. I confirm this information is accurate.
                  </label>
                </div>
                {errors.terms && <p id='terms-error' className='mt-1 text-sm text-red-600'>{errors.terms.message}</p>}
              </div>

              <p className='sr-only' role='status' aria-live='polite'>{liveStatus}</p>

              <button
                type='submit'
                disabled={isSubmitting}
                className={`w-full rounded-xl px-6 py-3 text-base font-extrabold uppercase tracking-wide text-white shadow-lg transition ${
                  isSubmitting
                    ? 'cursor-not-allowed bg-slate-400'
                    : 'bg-cyan-600 hover:-translate-y-0.5 hover:bg-cyan-700'
                }`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        <div className='mt-14 grid gap-5 md:grid-cols-2'>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
            <h3 className='text-lg font-bold text-white'>Is this app free to use?</h3>
            <p className='mt-2 text-sm text-slate-200'>Yes. Core safety features are free to all users.</p>
          </div>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
            <h3 className='text-lg font-bold text-white'>How quickly do you respond?</h3>
            <p className='mt-2 text-sm text-slate-200'>General queries receive a response within one business day.</p>
          </div>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
            <h3 className='text-lg font-bold text-white'>Is my data secure?</h3>
            <p className='mt-2 text-sm text-slate-200'>Yes. Submissions are protected and used only for support operations.</p>
          </div>
          <div className='rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur'>
            <h3 className='text-lg font-bold text-white'>Can I attach evidence files?</h3>
            <p className='mt-2 text-sm text-slate-200'>Yes, you can attach one file up to 5MB in supported formats.</p>
          </div>
        </div>

        <div className='mt-8 rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-5 text-center'>
          <p className='text-sm font-semibold text-cyan-100'>
            Tip: For urgent safety issues, select Emergency Priority and include callback details.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
