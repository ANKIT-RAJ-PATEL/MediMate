import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiHome, HiDocumentText, HiChat, HiCalendar, HiClock, HiChartBar, HiCog, HiBell, HiSun, HiMoon, HiShieldCheck, HiUserGroup, HiChip, HiLogout } from 'react-icons/hi';
import { useTheme } from '../../contexts/ThemeContext';
import { logout } from '../../redux/slices/authSlice';

const patientLinks = [
  { to: '/dashboard', icon: HiHome, label: 'Dashboard' },
  { to: '/reports', icon: HiDocumentText, label: 'Reports' },
  { to: '/chat', icon: HiChat, label: 'AI Chat' },
  { to: '/appointments', icon: HiCalendar, label: 'Appointments' },
  { to: '/medicines', icon: HiClock, label: 'Medicines' },
  { to: '/predictions', icon: HiChip, label: 'Predictions' },
  { to: '/analytics', icon: HiChartBar, label: 'Analytics' },
  { to: '/health', icon: HiShieldCheck, label: 'Health Score' },
];

const doctorLinks = [
  ...patientLinks.filter(l => l.to !== '/predictions' && l.to !== '/health'),
  { to: '/doctor/patients', icon: HiUserGroup, label: 'Patients' },
];

const adminLinks = [
  { to: '/admin', icon: HiHome, label: 'Dashboard' },
  { to: '/admin/users', icon: HiUserGroup, label: 'Users' },
  { to: '/admin/doctors', icon: HiChip, label: 'Doctors' },
  { to: '/admin/analytics', icon: HiChartBar, label: 'Analytics' },
];

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { darkMode, toggleDarkMode } = useTheme();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? doctorLinks : patientLinks;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#1a1f2e]">
      <div className="p-5">
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
            <HiCog className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-emerald-500">MediMind</h1>
            <p className="text-[10px] text-gray-400">AI Healthcare</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              location.pathname === link.to
                ? 'bg-emerald-500/10 text-emerald-400 font-semibold'
                : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
            }`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-200 truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-gray-500 capitalize">{user?.role || 'patient'}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button onClick={toggleDarkMode} className="flex-1 p-2 hover:bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-200 transition-colors">
            {darkMode ? <HiSun className="w-4 h-4" /> : <HiMoon className="w-4 h-4" />}
          </button>
          <button onClick={handleLogout} className="flex-1 p-2 hover:bg-red-500/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors">
            <HiLogout className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#1a1f2e] border border-gray-700 rounded-xl shadow-lg text-gray-300">
        {mobileOpen ? '✕' : '☰'}
      </button>

      {mobileOpen && <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />}

      <aside className={`fixed lg:static top-0 left-0 h-screen w-[260px] z-50 border-r border-gray-700/50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {sidebarContent}
      </aside>
    </>
  );
}
