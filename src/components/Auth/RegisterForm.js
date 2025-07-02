'use client'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  fullName: yup.string().required('Full name is required'),
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
  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    toast.dismiss();
    const { email, password, fullName } = data;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    }, {
      data: { full_name: fullName }
    });

    if (signUpError) {
      toast.error(signUpError.message, { duration: 4000 });
      setLoading(false);
      return;
    }

    // Insert user profile into users table
    const userId = signUpData.user?.id;
    if (userId) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([{ id: userId, email, full_name: fullName, role: 'student', password_hash: '' }]);
      if (insertError) {
        toast.error('Failed to save user profile: ' + insertError.message, { duration: 4000 });
        setLoading(false);
        return;
      }
    }

    toast.success('Registration successful! Please check your email to verify your account.', { duration: 4000 });
    setLoading(false);
    router.push('/login');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <div className="mb-4">
        <label className="block mb-1">Full Name</label>
        <input type="text" {...register('fullName')} className="w-full border p-2 rounded" />
        <p className="text-red-600">{errors.fullName?.message}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input type="email" {...register('email')} className="w-full border p-2 rounded" />
        <p className="text-red-600">{errors.email?.message}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password</label>
        <input type="password" {...register('password')} className="w-full border p-2 rounded" />
        <p className="text-red-600">{errors.password?.message}</p>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Confirm Password</label>
        <input type="password" {...register('confirmPassword')} className="w-full border p-2 rounded" />
        <p className="text-red-600">{errors.confirmPassword?.message}</p>
      </div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
