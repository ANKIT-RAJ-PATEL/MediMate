import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiShieldCheck, HiHeart, HiChip, HiLightningBolt, HiCog } from 'react-icons/hi';
import API from '../../config/api';
import { getRiskColor } from '../../utils/helpers';
import { PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

const models = [
  { id: 'diabetes', name: 'Diabetes', icon: HiChip, color: 'from-blue-500 to-blue-600', fields: ['glucose', 'insulin', 'bmi', 'age', 'bloodPressure'] },
  { id: 'heart_disease', name: 'Heart Disease', icon: HiHeart, color: 'from-red-500 to-red-600', fields: ['cholesterol', 'bloodPressure', 'maxHeartRate', 'age', 'exerciseAngina'] },
  { id: 'liver_disease', name: 'Liver Disease', icon: HiCog, color: 'from-yellow-500 to-yellow-600', fields: ['alt', 'ast', 'bilirubin', 'albumin', 'alkalinePhosphatase'] },
  { id: 'kidney_disease', name: 'Kidney Disease', icon: HiLightningBolt, color: 'from-purple-500 to-purple-600', fields: ['creatinine', 'bun', 'gfr', 'sodium', 'potassium'] },
  { id: 'stroke', name: 'Stroke', icon: HiShieldCheck, color: 'from-orange-500 to-orange-600', fields: ['bloodPressure', 'cholesterol', 'glucose', 'bmi', 'smokingStatus'] },
];

export default function PredictionsPage() {
  const [selectedModel, setSelectedModel] = useState(null);
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!selectedModel) return;
    try {
      setLoading(true);
      const { data } = await API.post('/predictions/predict', { modelType: selectedModel.id, parameters: formData });
      setResult(data.prediction);
      toast.success('Prediction complete!');
    } catch { toast.error('Prediction failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container max-w-5xl mx-auto">
      <PageHeader title="Disease Risk Prediction" subtitle="AI-powered health risk assessment using machine learning" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {models.map((model) => (
          <motion.button key={model.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedModel(model); setResult(null); setFormData({}); }}
            className={`glass-card p-6 text-left transition-all ${selectedModel?.id === model.id ? 'ring-2 ring-primary-500' : ''}`}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-4`}>
              <model.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold">{model.name}</h3>
            <p className="text-sm text-muted mt-1">Check your risk factors</p>
          </motion.button>
        ))}
      </div>

      {selectedModel && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <h3 className="text-lg font-bold mb-6">{selectedModel.name} Risk Assessment</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {selectedModel.fields.map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <input type="text" placeholder={`Enter ${field}`}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className="input-field" />
              </div>
            ))}
          </div>
          <button onClick={handlePredict} disabled={loading} className="btn-primary">
            {loading ? 'Analyzing...' : 'Run Prediction'}
          </button>
        </motion.div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 mt-6">
          <h3 className="text-lg font-bold mb-6">Prediction Results</h3>
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-4xl font-bold gradient-text mb-2">{result.riskPercentage}%</div>
              <p className="text-sm text-muted">Risk Level</p>
              <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-3 mt-3">
                <div className={`h-3 rounded-full ${result.riskPercentage > 60 ? 'bg-red-500' : result.riskPercentage > 30 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${result.riskPercentage}%` }}></div>
              </div>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="text-4xl font-bold text-medical-500 mb-2">{result.confidence}%</div>
              <p className="text-sm text-muted">Confidence Score</p>
            </div>
            <div className="text-center p-6 bg-gray-50 dark:bg-slate-800/50 rounded-2xl">
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold capitalize ${getRiskColor(result.severity)}`}>{result.severity}</span>
              <p className="text-sm text-muted mt-2">Severity</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl mb-4">
            <p className="text-sm">{result.summary}</p>
          </div>

          {result.recommendations?.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary-500 mt-0.5">•</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
