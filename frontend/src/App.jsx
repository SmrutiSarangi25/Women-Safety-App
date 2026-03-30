import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import ProtectedRoute from "./Components/ProtectedRoute"
import AdminProtectedRoute from "./Components/AdminProtectedRoute"
import { lazy, Suspense } from "react"
import { ToastContainer } from 'react-toastify';
import ScrollToTop from "./Components/ScrollToTop"
import AIChatbot from "./Components/AIChatbot"

const Home = lazy(() => import('./Components/Home/Home'));
const Login = lazy(() => import('./Components/Login'));
const Signup = lazy(() => import('./Components/Signup'));
const AfterLogin = lazy(() => import('./Components/Home/AfterLogin'));
const Map = lazy(() => import('./Components/Map'));
const RealTimeMap = lazy(() => import('./Components/RealTimeMap'));
const Reviews = lazy(() => import('./Components/Reviews'));
const Profile = lazy(() => import('./Components/Profile'));
const Settings = lazy(() => import('./Components/Settings'));
const Learn = lazy(() => import('./Components/Learn'));
const ContactUs = lazy(() => import('./Components/ContactUs'));
const SelfDefence = lazy(() => import('./Components/SelfDefence'));
const FAQ = lazy(() => import('./Components/FAQ'));
const About = lazy(() => import('./Components/About'));
const GetStarted = lazy(() => import('./Components/GetStarted'));
const AdminDashboard = lazy(() => import('./Components/AdminDashboard'));
const UserDashboard = lazy(() => import('./Components/UserDashboard'));
const EmergencyContacts = lazy(() => import('./Components/EmergencyContacts'));
const Shop = lazy(() => import('./Components/Shop'));
const NotFound = lazy(() => import('./Components/NotFound'));

const RouteLoader = () => (
  <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 text-gray-700">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-primary/20 border-t-brand-primary"></div>
    <p className="text-sm font-semibold tracking-wide">Loading your safety hub...</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen max-w-[85rem] mx-auto">
        <Navbar />
        <main className="flex-1 pt-[7px]">
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/get-started' element={<GetStarted />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Signup />} />
              <Route
                path='/HomePage'
                element={
                  <ProtectedRoute>
                    <AfterLogin />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } />
              <Route path="/user/dashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/map" element={
                <ProtectedRoute>
                  <Map />
                </ProtectedRoute>
              } />
              <Route path="/emergency-map" element={
                <ProtectedRoute>
                  <RealTimeMap />
                </ProtectedRoute>
              } />
              <Route path="/reviews" element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/learn" element={<Learn />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/self-defence" element={<SelfDefence />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/emergency-contacts" element={
                <ProtectedRoute>
                  <EmergencyContacts />
                </ProtectedRoute>
              } />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <ToastContainer />
        <AIChatbot />
      </div>
    </BrowserRouter>
  )
}

export default App