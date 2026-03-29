import { Link } from 'react-router-dom'
import { Bell, MapPinned, ShieldCheck, PhoneCall } from 'lucide-react'

const actionCards = [
  {
    title: 'SOS in Seconds',
    description: 'Trigger emergency alerts to your trusted circle immediately.',
    to: '/HomePage',
    cta: 'Open Dashboard',
    icon: Bell,
    gradient: 'from-rose-500 to-red-500'
  },
  {
    title: 'Live Emergency Map',
    description: 'See your location context and navigate quickly to safe spots.',
    to: '/emergency-map',
    cta: 'Open Map',
    icon: MapPinned,
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    title: 'Emergency Contacts',
    description: 'Manage your trusted contacts before an emergency occurs.',
    to: '/emergency-contacts',
    cta: 'Manage Contacts',
    icon: PhoneCall,
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'Learn Self Defence',
    description: 'Practice practical safety moves and crisis response basics.',
    to: '/self-defence',
    cta: 'Start Learning',
    icon: ShieldCheck,
    gradient: 'from-pink-500 to-fuchsia-500'
  }
]

function QuickActions() {
  return (
    <div className='w-full py-20'>
      <div className='max-w-7xl mx-auto px-4'>
        <div className='mb-10 text-center'>
          <p className='inline-flex items-center rounded-full border border-brand-primary/20 bg-white/70 px-4 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-brand-primary'>
            Act Fast
          </p>
          <h2 className='mt-4 text-4xl md:text-5xl font-black text-gray-900'>
            One-Tap Actions For Real Emergencies
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-gray-600 text-lg'>
            Every second matters. Jump directly to the most important safety tools without searching.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {actionCards.map((action) => {
            const IconComponent = action.icon

            return (
              <Link
                key={action.title}
                to={action.to}
                className='group rounded-3xl border border-gray-200 bg-white/80 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-rose-100'
              >
                <div className='flex items-start gap-4'>
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white`}>
                    <IconComponent size={22} />
                  </div>
                  <div>
                    <h3 className='text-2xl font-extrabold text-gray-900'>{action.title}</h3>
                    <p className='mt-2 text-gray-600 leading-relaxed'>{action.description}</p>
                    <span className='mt-4 inline-flex items-center text-sm font-bold text-brand-primary transition-transform duration-200 group-hover:translate-x-1'>
                      {action.cta} →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuickActions
