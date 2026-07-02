import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiDocumentText, HiChat, HiCalendar, HiClock, HiShieldCheck, HiArrowRight, HiLightningBolt } from 'react-icons/hi';
import { fetchDashboard } from '../../redux/slices/dashboardSlice';
import { StatCard, LoadingSkeleton, PageHeader } from '../../components/common/UIComponents';
import { formatDate, getRiskColor, getStatusColor, getReportTypeName } from '../../utils/helpers';
import { useHealthScore } from '../../hooks/useData';

export default function PatientDashboard() {
  const dispatch = useDispatch();
  const { stats, recentReports, upcomingAppointments, recentPredictions, loading } = useSelector(state => state.dashboard);
  const { score } = useHealthScore();

  useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

  if (loading) return <div className="page-container"><LoadingSkeleton type="stat" count={4} /></div>;

  return (
    <div className="page-container">
      <PageHeader title="Dashboard" subtitle="Welcome back! Here's your health overview." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={HiDocumentText} title="Total Reports" value={stats?.reports || 0} color="primary" />
        <StatCard icon={HiShieldCheck} title="Predictions" value={stats?.predictions || 0} color="medical" />
        <StatCard icon={HiCalendar} title="Appointments" value={stats?.appointments || 0} color="yellow" />
        <StatCard icon={HiClock} title="Medicines" value={stats?.medicines || 0} color="red" />
      </div>

      {score && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">AI Health Score</h3>
              <p className="text-muted text-sm">Based on your reports, predictions, and lifestyle</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold gradient-text">{score.score}</div>
              <p className={`text-sm font-medium mt-1 ${score.trend === 'improving' ? 'text-green-500' : score.trend === 'declining' ? 'text-red-500' : 'text-yellow-500'}`}>
                {score.trend === 'improving' ? '↑ Improving' : score.trend === 'declining' ? '↓ Declining' : '→ Stable'}
              </p>
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-dark-border rounded-full h-3">
            <div className="bg-gradient-to-r from-primary-500 to-medical-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${score.score}%` }}></div>
          </div>
          {score.suggestions?.[0] && (
            <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
              <p className="text-sm text-primary-700 dark:text-primary-300 flex items-center gap-2">
                <HiLightningBolt className="w-4 h-4" /> {score.suggestions[0]}
              </p>
            </div>
          )}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Reports</h3>
            <Link to="/reports" className="text-primary-500 text-sm flex items-center gap-1 hover:underline">View All <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          {recentReports?.length > 0 ? (
            <div className="space-y-3">
              {recentReports.slice(0, 5).map((report) => (
                <Link key={report._id} to={`/reports/${report._id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <HiDocumentText className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.title}</p>
                      <p className="text-xs text-muted">{getReportTypeName(report.reportType)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${report.analysisStatus === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'}`}>
                      {report.analysisStatus === 'completed' ? 'Analyzed' : 'Pending'}
                    </span>
                    <p className="text-xs text-muted mt-1">{formatDate(report.createdAt)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HiDocumentText className="w-12 h-12 text-gray-300 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-muted text-sm">No reports yet</p>
              <Link to="/reports/upload" className="btn-primary mt-4 inline-block text-sm px-4 py-2">Upload Report</Link>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Upcoming Appointments</h3>
            <Link to="/appointments" className="text-primary-500 text-sm flex items-center gap-1 hover:underline">View All <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          {upcomingAppointments?.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <div key={apt._id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center">
                      <HiCalendar className="w-5 h-5 text-medical-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Dr. {apt.doctor?.user?.name || 'Doctor'}</p>
                      <p className="text-xs text-muted">{formatDate(apt.appointmentDate)}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(apt.status)}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HiCalendar className="w-12 h-12 text-gray-300 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-muted text-sm">No upcoming appointments</p>
              <Link to="/appointments/book" className="btn-secondary mt-4 inline-block text-sm px-4 py-2">Book Appointment</Link>
            </div>
          )}
        </motion.div>
      </div>

      {recentPredictions?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Recent Predictions</h3>
            <Link to="/predictions" className="text-primary-500 text-sm flex items-center gap-1 hover:underline">View All <HiArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPredictions.map((pred) => (
              <div key={pred._id} className="p-4 rounded-xl border border-gray-100 dark:border-slate-600 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize">{pred.modelType.replace('_', ' ')}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(pred.result.severity)}`}>{pred.result.severity}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2 mb-2">
                  <div className={`h-2 rounded-full ${pred.result.riskPercentage > 60 ? 'bg-red-500' : pred.result.riskPercentage > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${pred.result.riskPercentage}%` }}></div>
                </div>
                <p className="text-xs text-muted">{pred.result.riskPercentage}% risk • {pred.result.confidence}% confidence</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Link to="/chat" className="glass-card p-6 card-hover group">
          <HiChat className="w-8 h-8 text-primary-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold mb-1">AI Health Assistant</h3>
          <p className="text-sm text-muted">Chat with AI about your health reports</p>
        </Link>
        <Link to="/predictions" className="glass-card p-6 card-hover group">
          <HiShieldCheck className="w-8 h-8 text-medical-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold mb-1">Disease Prediction</h3>
          <p className="text-sm text-muted">Check your risk for common diseases</p>
        </Link>
        <Link to="/health" className="glass-card p-6 card-hover group">
          <HiLightningBolt className="w-8 h-8 text-yellow-500 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-bold mb-1">Health Score</h3>
          <p className="text-sm text-muted">View your personalized health score</p>
        </Link>
      </div>
    </div>
  );
}
