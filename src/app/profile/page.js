'use client';

import { useEffect, useState } from 'react';
import supabase from '../../lib/supabaseClient';
import useStore from '../../store/useStore';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        let currentUser = user;
        if (!currentUser) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          currentUser = supabaseUser;
          setUser(currentUser);
        }
        if (currentUser) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          if (error) {
            console.error('Error fetching profile:', error);
          } else {
            setProfile(data);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user, setUser]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!profile) {
    return <div>No profile found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div><strong>Full Name:</strong> {profile.full_name}</div>
      <div><strong>Email:</strong> {profile.email}</div>
      <div><strong>School:</strong> {profile.school}</div>
      <div><strong>Phone Number:</strong> {profile.phone_number}</div>
      <div><strong>Home County:</strong> {profile.home_county}</div>
      <div><strong>Age:</strong> {profile.age}</div>
      <div><strong>Gender:</strong> {profile.gender}</div>
      <div><strong>Parent Name:</strong> {profile.parent_name}</div>
      <div><strong>Parent Contact:</strong> {profile.parent_contact}</div>
      <div><strong>Guardian Name:</strong> {profile.guardian_name}</div>
      <div><strong>Guardian Contact:</strong> {profile.guardian_contact}</div>
      <div><strong>Role:</strong> {profile.role}</div>
    </div>
  );
}
