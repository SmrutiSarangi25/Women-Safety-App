import React, { useState, useContext } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import axios from "axios";
import { Config } from '../../API/Config';
import { useGoogleLogin } from "@react-oauth/google";
import { AuthContext } from '../Context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../API/CustomApi';
import { toast } from 'react-toastify';

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors: formErrors }, watch } = useForm({
        mode: 'onBlur',
        defaultValues: {
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false
        }
    });
    const [globalError, setGlobalError] = useState("");
    const { setAuth, setUser, checkAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const passwordValue = watch('password');

    const Submit = async (data) => {
        setGlobalError("");
        
        try {
            setIsLoading(true);
            const response = await api.post(Config.SignUPUrl, {
                username: data.userName,
                email: data.email,
                password: data.password
            });

            if (response.data) {
                toast.success("Account created successfully! Redirecting...");
                await checkAuth();
                navigate("/HomePage");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Signup failed. Please try again.";
            setGlobalError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (tokenResponse) => {
        try {
            setIsLoading(true);
            const userInfoResponse = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    }
                }
            );

            const googleUser = userInfoResponse.data;

            const response = await api.post(
                Config.GoogleSignUpUrl,
                {
                    email: googleUser.email,
                    googleId: googleUser.sub,
                    name: googleUser.name,
                    picture: googleUser.picture
                }

            );

            if (response.data) {
                toast.success("Signup successful! Redirecting...");
                await checkAuth();
                navigate("/HomePage");
            }
        } catch (error) {
            const errorMsg = "Google signup failed: " + (error.response?.data?.message || "Please try again");
            setGlobalError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: (error) => {
            const errorMsg = "Google signup failed. Please try again.";
            setGlobalError(errorMsg);
            toast.error(errorMsg);
        }
    });

    // Check if Google OAuth is configured
    const isGoogleConfigured = Config.GoogleClientId && Config.GoogleClientId.length > 50;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="mb-8 text-center fade-in">
                    <img className="h-14 mx-auto mb-4" src="https://static.wixstatic.com/media/a3633f_5048dd41d66548db8295037eeb4daf54~mv2.png/v1/crop/x_0,y_0,w_1690,h_1049/fill/w_49,h_30,al_c,q_85,usm_0.66_1.00_0.01,blur_2,enc_avif,quality_auto/Group%2048095920.png" alt="Raksha Logo" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600 text-sm">Join our safety community today</p>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSubmit(Submit)} className="bg-white rounded-xl shadow-lg p-8 space-y-6 slide-up">
                    {/* Google Sign Up Button - Only show if configured */}
                    {isGoogleConfigured && (
                        <>
                            <button
                                type="button"
                                disabled={isLoading}
                                className={`w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-brand-primary transition-all duration-300 font-semibold text-gray-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                onClick={() => handleGoogleSignup()}
                            >
                                <img
                                    src="/google.jfif"
                                    alt="Google logo"
                                    className="w-5 h-5"
                                />
                                {isLoading ? 'Loading...' : 'Sign up with Google'}
                            </button>

                            <div className="relative flex py-5 items-center">
                                <div className="flex-grow border-t border-gray-200"></div>
                                <span className="flex-shrink mx-4 text-gray-400">or</span>
                                <div className="flex-grow border-t border-gray-200"></div>
                            </div>
                        </>
                    )}

                    {/* Startup Development Notice - Show when Google not configured */}
                    {!isGoogleConfigured && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm mb-4">
                            <p className="text-blue-900 font-medium">🚀 Startup Mode</p>
                            <p className="text-blue-800 mt-1">Use email/password to test. Google OAuth will be added in Phase 2.</p>
                        </div>
                    )}

                    {globalError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center">
                            {globalError}
                        </div>
                    )}

                    <div className='w-full'>
                        <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-1">
                            User Name
                        </label>
                        <input
                            type="text"
                            id="userName"
                            className={`w-full px-3 py-2 rounded-lg border ${formErrors.userName ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:border-brand-primary transition-colors duration-300`}
                            {...register("userName", {
                                required: "Username is required",
                                minLength: { value: 3, message: "Username must be at least 3 characters" },
                                maxLength: { value: 20, message: "Username must not exceed 20 characters" },
                                pattern: { value: /^[a-zA-Z0-9_-]+$/, message: "Username can only contain letters, numbers, underscores, and hyphens" }
                            })}
                            placeholder="Enter your username"
                        />
                        {formErrors.userName && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.userName.message}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`w-full px-3 py-2 rounded-lg border ${formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:border-brand-primary transition-colors duration-300`}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            placeholder="you@example.com"
                        />
                        {formErrors.email && (
                            <p className="mt-1 text-sm text-red-500">{formErrors.email.message}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    className={`w-full px-3 py-2 rounded-lg border ${formErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:border-brand-primary transition-colors duration-300`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: { 
                                            value: 8, 
                                            message: "Password must be at least 8 characters" 
                                        },
                                        validate: {
                                            hasUpperCase: (value) => /[A-Z]/.test(value) || "Password must contain at least one uppercase letter",
                                            hasNumber: (value) => /[0-9]/.test(value) || "Password must contain at least one number",
                                            hasSpecialChar: (value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) || "Password must contain at least one special character"
                                        }
                                    })}
                                    placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char"
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

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    className={`w-full px-3 py-2 rounded-lg border ${formErrors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:border-brand-primary transition-colors duration-300`}
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) => value === passwordValue || "Passwords do not match"
                                    })}
                                    placeholder="Re-enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            {formErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="flex items-start space-x-2">
                        <input
                            type="checkbox"
                            id="agreeToTerms"
                            name="agreeToTerms"
                            className="mt-1 rounded border-gray-300 text-black focus:ring-black"
                            {...register("agreeToTerms", {
                                required: "You must agree to the Terms and Privacy Policy"
                            })}
                        />
                        <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                            I agree to the{' '}
                            <a href="/terms" className="text-black hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="/privacy" className="text-black hover:underline">Privacy Policy</a>
                        </label>
                    </div>
                    {formErrors.agreeToTerms && (
                        <p className="text-sm text-red-500">{formErrors.agreeToTerms.message}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white rounded-lg py-2.5 font-semibold hover:bg-gray-800 transition-colors duration-300"
                    >
                        Create Account
                    </button>

                    {/* Login Link */}
                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to={"/login"}
                            className="font-semibold text-black hover:underline"
                        >
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;