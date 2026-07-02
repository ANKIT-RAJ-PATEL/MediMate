import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDocumentText, HiUpload, HiSearch } from 'react-icons/hi';
import { useReports } from '../../hooks/useData';
import { formatDate, getReportTypeName } from '../../utils/helpers';
import { LoadingSkeleton, EmptyState, PageHeader } from '../../components/common/UIComponents';

export default function ReportsList() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const { reports, total, loading } = useReports(page, 10, type);

  return (
    <div className="page-container">
      <PageHeader title="Medical Reports" subtitle="View and manage your uploaded reports"
        action={<Link to="/reports/upload" className="btn-primary flex items-center gap-2"><HiUpload className="w-5 h-5" /> Upload New</Link>} />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search reports..." className="input-field pl-10" />
        </div>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="input-field w-auto">
          <option value="">All Types</option>
          <option value="blood_test">Blood Test</option>
          <option value="cbc">CBC</option>
          <option value="lipid_profile">Lipid Profile</option>
          <option value="thyroid">Thyroid</option>
          <option value="liver_function">Liver Function</option>
          <option value="kidney_function">Kidney Function</option>
          <option value="diabetes">Diabetes</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton type="card" count={5} /> : reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <motion.div key={report._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/reports/${report._id}`} className="glass-card p-5 flex items-center justify-between card-hover block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <HiDocumentText className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted">{getReportTypeName(report.reportType)} • {formatDate(report.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full ${report.ocrStatus === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20'}`}>
                    {report.ocrStatus === 'completed' ? 'Processed' : 'Processing'}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full ${report.analysisStatus === 'completed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20' : 'bg-gray-100 text-gray-600 dark:bg-gray-800'}`}>
                    {report.analysisStatus === 'completed' ? 'AI Analyzed' : 'Pending Analysis'}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={HiDocumentText} title="No reports found" description="Upload your first medical report to get AI-powered insights"
          action={<Link to="/reports/upload" className="btn-primary">Upload Report</Link>} />
      )}
    </div>
  );
}
