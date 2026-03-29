import { AlertCircle, MessageSquare, Phone } from 'lucide-react'
import { useState } from 'react'

const SOSButton = ({ onClick, isLoading = false, messageType = 'both' }) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleClick = () => {
    setIsPressed(true)
    if (onClick) onClick()
  }

  const getIcon = () => {
    if (messageType === 'sms') return <Phone className="w-8 h-8 animate-bounce" strokeWidth={2.5} />
    if (messageType === 'whatsapp') return <MessageSquare className="w-8 h-8 animate-bounce" strokeWidth={2.5} />
    return <AlertCircle className="w-8 h-8 animate-bounce" strokeWidth={2.5} />
  }

  return (
    <button
      className={`
        relative group
        w-36 h-36
        rounded-full
        bg-red-400
        text-white
        font-mono font-bold text-2xl
        transition-all duration-300
        hover:bg-red-500
        active:scale-95
        flex flex-col items-center justify-center gap-3
        shadow-[0_0_15px_rgba(239,68,68,0.5)]
        hover:shadow-[0_0_25px_rgba(239,68,68,0.7)]
        ${isPressed ? 'animate-pulse' : ''}
        ${isLoading ? 'animate-spin' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      onClick={handleClick}
      disabled={isLoading}
      onAnimationEnd={() => setIsPressed(false)}
    >
      <div className="absolute inset-0 rounded-full border-4 border-red-300 border-double opacity-70" />
      <div className="absolute inset-0 rounded-full animate-ping border-2 border-red-300 opacity-20" />

      {getIcon()}

      <span className="relative">
        {isLoading ? 'SENDING...' : 'SOS'}
        <span className="absolute -inset-1 rounded-lg bg-red-500/20 blur-sm animate-pulse" />
      </span>

      {/* Message type indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        <div className="text-xs bg-white text-red-600 px-2 py-1 rounded-full font-semibold shadow-sm">
          {messageType === 'sms' ? 'SMS' : messageType === 'whatsapp' ? 'WhatsApp' : 'BOTH'}
        </div>
      </div>
    </button>
  )
}

export default SOSButton