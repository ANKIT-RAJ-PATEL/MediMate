import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../../config/api';
import { LoadingSkeleton, PageHeader } from '../../components/common/UIComponents';
import { formatDate } from '../../utils/helpers';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendsRes, timelineRes] = await Promise.all([
          API.get('/analytics/trends'),
          API.get('/analytics/timeline')
        ]);
        setTrends(trendsRes.data.trends);
        setTimeline(timelineRes.data.timeline);
      } catch { console.error(); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="page-container"><LoadingSkeleton type="chart" count={3} /></div>;

  return (
    <div className="page-container">
      <PageHeader title="Health Analytics" subtitle="Track your health trends over time" />

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-bold mb-4">Blood Sugar Trend</h3>
          {trends?.bloodSugar?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends.bloodSugar.map(d => ({ date: formatDate(d.date), value: d.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-center py-12">No data available. Upload blood test reports to see trends.</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-bold mb-4">Cholesterol Trend</h3>
          {trends?.cholesterol?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trends.cholesterol.map(d => ({ date: formatDate(d.date), value: d.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-muted text-center py-12">No data available. Upload lipid profile reports to see trends.</p>}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h3 className="font-bold mb-4">Health Timeline</h3>
        {timeline.length > 0 ? (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border"></div>
            <div className="space-y-6">
              {timeline.slice(0, 15).map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                    item.type === 'report' ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/30' :
                    item.type === 'prediction' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                    item.type === 'appointment' ? 'bg-medical-100 text-medical-600 dark:bg-medical-900/30' :
                    'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30'
                  }`}>
                    {item.type === 'report' ? '📄' : item.type === 'prediction' ? '🛡️' : item.type === 'appointment' ? '📅' : '💊'}
                  </div>
                  <div className="glass-card p-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{item.title}</h4>
                      <span className="text-xs text-muted">{formatDate(item.date)}</span>
                    </div>
                    <p className="text-xs text-muted capitalize mt-1">{item.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <p className="text-muted text-center py-12">No timeline data yet. Start using MediMind to see your health timeline.</p>}
      </motion.div>
    </div>
  );
}
