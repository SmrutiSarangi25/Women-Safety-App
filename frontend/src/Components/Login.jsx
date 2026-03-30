import axios from 'axios';
import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Config } from '../../API/Config';
import { useGoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import api from '../../API/CustomApi';
import { toast } from 'react-toastify';
import { useBranding } from '../Context/BrandingContext';

function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState("");
    const { register, handleSubmit, formState: { errors: formErrors, isSubmitting } } = useForm({
        defaultValues: {
            email: '',
            password: ''
        }
    });
    const navigate = useNavigate();
    const { checkAuth } = useContext(AuthContext)
    const { brandData } = useBranding()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const Submit = async (data) => {
        try {
            const response = await api.post(Config.LOGINUrl, {
                email: data.email,
                password: data.password
            });
            if (response) {
                await checkAuth()
                toast.success('Login successful!', { position: 'top-right' })
                navigate("/HomePage")
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please try again.', { position: 'top-right' });
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        try {
            setIsLoading(true);
            setErrors("");

            const userInfoResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    }
                }
            );

            const googleUser = userInfoResponse.data;

          
            const response = await api.post(Config.GoogleSignUpUrl, {
                email: googleUser.email,
                name: googleUser.name,
                googleId: googleUser.sub,
                picture: googleUser.picture
            });

            if (response.data) {
                await checkAuth()
                navigate("/HomePage")
                
            }
        } catch (error) {
            setErrors(error.response?.data?.message || "Failed to login with Google");
            console.error("Google login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (error) => {
            console.error("Google login error:", error);
            setErrors("Failed to login with Google");
        }
    });

    // Check if Google OAuth is configured
    const isGoogleConfigured = Config.GoogleClientId && Config.GoogleClientId.length > 50;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="mb-8 text-center fade-in">
                    {brandData.logo.image ? (
                        <div className="mx-auto mb-4 inline-flex rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-md">
                            <img className="h-14 w-auto object-contain md:h-16" src={brandData.logo.image} alt={`${brandData.name} Logo`} />
                        </div>
                    ) : (
                        <h2 className="mx-auto mb-4 inline-block rounded-2xl border border-white/70 bg-white/80 px-4 py-2 text-2xl font-black text-gray-900 shadow-md">
                            {brandData.name}
                        </h2>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600 text-sm">Sign in to access your safety network</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(Submit)} className="bg-white rounded-xl shadow-lg p-8 space-y-6 slide-up">
                    {/* Google Login Button - Only show if configured */}
                    {isGoogleConfigured && (
                        <>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-brand-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700"
                                onClick={() => handleGoogleLogin()}
                            >
                                <img
                                    src="/google.jfif"
                                    alt="Google logo"
                                    className="w-5 h-5"
                                />
                                Continue with Google
                            </button>

                            <div className="relative flex py-3 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-400 text-sm">or email</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                        </>
                    )}

                    {/* Startup Development Notice - Show when Google not configured */}
                    {!isGoogleConfigured && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                            <p className="text-blue-900 font-medium">🚀 Startup Mode</p>
                            <p className="text-blue-800 mt-1">Use email/password to test. Google OAuth will be added in Phase 2.</p>
                        </div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register("email", {
                                required: 'Email is required',
                                pattern: { value: emailRegex, message: 'Please enter a valid email address' }
                            })}
                            className={`w-full px-4 py-2 rounded-lg border transition-colors ${formErrors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-200'} focus:outline-none focus:border-blue-500`}
                            placeholder="Enter your email"
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.email.message}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                {...register("password", {
                                    required: 'Password is required',
                                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                })}
                                className={`w-full px-4 py-2 rounded-lg border transition-colors ${formErrors.password ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:ring-2 focus:ring-blue-200'} focus:outline-none focus:border-blue-500`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {formErrors.password && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.password.message}</p>
                        )}
                    </div>

                    {/* Remember Me and Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-black focus:ring-black"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                        <a
                            href="/forgot-password"
                            className="text-sm text-gray-600 hover:text-black transition-colors duration-300"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white rounded-lg py-2.5 font-semibold hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>

                    {/* Sign Up Link */}
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link
                            to={"/register"}
                            className="font-semibold text-black hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;