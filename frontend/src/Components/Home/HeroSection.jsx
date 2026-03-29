import { useEffect, useRef, useState } from 'react'
import { Shield, AlertCircle, MapPin, ArrowRight, Zap, Mic, Square, RotateCcw, Trash2, AudioLines } from 'lucide-react'
import { useBranding } from '../../Context/BrandingContext'
import { Link } from 'react-router-dom'
import api from '../../../API/CustomApi'
import { Config } from '../../../API/Config'
import { toast } from 'react-toastify'

const VOICE_STATUS_LABEL = {
    idle: 'Ready to capture a quick safety note',
    listening: 'Listening... speak your note clearly',
    processing: 'Processing your recording...',
    success: 'Voice note captured successfully',
    error: 'Voice capture needs attention'
}

function HeroSection() {
    const { brandData } = useBranding()
    const [voiceStatus, setVoiceStatus] = useState('idle')
    const [transcript, setTranscript] = useState('')
    const [typedFallback, setTypedFallback] = useState('')
    const [audioUrl, setAudioUrl] = useState('')
    const [audioBlob, setAudioBlob] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [isSubmittingSOS, setIsSubmittingSOS] = useState(false)
    const [supportInfo, setSupportInfo] = useState({ hasRecorder: false, hasSpeechRecognition: false, hasMediaDevices: false })
    const recorderRef = useRef(null)
    const recognitionRef = useRef(null)
    const streamRef = useRef(null)
    const audioChunksRef = useRef([])
    const voiceStatusRef = useRef('idle')
    const transcriptRef = useRef('')
    const audioUrlRef = useRef('')

    const isListening = voiceStatus === 'listening'

    useEffect(() => {
        if (typeof window === 'undefined') return

        setSupportInfo({
            hasRecorder: typeof window.MediaRecorder !== 'undefined',
            hasSpeechRecognition: typeof window.SpeechRecognition !== 'undefined' || typeof window.webkitSpeechRecognition !== 'undefined',
            hasMediaDevices: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
        })
    }, [])

    useEffect(() => {
        voiceStatusRef.current = voiceStatus
    }, [voiceStatus])

    useEffect(() => {
        transcriptRef.current = transcript
    }, [transcript])

    useEffect(() => {
        audioUrlRef.current = audioUrl
    }, [audioUrl])

    useEffect(() => {
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl)
            }

            if (recorderRef.current?.state === 'recording') {
                recorderRef.current.stop()
            }

            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }

            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }
        }
    }, [audioUrl])

    const clearVoiceData = () => {
        setTranscript('')
        setTypedFallback('')
        setErrorMessage('')
        setVoiceStatus('idle')
        setAudioBlob(null)
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl)
            setAudioUrl('')
        }
    }

    const getCurrentPositionSafe = async () => {
        if (!navigator?.geolocation) {
            return null
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                () => resolve(null),
                { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
            )
        })
    }

    const submitVoiceNoteToSOS = async () => {
        const hasContent = transcript.trim() || typedFallback.trim() || audioBlob

        if (!hasContent) {
            setErrorMessage('Capture or type a note before sending it to SOS.')
            setVoiceStatus('error')
            return
        }

        setErrorMessage('')
        setIsSubmittingSOS(true)
        setVoiceStatus('processing')

        try {
            const formData = new FormData()
            const bestMessage = transcript.trim() || typedFallback.trim() || 'Voice note submitted from homepage'
            const token = localStorage.getItem('token')

            formData.append('severity', 'high')
            formData.append('message', bestMessage)
            formData.append('transcript', transcript)
            formData.append('typedFallback', typedFallback)

            if (audioBlob) {
                formData.append('evidenceAudio', audioBlob, `voice-note-${Date.now()}.webm`)
            }

            const position = await getCurrentPositionSafe()
            if (position?.coords) {
                formData.append('latitude', `${position.coords.latitude}`)
                formData.append('longitude', `${position.coords.longitude}`)
                formData.append('accuracy', `${position.coords.accuracy}`)
            }

            await api.post(Config.SOS_SEND_URL, formData, {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            })

            toast.success('Voice evidence attached and SOS alert submitted.')
            setVoiceStatus('success')
        } catch (error) {
            setVoiceStatus('error')
            setErrorMessage(error.response?.data?.message || 'Unable to submit SOS evidence. Please login and try again.')
        } finally {
            setIsSubmittingSOS(false)
        }
    }

    const stopVoiceCapture = () => {
        if (!isListening) return

        setVoiceStatus('processing')

        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }

        if (recorderRef.current?.state === 'recording') {
            recorderRef.current.stop()
        } else {
            if (!audioUrlRef.current && !transcriptRef.current.trim()) {
                setErrorMessage('No voice input was captured. Try again or type your safety note.')
                setVoiceStatus('error')
            } else {
                setVoiceStatus('success')
            }
        }
    }

    const startVoiceCapture = async () => {
        clearVoiceData()

        const dynamicSupport = {
            hasRecorder: typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined',
            hasSpeechRecognition: typeof window !== 'undefined' && (typeof window.SpeechRecognition !== 'undefined' || typeof window.webkitSpeechRecognition !== 'undefined'),
            hasMediaDevices: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia
        }
        setSupportInfo(dynamicSupport)

        if (!dynamicSupport.hasMediaDevices && !dynamicSupport.hasSpeechRecognition) {
            setErrorMessage('Voice capture is not supported in this browser. Please use the typed note field.')
            setVoiceStatus('error')
            return
        }

        setVoiceStatus('listening')

        if (dynamicSupport.hasSpeechRecognition) {
            const BrowserSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            const recognition = new BrowserSpeechRecognition()
            recognitionRef.current = recognition
            recognition.continuous = true
            recognition.interimResults = true
            recognition.lang = 'en-IN'

            recognition.onresult = (event) => {
                let mergedTranscript = ''
                for (let i = 0; i < event.results.length; i += 1) {
                    mergedTranscript += event.results[i][0]?.transcript || ''
                }
                setTranscript(mergedTranscript.trim())
            }

            recognition.onerror = () => {
                setErrorMessage('Speech-to-text is unavailable for this attempt. Audio recording can still continue.')
            }

            recognition.onend = () => {
                if (voiceStatusRef.current === 'processing') {
                    if (audioUrlRef.current || transcriptRef.current.trim()) {
                        setVoiceStatus('success')
                    } else {
                        setErrorMessage('No clear speech was detected. Try again or type your safety note.')
                        setVoiceStatus('error')
                    }
                }
            }

            recognition.start()
        }

        if (dynamicSupport.hasMediaDevices && dynamicSupport.hasRecorder) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                streamRef.current = stream
                audioChunksRef.current = []
                const recorder = new MediaRecorder(stream)
                recorderRef.current = recorder

                recorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        audioChunksRef.current.push(event.data)
                    }
                }

                recorder.onstop = () => {
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((track) => track.stop())
                        streamRef.current = null
                    }

                    if (audioChunksRef.current.length > 0) {
                        const recordedBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                        const newUrl = URL.createObjectURL(recordedBlob)
                        setAudioBlob(recordedBlob)
                        setAudioUrl((prevUrl) => {
                            if (prevUrl) URL.revokeObjectURL(prevUrl)
                            return newUrl
                        })
                        setVoiceStatus('success')
                    } else if (!transcriptRef.current.trim()) {
                        setErrorMessage('No audio was captured. Check microphone access and try again.')
                        setVoiceStatus('error')
                    }
                }

                recorder.start()
            } catch {
                setErrorMessage('Microphone permission was denied or unavailable. Use typed note or retry after enabling mic.')
                setVoiceStatus('error')
                if (recognitionRef.current) {
                    recognitionRef.current.stop()
                }
            }
        }
    }

    return (
        <div className='w-full min-h-[92vh] relative overflow-hidden flex items-center'>
            {/* Animated Background Blobs */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute top-20 left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-32 right-20 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 right-1/3 w-80 h-80 bg-orange-300/15 rounded-full blur-3xl animate-pulse delay-500'></div>
            </div>

            {/* Main Content */}
            <div className='relative z-10 w-full max-w-7xl mx-auto px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 md:gap-12 items-center'>
                {/* Left Content */}
                <div className='slide-up'>
                    <div className='inline-block mb-6'>
                        <span className='theme-chip'>
                            Trusted by 50K+ Users
                        </span>
                    </div>
                    
                    <h1 className='text-5xl md:text-7xl font-black text-white mb-6 leading-tight'>
                        Your Private <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-rose-200 to-orange-200'>Safety Network</span>
                    </h1>
                    
                    <p className='text-xl text-slate-200 mb-8 leading-relaxed max-w-lg'>
                        {brandData.name} empowers women and families with instant SOS alerts, live location sharing, and a trusted support network you can count on.
                    </p>

                    {/* Feature Pills */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-200 flex items-center justify-center flex-shrink-0 border border-cyan-300/40'>
                                <Zap size={20} />
                            </div>
                            <span className='font-semibold text-slate-100'>Instant Alerts</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-200 flex items-center justify-center flex-shrink-0 border border-cyan-300/40'>
                                <MapPin size={20} />
                            </div>
                            <span className='font-semibold text-slate-100'>Live Location</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-200 flex items-center justify-center flex-shrink-0 border border-cyan-300/40'>
                                <Shield size={20} />
                            </div>
                            <span className='font-semibold text-slate-100'>Privacy First</span>
                        </div>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-200 flex items-center justify-center flex-shrink-0 border border-cyan-300/40'>
                                <AlertCircle size={20} />
                            </div>
                            <span className='font-semibold text-slate-100'>24/7 Support</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <Link to='/get-started' className='px-8 py-4 text-lg font-semibold rounded-lg shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 group bg-gradient-to-r from-rose-500 to-orange-500 text-white'>
                            Get Started Free
                            <ArrowRight size={20} className='group-hover:translate-x-1 transition-transform' />
                        </Link>
                        <Link to='/about' className='px-8 py-4 text-lg font-semibold rounded-lg border-2 border-white/30 bg-white/10 text-slate-100 hover:bg-white/20 transition-all text-center'>
                            Explore Mission
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className='mt-12 pt-8 border-t-2 border-white/20 flex items-center gap-8'>
                        <div>
                            <p className='text-3xl font-black text-cyan-200'>50K+</p>
                            <p className='text-slate-300 text-sm'>Active Users</p>
                        </div>
                        <div>
                            <p className='text-3xl font-black text-cyan-200'>100K+</p>
                            <p className='text-slate-300 text-sm'>Alerts Sent</p>
                        </div>
                        <div>
                            <p className='text-3xl font-black text-cyan-200'>99.9%</p>
                            <p className='text-slate-300 text-sm'>Uptime</p>
                        </div>
                    </div>
                </div>

                {/* Right Visual */}
                <div className='relative slide-up' style={{ animationDelay: '0.2s' }}>
                    <div className='relative h-96 md:h-full min-h-96'>
                        {/* Floating Feature Cards */}
                        <div className='absolute top-0 right-0 theme-card-soft p-6 z-20 md:w-72 animate-bounce'>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='w-10 h-10 rounded-lg bg-rose-500/20 border border-rose-300/30 flex items-center justify-center'>
                                    <AlertCircle size={20} className='text-rose-200' />
                                </div>
                                <p className='font-bold text-white'>Emergency Alert</p>
                            </div>
                            <p className='text-slate-200 text-sm'>Send location to trusted contacts instantly</p>
                        </div>

                        <div className='absolute bottom-20 left-0 theme-card-soft p-6 z-10 md:w-72' style={{ animation: 'bounce 2s infinite 0.75s' }}>
                            <div className='flex items-center gap-3 mb-2'>
                                <div className='w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-300/30 flex items-center justify-center'>
                                    <MapPin size={20} className='text-emerald-200' />
                                </div>
                                <p className='font-bold text-white'>Live Tracking</p>
                            </div>
                            <p className='text-slate-200 text-sm'>Real-time location sharing with your network</p>
                        </div>

                        <div className='absolute -bottom-8 right-3 left-3 md:left-auto md:w-[26rem] theme-card-soft p-5 z-30 border border-cyan-200/30 backdrop-blur-md'>
                            <div className='flex items-center justify-between gap-3 mb-3'>
                                <div className='flex items-center gap-2'>
                                    <AudioLines size={18} className='text-cyan-200' />
                                    <p className='font-bold text-white'>Voice Safety Note</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isListening ? 'bg-rose-400/30 text-rose-100' : 'bg-cyan-400/20 text-cyan-100'}`} aria-live='polite'>
                                    {VOICE_STATUS_LABEL[voiceStatus]}
                                </span>
                            </div>

                            <div className='flex flex-wrap gap-2 mb-3'>
                                <button
                                    type='button'
                                    onClick={startVoiceCapture}
                                    disabled={isListening || voiceStatus === 'processing' || isSubmittingSOS}
                                    aria-label='Start voice recording'
                                    className='inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors'
                                >
                                    <Mic size={16} />
                                    Start
                                </button>
                                <button
                                    type='button'
                                    onClick={stopVoiceCapture}
                                    disabled={!isListening || isSubmittingSOS}
                                    aria-label='Stop voice recording'
                                    className='inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors'
                                >
                                    <Square size={14} />
                                    Stop
                                </button>
                                <button
                                    type='button'
                                    onClick={startVoiceCapture}
                                    disabled={isListening || isSubmittingSOS}
                                    aria-label='Retry voice recording'
                                    className='inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors'
                                >
                                    <RotateCcw size={14} />
                                    Retry
                                </button>
                                <button
                                    type='button'
                                    onClick={clearVoiceData}
                                    disabled={isSubmittingSOS}
                                    aria-label='Clear captured voice note'
                                    className='inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-slate-100 text-sm font-semibold hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors disabled:opacity-60'
                                >
                                    <Trash2 size={14} />
                                    Clear
                                </button>
                                <button
                                    type='button'
                                    onClick={submitVoiceNoteToSOS}
                                    disabled={isListening || isSubmittingSOS}
                                    aria-label='Submit voice note with SOS alert'
                                    className='inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors'
                                >
                                    {isSubmittingSOS ? 'Submitting...' : 'Send to SOS'}
                                </button>
                            </div>

                            <p className='text-xs text-slate-200 mb-2' role={errorMessage ? 'alert' : 'status'} aria-live='polite' aria-atomic='true'>
                                {errorMessage || VOICE_STATUS_LABEL[voiceStatus]}
                            </p>

                            <label htmlFor='voice-transcript' className='text-xs uppercase tracking-wide text-slate-300'>
                                Transcript
                            </label>
                            <textarea
                                id='voice-transcript'
                                value={transcript}
                                onChange={(event) => setTranscript(event.target.value)}
                                placeholder='Transcript appears here while speaking...'
                                className='w-full mt-1 mb-2 h-20 rounded-lg bg-slate-900/50 border border-white/20 text-slate-100 px-3 py-2 text-sm outline-none focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-200'
                            />

                            <label htmlFor='typed-fallback' className='text-xs uppercase tracking-wide text-slate-300'>
                                Typed Note Fallback
                            </label>
                            <textarea
                                id='typed-fallback'
                                value={typedFallback}
                                onChange={(event) => setTypedFallback(event.target.value)}
                                placeholder='If microphone is unavailable, type a quick safety note here...'
                                className='w-full mt-1 h-20 rounded-lg bg-slate-900/50 border border-white/20 text-slate-100 px-3 py-2 text-sm outline-none focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-200'
                            />

                            {audioUrl && (
                                <div className='mt-3'>
                                    <p className='text-xs uppercase tracking-wide text-slate-300 mb-1'>Recorded Audio</p>
                                    <audio controls src={audioUrl} className='w-full h-10' />
                                </div>
                            )}

                            <div className='mt-3 text-[11px] text-slate-300 flex items-center gap-2'>
                                <span className='inline-flex items-center gap-1'>
                                    <span className={`w-2 h-2 rounded-full ${supportInfo.hasRecorder ? 'bg-emerald-400' : 'bg-amber-300'}`}></span>
                                    Audio capture
                                </span>
                                <span className='inline-flex items-center gap-1'>
                                    <span className={`w-2 h-2 rounded-full ${supportInfo.hasSpeechRecognition ? 'bg-emerald-400' : 'bg-amber-300'}`}></span>
                                    Speech-to-text
                                </span>
                            </div>
                        </div>

                        {/* Main Visual */}
                        <div className='absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-rose-400/20 rounded-3xl backdrop-blur-sm border-2 border-white/20 flex items-center justify-center'>
                            <div className='text-center'>
                                <Shield size={120} className='text-cyan-100 opacity-90 mx-auto mb-4' />
                                <p className='text-slate-100 font-semibold'>Your Safety Guardian</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className='absolute bottom-5 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block'>
                <div className='w-6 h-10 border-2 border-cyan-200 rounded-full flex items-start justify-center p-2'>
                    <div className='w-1 h-3 bg-cyan-200 rounded-full animate-ping'></div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection