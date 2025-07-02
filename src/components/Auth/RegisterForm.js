'use client'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaSpinner, FaUser, FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';

import supabase from '../../lib/supabaseClient';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  fullName: yup.string().required('Full name is required'),
  school: yup.string().required('School is required'),
  phoneNumber: yup.string().required('Phone number is required'),
  homeCounty: yup.string().required('Home county is required'),
  age: yup.number().typeError('Age must be a number').required('Age is required').min(1, 'Age must be at least 1'),
  gender: yup.string().required('Gender is required'),
  parentName: yup.string().required('Parent name is required'),
  parentContact: yup.string().required('Parent contact is required'),
  guardianName: yup.string().required('Guardian name is required'),
  guardianContact: yup.string().required('Guardian contact is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    toast.dismiss();
    
    // Show loading toast
    const loadingToast = toast.loading('Creating your account...', {
      style: {
        background: '#f8fafc',
        color: '#334155',
        border: '1px solid #e2e8f0',
      }
    });

    try {
      const { email, password, fullName } = data;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      }, {
        data: { full_name: fullName }
      });

      if (signUpError) {
        toast.dismiss(loadingToast);
        toast.error(signUpError.message, { 
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

      // Insert user profile into users table
      const userId = signUpData.user?.id;
      if (userId) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: userId, email, full_name: fullName, role: 'student' }]);
        
        if (insertError) {
          toast.dismiss(loadingToast);
          toast.error('Failed to save user profile: ' + insertError.message, { 
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
      }

      toast.dismiss(loadingToast);
      toast.success('Registration successful! Please check your email to verify your account.', { 
        duration: 5000,
        style: {
          background: '#f0fdf4',
          color: '#166534',
          border: '1px solid #bbf7d0',
        }
      });
      
      setLoading(false);
      router.push('/login');
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
         <h1 className='text-2xl font-semibold text-gray-800'>Create a new account</h1>
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FaUser className="mr-2 text-slate-500" />
                Full Name
              </label>
              <input 
                type="text" 
                {...register('fullName')} 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
                placeholder="Enter your full name"
                disabled={loading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
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
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FaLock className="mr-2 text-slate-500" />
                Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  {...register('password')} 
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                <FaLock className="mr-2 text-slate-500" />
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  {...register('confirmPassword')} 
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-slate-900 placeholder-slate-400"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  disabled={loading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">!</span>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              onClick={handleSubmit(onSubmit)}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <FaUserPlus />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <button 
                onClick={() => console.log('Navigate to login')}
                className="text-slate-900 hover:text-slate-700 font-medium hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

       
      </div>
    </div>
  );
}