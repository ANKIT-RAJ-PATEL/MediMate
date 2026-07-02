import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiUser, HiSave } from 'react-icons/hi';
import API from '../config/api';
import { getMe } from '../redux/slices/authSlice';
import { PageHeader } from '../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '', phone: user?.phone || '',
      gender: user?.gender || '', bloodGroup: user?.bloodGroup || '',
      height: user?.height || '', weight: user?.weight || '',
      'address.city': user?.address?.city || '', 'address.state': user?.address?.state || '',
      'healthProfile.exerciseFrequency': user?.healthProfile?.exerciseFrequency || 'sometimes',
      'healthProfile.sleepHours': user?.healthProfile?.sleepHours || 7,
      'healthProfile.dietType': user?.healthProfile?.dietType || 'non-vegetarian',
      'healthProfile.smokingStatus': user?.healthProfile?.smokingStatus || 'never',
      'healthProfile.alcoholConsumption': user?.healthProfile?.alcoholConsumption || 'never'
    }
  });

  const onSubmit = async (data) => {
    try {
      const profileData = {
        name: data.name, phone: data.phone, gender: data.gender, bloodGroup: data.bloodGroup,
        height: data.height ? Number(data.height) : undefined,
        weight: data.weight ? Number(data.weight) : undefined,
        address: { city: data['address.city'], state: data['address.state'] },
        healthProfile: {
          exerciseFrequency: data['healthProfile.exerciseFrequency'],
          sleepHours: Number(data['healthProfile.sleepHours']),
          dietType: data['healthProfile.dietType'],
          smokingStatus: data['healthProfile.smokingStatus'],
          alcoholConsumption: data['healthProfile.alcoholConsumption']
        }
      };
      await API.put('/auth/update-profile', profileData);
      dispatch(getMe());
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-medical-400 flex items-center justify-center text-white text-2xl font-bold">{user?.name?.charAt(0)}</div>
            <div>
              <h3 className="font-bold text-lg">{user?.name}</h3>
              <p className="text-muted text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Full Name</label><input {...register('name')} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input {...register('phone')} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Gender</label><select {...register('gender')} className="input-field"><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Blood Group</label><select {...register('bloodGroup')} className="input-field"><option value="">Select</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Height (cm)</label><input {...register('height')} type="number" className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Weight (kg)</label><input {...register('weight')} type="number" className="input-field" /></div>
          </div>

          <h4 className="font-bold pt-4 border-t border-gray-200 dark:border-slate-600">Health Profile</h4>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Exercise Frequency</label><select {...register('healthProfile.exerciseFrequency')} className="input-field"><option value="never">Never</option><option value="rarely">Rarely</option><option value="sometimes">Sometimes</option><option value="often">Often</option><option value="daily">Daily</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Sleep Hours</label><input {...register('healthProfile.sleepHours')} type="number" className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Diet Type</label><select {...register('healthProfile.dietType')} className="input-field"><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-Vegetarian</option><option value="vegan">Vegan</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Smoking Status</label><select {...register('healthProfile.smokingStatus')} className="input-field"><option value="never">Never</option><option value="former">Former</option><option value="current">Current</option></select></div>
          </div>

          <button type="submit" className="btn-primary flex items-center gap-2"><HiSave className="w-5 h-5" /> Save Changes</button>
        </form>
      </motion.div>
    </div>
  );
}
