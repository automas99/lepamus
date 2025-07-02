'use client'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import supabase from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  }); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter()

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMsg('');
    const { email, password } = data;
    const { user, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {errorMsg && <p className="text-red-600 mb-2">{errorMsg}</p>}
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
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
