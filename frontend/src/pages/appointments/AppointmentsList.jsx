import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCalendar, HiSearch, HiPlus } from 'react-icons/hi';
import { useAppointments } from '../../hooks/useData';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { LoadingSkeleton, EmptyState, PageHeader } from '../../components/common/UIComponents';

export default function AppointmentsList() {
  const [status, setStatus] = useState('');
  const { appointments, loading } = useAppointments(status);

  return (
    <div className="page-container">
      <PageHeader title="Appointments" subtitle="Manage your doctor appointments"
        action={<Link to="/appointments/book" className="btn-primary flex items-center gap-2"><HiPlus className="w-5 h-5" /> Book New</Link>} />

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
          <button key={s} onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${status === s ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-dark-border'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSkeleton type="card" count={4} /> : appointments.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {appointments.map((apt, i) => (
            <motion.div key={apt._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-medical-400 to-medical-600 flex items-center justify-center text-white font-bold">
                    {apt.doctor?.user?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h3 className="font-semibold">Dr. {apt.doctor?.user?.name || 'Doctor'}</h3>
                    <p className="text-sm text-muted">{apt.doctor?.specialization || 'Specialist'}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(apt.status)}`}>{apt.status}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">Date</span><span>{formatDate(apt.appointmentDate)}</span></div>
                <div className="flex justify-between"><span className="text-muted">Time</span><span>{apt.timeSlot?.startTime} - {apt.timeSlot?.endTime}</span></div>
                <div className="flex justify-between"><span className="text-muted">Type</span><span className="capitalize">{apt.consultationType}</span></div>
                <div className="flex justify-between"><span className="text-muted">Fee</span><span className="font-semibold">₹{apt.amount}</span></div>
              </div>
              {apt.reason && <p className="mt-3 text-sm text-muted bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">{apt.reason}</p>}
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiCalendar} title="No appointments found" description="Book your first appointment with a verified doctor"
          action={<Link to="/appointments/book" className="btn-primary">Book Appointment</Link>} />
      )}
    </div>
  );
}
