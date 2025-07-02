'use client'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaSpinner, FaEnvelope, FaLock, FaSignInAlt, FaUserPlus } from 'react-icons/fa';

import supabase from '../../lib/supabaseClient';
import Link from 'next/link';
import useStore from '../../store/useStore';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  }); 
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);

  const onSubmit = async (data) => {
    setLoading(true);
    toast.dismiss();
    
    // Show loading toast
    const loadingToast = toast.loading('Signing you in...', {
      style: {
        background: '#f8fafc',
        color: '#334155',
        border: '1px solid #e2e8f0',
      }
    });

    try {
      const { email, password } = data;
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        toast.dismiss(loadingToast);
        toast.error(signInError.message, {
          duration: 4000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          }
        });
        setLoading(false);
        return;
      }

      // Set user in Zustand store
      if (signInData.user) {
        setUser(signInData.user);
      }

      toast.dismiss(loadingToast);
      toast.success('Welcome back! Login successful.', {
        duration: 3000,
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        }
      });

      setLoading(false);
      router.push('/profile');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('An unexpected error occurred. Please try again.', {
        duration: 4000,
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        }
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
         
          <div className="p-8 space-y-6">
            <h1 className='text-2xl text-gray-800 font-semibold tracking-wider'>Login</h1>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FaEnvelope className="mr-2 text-slate-500" />
                Email Address
              </label>
              <input 
                type="email" 
                {...register('email')} 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-medium text-slate-700">
                  <FaLock className="mr-2 text-slate-500" />
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => console.log('Navigate to forgot password')}
                  className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  {...register('password')} 
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-slate-300 rounded"
                disabled={loading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="button"
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Don't have an account?{' '}
              <Link
               href={'/register'}
                className="text-slate-900 hover:text-slate-700 font-medium hover:underline inline-flex items-center"
              >
                <FaUserPlus className="mr-1" />
                Create one here
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
