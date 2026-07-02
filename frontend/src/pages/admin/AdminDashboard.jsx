import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUserGroup, HiChip, HiDocumentText, HiCalendar, HiCheck, HiX, HiChartBar } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../../config/api';
import { formatDate } from '../../utils/helpers';
import { StatCard, LoadingSkeleton, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [diseaseStats, setDiseaseStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sRes, uRes, dRes, dsRes] = await Promise.all([
          API.get('/admin/stats'), API.get('/admin/users'),
          API.get('/admin/doctors/pending'), API.get('/admin/disease-stats')
        ]);
        setStats(sRes.data.stats);
        setUsers(uRes.data.users);
        setPendingDoctors(dRes.data.doctors);
        setDiseaseStats(dsRes.data.stats);
      } catch { console.error(); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const approveDoctor = async (id) => {
    try {
      await API.put(`/admin/doctors/${id}/approve`);
      setPendingDoctors(pendingDoctors.filter(d => d._id !== id));
      toast.success('Doctor approved');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="page-container"><LoadingSkeleton type="stat" count={4} /></div>;

  const chartData = diseaseStats.map(d => ({ name: d._id.replace('_', ' '), count: d.count, avgRisk: Math.round(d.avgRisk || 0) }));

  return (
    <div className="page-container">
      <PageHeader title="Admin Dashboard" subtitle="System overview and management" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={HiUserGroup} title="Total Users" value={stats?.totalUsers || 0} color="primary" />
        <StatCard icon={HiChip} title="Doctors" value={stats?.totalDoctors || 0} color="medical" />
        <StatCard icon={HiDocumentText} title="Reports" value={stats?.totalReports || 0} color="yellow" />
        <StatCard icon={HiCalendar} title="Appointments" value={stats?.totalAppointments || 0} color="red" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2"><HiChartBar className="w-5 h-5" /> Disease Predictions</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-center py-12">No prediction data yet</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-bold mb-4">Pending Doctor Approvals ({pendingDoctors.length})</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {pendingDoctors.length > 0 ? pendingDoctors.map(doc => (
              <div key={doc._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center text-medical-600 font-semibold">{doc.user?.name?.charAt(0)}</div>
                  <div>
                    <p className="font-medium text-sm">{doc.user?.name}</p>
                    <p className="text-xs text-muted">{doc.specialization} • {doc.experience} yrs exp</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => approveDoctor(doc._id)} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"><HiCheck className="w-5 h-5" /></button>
                  <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><HiX className="w-5 h-5" /></button>
                </div>
              </div>
            )) : <p className="text-muted text-center py-8">No pending approvals</p>}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-bold mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-600">
                <th className="text-left py-3">Name</th><th className="text-left py-3">Email</th>
                <th className="text-left py-3">Role</th><th className="text-left py-3">Joined</th><th className="text-left py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map(u => (
                <tr key={u._id} className="border-b border-gray-100 dark:border-slate-600">
                  <td className="py-3 font-medium">{u.name}</td>
                  <td className="py-3 text-muted">{u.email}</td>
                  <td className="py-3 capitalize">{u.role}</td>
                  <td className="py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
