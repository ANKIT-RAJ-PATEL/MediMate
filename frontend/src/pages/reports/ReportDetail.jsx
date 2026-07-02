import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiDocumentText, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi';
import API from '../../config/api';
import { formatDate, getReportTypeName, getRiskColor } from '../../utils/helpers';
import { LoadingSkeleton, PageHeader } from '../../components/common/UIComponents';
import toast from 'react-hot-toast';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await API.get(`/reports/${id}`);
        setReport(data.report);
      } catch {
        toast.error('Report not found');
        navigate('/reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id, navigate]);

  const runAnalysis = async () => {
    try {
      setAnalyzing(true);
      const { data } = await API.post('/reports/analyze', { reportId: id });
      setReport(data.report);
      toast.success('Analysis complete!');
    } catch {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="page-container"><LoadingSkeleton type="card" count={3} /></div>;
  if (!report) return null;

  const statusIcons = {
    normal: <HiCheckCircle className="w-5 h-5 text-green-500" />,
    low: <HiExclamationCircle className="w-5 h-5 text-yellow-500" />,
    high: <HiExclamationCircle className="w-5 h-5 text-red-500" />,
    critical: <HiExclamationCircle className="w-5 h-5 text-red-600" />
  };

  return (
    <div className="page-container max-w-5xl mx-auto">
      <button onClick={() => navigate('/reports')} className="flex items-center gap-2 text-muted hover:text-gray-900 dark:hover:text-white mb-4">
        <HiArrowLeft className="w-5 h-5" /> Back to Reports
      </button>

      <PageHeader title={report.title} subtitle={`${getReportTypeName(report.reportType)} • Uploaded ${formatDate(report.createdAt)}`} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {report.extractedText && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">Extracted Data</h3>
              {report.structuredData?.parameters?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-slate-600">
                        <th className="text-left py-3 px-2">Parameter</th>
                        <th className="text-left py-3 px-2">Value</th>
                        <th className="text-left py-3 px-2">Unit</th>
                        <th className="text-left py-3 px-2">Reference</th>
                        <th className="text-left py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.structuredData.parameters.map((param, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-slate-600">
                          <td className="py-3 px-2 font-medium">{param.name}</td>
                          <td className="py-3 px-2">{param.value}</td>
                          <td className="py-3 px-2 text-muted">{param.unit}</td>
                          <td className="py-3 px-2 text-muted text-xs">{param.referenceRange}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1">
                              {statusIcons[param.status]}
                              <span className={`text-xs capitalize ${param.status === 'normal' ? 'text-green-500' : 'text-red-500'}`}>{param.status}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-sm">{report.extractedText.substring(0, 500)}...</p>
              )}
            </motion.div>
          )}

          {report.aiAnalysis && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="text-lg font-bold mb-4">AI Analysis</h3>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getRiskColor(report.aiAnalysis.riskLevel)}`}>
                <HiInformationCircle className="w-4 h-4" /> Risk Level: {report.aiAnalysis.riskLevel?.toUpperCase()}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{report.aiAnalysis.summary}</p>

              {report.aiAnalysis.explanations?.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Parameter Explanations</h4>
                  {report.aiAnalysis.explanations.map((exp, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                      <p className="font-medium text-primary-600 dark:text-primary-400">{exp.parameter}</p>
                      <p className="text-sm mt-1">{exp.explanation}</p>
                      {exp.recommendation && <p className="text-sm text-green-600 dark:text-green-400 mt-2">💡 {exp.recommendation}</p>}
                    </div>
                  ))}
                </div>
              )}

              {report.aiAnalysis.lifestyleRecommendations && (
                <div className="mt-6 grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl">
                    <h5 className="font-semibold text-green-700 dark:text-green-400 mb-2">Diet Recommendations</h5>
                    <ul className="text-sm space-y-1">
                      {report.aiAnalysis.lifestyleRecommendations.diet?.map((d, i) => <li key={i}>• {d}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                    <h5 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Exercise Recommendations</h5>
                    <ul className="text-sm space-y-1">
                      {report.aiAnalysis.lifestyleRecommendations.exercise?.map((e, i) => <li key={i}>• {e}</li>)}
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {!report.aiAnalysis && report.ocrStatus === 'completed' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 text-center">
              <HiDocumentText className="w-16 h-16 text-gray-300 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Ready for AI Analysis</h3>
              <p className="text-muted mb-6">Get personalized insights about your medical report</p>
              <button onClick={runAnalysis} disabled={analyzing} className="btn-primary">
                {analyzing ? 'Analyzing...' : 'Run AI Analysis'}
              </button>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <h3 className="font-bold mb-4">Report Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted">Type</span><span className="font-medium">{getReportTypeName(report.reportType)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Uploaded</span><span className="font-medium">{formatDate(report.createdAt)}</span></div>
              <div className="flex justify-between"><span className="text-muted">OCR Status</span><span className={`font-medium ${report.ocrStatus === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>{report.ocrStatus}</span></div>
              <div className="flex justify-between"><span className="text-muted">Analysis</span><span className={`font-medium ${report.analysisStatus === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>{report.analysisStatus}</span></div>
            </div>
          </motion.div>

          {report.fileUrl && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
              <h3 className="font-bold mb-4">Original File</h3>
              {report.fileType === 'pdf' ? (
                <iframe src={report.fileUrl} className="w-full h-64 rounded-lg" title="Report PDF" />
              ) : (
                <img src={report.fileUrl} alt="Report" className="w-full rounded-lg" />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
