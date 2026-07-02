import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUserGroup, HiCalendar, HiDocumentText, HiCheck, HiX } from 'react-icons/hi';
import API from '../../config/api';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { StatCard, LoadingSkeleton, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, aRes] = await Promise.all([API.get('/doctor/patients'), API.get('/doctor/appointments')]);
        setPatients(pRes.data.patients);
        setAppointments(aRes.data.appointments);
      } catch { console.error(); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status });
      setAppointments(appointments.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Appointment ${status}`);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="page-container"><LoadingSkeleton type="stat" count={3} /></div>;

  return (
    <div className="page-container">
      <PageHeader title="Doctor Dashboard" subtitle="Manage your patients and appointments" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={HiUserGroup} title="Total Patients" value={patients.length} color="primary" />
        <StatCard icon={HiCalendar} title="Appointments" value={appointments.length} color="medical" />
        <StatCard icon={HiDocumentText} title="Pending" value={appointments.filter(a => a.status === 'pending').length} color="yellow" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-bold mb-4">Recent Patients</h3>
          <div className="space-y-3">
            {patients.slice(0, 8).map(p => (
              <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-medical-400 flex items-center justify-center text-white font-semibold">{p.name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted">{p.email}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <h3 className="font-bold mb-4">Appointments</h3>
          <div className="space-y-3">
            {appointments.slice(0, 8).map(apt => (
              <div key={apt._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <div>
                  <p className="font-medium text-sm">{apt.patient?.name || 'Patient'}</p>
                  <p className="text-xs text-muted">{formatDate(apt.appointmentDate)} • {apt.timeSlot?.startTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>{apt.status}</span>
                  {apt.status === 'pending' && (
                    <div className="flex gap-1">
                      <button onClick={() => updateStatus(apt._id, 'confirmed')} className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"><HiCheck className="w-4 h-4" /></button>
                      <button onClick={() => updateStatus(apt._id, 'cancelled')} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"><HiX className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
