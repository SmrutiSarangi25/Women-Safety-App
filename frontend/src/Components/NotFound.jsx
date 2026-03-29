import { Link } from 'react-router-dom'
import { Compass, Home, ShieldAlert } from 'lucide-react'

function NotFound() {
  return (
    <div className='mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-4 text-center'>
      <div className='mb-6 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 p-6 text-brand-primary'>
        <ShieldAlert size={52} />
      </div>

      <p className='text-sm font-bold uppercase tracking-[0.2em] text-brand-primary'>404</p>
      <h1 className='mt-2 text-4xl font-black text-gray-900 md:text-5xl'>Page Not Found</h1>
      <p className='mt-4 max-w-xl text-lg text-gray-600'>
        The page you are trying to reach does not exist or may have been moved.
      </p>

      <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
        <Link
          to='/'
          className='inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-6 py-3 font-bold text-white transition hover:shadow-lg'
        >
          <Home size={18} />
          Go Home
        </Link>
        <Link
          to='/get-started'
          className='inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand-primary px-6 py-3 font-bold text-brand-primary transition hover:bg-brand-primary hover:text-white'
        >
          <Compass size={18} />
          Start Safety Setup
        </Link>
      </div>
    </div>
  )
}

export default NotFound
