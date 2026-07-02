import { motion } from 'framer-motion';

export function LoadingSkeleton({ type = 'card', count = 3 }) {
  const skeletons = {
    card: (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-3/4 mb-4"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-border rounded w-full"></div>
      </div>
    ),
    stat: (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/2"></div>
      </div>
    ),
    table: (
      <div className="glass-card p-4 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded mb-3"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-border rounded mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-border rounded mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-dark-border rounded"></div>
      </div>
    ),
    chart: (
      <div className="glass-card p-6 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-dark-border rounded"></div>
      </div>
    )
  };

  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
          {skeletons[type]}
        </motion.div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {Icon && <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />}
      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">{title}</h3>
      <p className="text-sm text-muted mb-6 max-w-md">{description}</p>
      {action}
    </motion.div>
  );
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="heading-1">{title}</h1>
        {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
      </div>
      {action}
    </motion.div>
  );
}

export function StatCard({ icon: Icon, title, value, color = 'primary', change }) {
  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    medical: 'from-medical-500 to-medical-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600'
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="stat-card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && <p className={`text-xs mt-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>{change > 0 ? '+' : ''}{change}% from last month</p>}
        </div>
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
