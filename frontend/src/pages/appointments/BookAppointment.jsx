import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiArrowLeft, HiSearch } from 'react-icons/hi';
import API from '../../config/api';
import { PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await API.get('/appointments/doctors');
        setDoctors(data.doctors);
      } catch { console.error(); }
      finally { setLoading(false); }
    };
    fetchDoctors();
  }, []);

  const onSubmit = async (data) => {
    if (!selectedDoctor) return toast.error('Please select a doctor');
    try {
      await API.post('/appointments/book', {
        doctorId: selectedDoctor._id,
        appointmentDate: data.date,
        timeSlot: { startTime: data.time, endTime: calculateEndTime(data.time) },
        reason: data.reason,
        consultationType: data.type
      });
      toast.success('Appointment booked!');
      navigate('/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const calculateEndTime = (time) => {
    const [h, m] = time.split(':').map(Number);
    return `${(h + 1).toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container max-w-5xl mx-auto">
      <button onClick={() => navigate('/appointments')} className="flex items-center gap-2 text-muted hover:text-gray-900 dark:hover:text-white mb-4">
        <HiArrowLeft className="w-5 h-5" /> Back
      </button>
      <PageHeader title="Book Appointment" subtitle="Find and book an appointment with a doctor" />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-6 mb-6">
            <h3 className="font-bold mb-4">Select Doctor</h3>
            <div className="relative mb-4">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search doctors..." className="input-field pl-10" />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {doctors.map(doc => (
                <motion.div key={doc._id} whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDoctor?._id === doc._id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-slate-600 hover:border-gray-300'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white font-bold text-lg">{doc.user?.name?.charAt(0)}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">Dr. {doc.user?.name}</h4>
                      <p className="text-sm text-muted">{doc.specialization} • {doc.experience} years experience</p>
                      <p className="text-sm text-primary-500">₹{doc.consultationFee}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {doctors.length === 0 && !loading && <p className="text-muted text-center py-8">No doctors available</p>}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 h-fit">
          <h3 className="font-bold mb-4">Book Appointment</h3>
          {selectedDoctor ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <p className="font-medium text-sm">Dr. {selectedDoctor.user?.name}</p>
                <p className="text-xs text-muted">{selectedDoctor.specialization}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input {...register('date', { required: true })} type="date" className="input-field" min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input {...register('time', { required: true })} type="time" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select {...register('type')} className="input-field">
                  <option value="in-person">In-Person</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea {...register('reason')} placeholder="Describe your symptoms..." className="input-field" rows={3} />
              </div>
              <button type="submit" className="btn-primary w-full">Book Appointment</button>
            </form>
          ) : (
            <p className="text-muted text-center py-8">Select a doctor to continue</p>
          )}
        </div>
      </div>
    </div>
  );
}
