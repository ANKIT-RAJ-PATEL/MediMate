import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiUpload, HiDocumentText, HiX } from 'react-icons/hi';
import API from '../../config/api';
import toast from 'react-hot-toast';
import { PageHeader } from '../../components/common/UIComponents';

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(f);
      } else {
        setPreview(null);
      }
    }
  };

  const onSubmit = async (data) => {
    if (!file) return toast.error('Please select a file');
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', data.title);
      formData.append('reportType', data.reportType);

      const { data: result } = await API.post('/reports/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Report uploaded successfully!');
      navigate(`/reports/${result.report._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <PageHeader title="Upload Report" subtitle="Upload your medical report for AI analysis" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Report Title</label>
            <input {...register('title', { required: true })} placeholder="e.g., Blood Test Report - January 2024" className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Report Type</label>
            <select {...register('reportType', { required: true })} className="input-field">
              <option value="">Select type</option>
              <option value="blood_test">Blood Test</option>
              <option value="cbc">CBC (Complete Blood Count)</option>
              <option value="lipid_profile">Lipid Profile</option>
              <option value="thyroid">Thyroid</option>
              <option value="liver_function">Liver Function Test</option>
              <option value="kidney_function">Kidney Function Test</option>
              <option value="diabetes">Diabetes Report</option>
              <option value="xray">X-Ray</option>
              <option value="mri">MRI</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload File</label>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
            <div onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-2xl p-8 text-center cursor-pointer hover:border-primary-500 transition-all">
              {preview ? (
                <div className="relative inline-block">
                  <img src={preview} alt="Preview" className="max-h-48 rounded-lg mx-auto" />
                  <button type="button" onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
              ) : file ? (
                <div className="flex items-center justify-center gap-3">
                  <HiDocumentText className="w-10 h-10 text-primary-500" />
                  <div className="text-left">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <>
                  <HiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium">Click to upload or drag and drop</p>
                  <p className="text-sm text-muted mt-1">PDF, JPG, PNG (max 10MB)</p>
                </>
              )}
            </div>
          </div>

          <button type="submit" disabled={uploading || !file} className="btn-primary w-full disabled:opacity-50">
            {uploading ? 'Uploading...' : 'Upload & Analyze'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
