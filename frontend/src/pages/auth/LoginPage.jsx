import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { login } from '../../redux/slices/authSlice';
import GoogleLoginButton from '../../components/common/GoogleLoginButton';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector(state => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await dispatch(login(data));
    setSubmitting(false);
    if (login.fulfilled.match(result)) {
      toast.success('Login successful!');
      const role = result.payload.user.role;
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50/50 to-medical-50/50 dark:from-dark-bg dark:to-dark-card px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold gradient-text">MediMind AI</span>
          </Link>
          <h1 className="heading-1">Welcome Back</h1>
          <p className="text-muted mt-2">Sign in to your account</p>
        </div>

        <div className="glass-card p-8">
          {error && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  type="email" placeholder="you@example.com" className="input-field pl-10" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">Password</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                  type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <HiEyeOff className="w-5 h-5 text-gray-400" /> : <HiEye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <input type="checkbox" className="rounded border-gray-300" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-primary-500 hover:underline">Forgot Password?</Link>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-600"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white dark:bg-[#1e2935] text-gray-500 dark:text-gray-400">Or continue with</span></div>
            </div>

            <div className="mt-4">
              <GoogleLoginButton text="Sign in with Google" />
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <Link to="/register" className="text-primary-500 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
