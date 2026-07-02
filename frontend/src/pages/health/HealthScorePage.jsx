import { motion } from 'framer-motion';
import { HiShieldCheck, HiTrendingUp, HiTrendingDown, HiMinus } from 'react-icons/hi';
import { useHealthScore } from '../../hooks/useData';
import API from '../../config/api';
import { LoadingSkeleton, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function HealthScorePage() {
  const { score, loading } = useHealthScore();

  const calculateScore = async () => {
    try {
      await API.post('/health/score/calculate');
      toast.success('Score recalculated!');
      window.location.reload();
    } catch { toast.error('Failed to calculate'); }
  };

  if (loading) return <div className="page-container"><LoadingSkeleton type="stat" count={3} /></div>;

  const breakdown = score?.breakdown || {};
  const breakdownItems = [
    { label: 'BMI Score', value: breakdown.bmiScore, color: 'bg-blue-500' },
    { label: 'Report Score', value: breakdown.reportScore, color: 'bg-green-500' },
    { label: 'Lifestyle Score', value: breakdown.lifestyleScore, color: 'bg-yellow-500' },
    { label: 'Prediction Score', value: breakdown.predictionScore, color: 'bg-purple-500' },
  ];

  return (
    <div className="page-container max-w-4xl mx-auto">
      <PageHeader title="AI Health Score" subtitle="Your personalized health assessment"
        action={<button onClick={calculateScore} className="btn-primary">Recalculate</button>} />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center mb-8">
        <div className="relative inline-block">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="88" stroke="#334155" strokeWidth="12" fill="none" />
            <circle cx="96" cy="96" r="88" stroke="url(#gradient)" strokeWidth="12" fill="none"
              strokeDasharray={`${(score?.score || 0) * 5.53} 553`} strokeLinecap="round" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold gradient-text">{score?.score || 0}</span>
            <span className="text-muted text-sm">out of 100</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          {score?.trend === 'improving' ? <HiTrendingUp className="w-5 h-5 text-green-500" /> :
           score?.trend === 'declining' ? <HiTrendingDown className="w-5 h-5 text-red-500" /> :
           <HiMinus className="w-5 h-5 text-yellow-500" />}
          <span className={`font-medium ${score?.trend === 'improving' ? 'text-green-500' : score?.trend === 'declining' ? 'text-red-500' : 'text-yellow-500'}`}>
            {score?.trend === 'improving' ? 'Improving' : score?.trend === 'declining' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {breakdownItems.map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass-card p-5 text-center">
            <div className="text-3xl font-bold mb-2" style={{ color: item.color.replace('bg-', '').replace('-500', '') }}>
              {Math.round(item.value || 0)}
            </div>
            <p className="text-sm text-muted">{item.label}</p>
            <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2 mt-3">
              <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.value || 0}%` }}></div>
            </div>
          </motion.div>
        ))}
      </div>

      {score?.suggestions?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <HiShieldCheck className="w-5 h-5 text-primary-500" /> Improvement Suggestions
          </h3>
          <div className="space-y-3">
            {score.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-primary-50 dark:bg-primary-900/10 rounded-xl">
                <span className="text-primary-500 font-bold">{i + 1}.</span>
                <p className="text-sm">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
