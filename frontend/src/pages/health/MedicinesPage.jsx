import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock, HiPlus, HiCheck, HiTrash, HiX, HiDownload } from 'react-icons/hi';
import { useMedicines } from '../../hooks/useData';
import API from '../../config/api';
import { LoadingSkeleton, EmptyState, PageHeader } from '../../components/common/UIComponents';
import { useForm } from 'react-hook-form';
import { exportToCSV } from '../../utils/export';
import toast from 'react-hot-toast';

export default function MedicinesPage() {
  const { medicines, loading, refetch } = useMedicines();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.post('/medicines', { ...data, times: data.times?.split(',') || [], days: data.days?.split(',') || [] });
      toast.success('Medicine added!');
      setShowForm(false);
      reset();
      refetch();
    } catch { toast.error('Failed to add medicine'); }
  };

  const markTaken = async (id) => {
    try {
      await API.post(`/medicines/${id}/taken`);
      toast.success('Marked as taken!');
      refetch();
    } catch { toast.error('Failed'); }
  };

  const deleteMedicine = async (id) => {
    try {
      await API.delete(`/medicines/${id}`);
      toast.success('Medicine removed');
      refetch();
    } catch { toast.error('Failed'); }
  };

  const exportMedicines = () => {
    const data = medicines.map(m => ({ Name: m.name, Dosage: m.dosage, Frequency: m.frequency.replace('_', ' '), Times: m.times?.join(', '), Instructions: m.instructions || '' }));
    exportToCSV(data, 'medimind_medicines');
    toast.success('Medicines exported');
  };

  return (
    <div className="page-container">
      <PageHeader title="Medicine Reminders" subtitle="Track and manage your medications"
        action={<div className="flex gap-2">
          <button onClick={exportMedicines} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl text-sm font-medium transition-colors"><HiDownload className="w-4 h-4" /> Export</button>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Add Medicine</button>
        </div>} />

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="glass-card p-6 mb-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Add New Medicine</h3>
              <button onClick={() => setShowForm(false)}><HiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <input {...register('name', { required: true })} placeholder="Medicine name" className="input-field" />
              <input {...register('dosage', { required: true })} placeholder="Dosage (e.g., 500mg)" className="input-field" />
              <select {...register('frequency', { required: true })} className="input-field">
                <option value="once_daily">Once Daily</option>
                <option value="twice_daily">Twice Daily</option>
                <option value="thrice_daily">Thrice Daily</option>
                <option value="weekly">Weekly</option>
                <option value="as_needed">As Needed</option>
              </select>
              <input {...register('times')} placeholder="Times (comma separated, e.g., 08:00,20:00)" className="input-field" />
              <input {...register('days')} placeholder="Days (comma separated)" className="input-field" />
              <input {...register('startDate', { required: true })} type="date" className="input-field" />
              <input {...register('instructions')} placeholder="Instructions" className="input-field sm:col-span-2 lg:col-span-3" />
              <div className="sm:col-span-2 lg:col-span-3 flex gap-2">
                <button type="submit" className="btn-primary">Add Medicine</button>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-outline">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <LoadingSkeleton type="card" count={4} /> : medicines.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map((med, i) => (
            <motion.div key={med._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                  <HiClock className="w-6 h-6 text-white" />
                </div>
                <button onClick={() => deleteMedicine(med._id)} className="p-2 hover:text-red-500 text-gray-400">
                  <HiTrash className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-lg">{med.name}</h3>
              <p className="text-sm text-muted">{med.dosage} • {med.frequency.replace('_', ' ')}</p>
              {med.times?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {med.times.map((t, j) => <span key={j} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 px-2 py-1 rounded-full">{t}</span>)}
                </div>
              )}
              {med.instructions && <p className="text-xs text-muted mt-2 bg-gray-50 dark:bg-slate-800/50 p-2 rounded-lg">{med.instructions}</p>}
              <button onClick={() => markTaken(med._id)} className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm py-2">
                <HiCheck className="w-4 h-4" /> Mark as Taken
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiClock} title="No medicines added" description="Add your medications to get smart reminders"
          action={<button onClick={() => setShowForm(true)} className="btn-primary">Add Medicine</button>} />
      )}
    </div>
  );
}
