import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCog, HiShieldCheck, HiDocumentText, HiChat, HiCalendar, HiChartBar, HiClock, HiHeart, HiLightningBolt } from 'react-icons/hi';

const features = [
  { icon: HiDocumentText, title: 'Medical Report Analysis', desc: 'Upload reports and get AI-powered explanations in simple language' },
  { icon: HiShieldCheck, title: 'Disease Prediction', desc: 'ML-powered risk assessment for diabetes, heart disease, and more' },
  { icon: HiChat, title: 'AI Health Assistant', desc: 'Chat with AI about your health using your medical data as context' },
  { icon: HiCalendar, title: 'Doctor Appointments', desc: 'Book, manage, and track appointments with verified doctors' },
  { icon: HiClock, title: 'Medicine Reminders', desc: 'Never miss a dose with smart reminders and tracking' },
  { icon: HiChartBar, title: 'Health Analytics', desc: 'Track trends in blood sugar, cholesterol, BMI, and more' },
];

const testimonials = [
  { name: 'Priya Sharma', role: 'Patient', text: 'MediMind helped me understand my blood reports easily. The AI explanations are incredibly accurate!' },
  { name: 'Dr. Rahul Verma', role: 'Cardiologist', text: 'A great tool for patients to stay informed. I recommend it to all my patients.' },
  { name: 'Amit Patel', role: 'Patient', text: 'The disease prediction feature caught a risk I never knew about.potentially life-saving!' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-600 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-medical-500 rounded-xl flex items-center justify-center">
            <HiCog className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <span className="text-xl font-bold gradient-text">MediMind AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Features</a>
          <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Testimonials</a>
          <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary-500">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-outline px-4 py-2 text-sm">Login</Link>
          <Link to="/register" className="btn-primary px-4 py-2 text-sm">Get Started</Link>
        </div>
      </nav>

      <section className="relative px-6 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-medical-50/50 dark:from-primary-900/10 dark:to-medical-900/10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-medical-300/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium mb-6">
              Powered by AI & Machine Learning
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Your <span className="gradient-text">Intelligent</span><br />Healthcare Companion
            </h1>
            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-10">
              Upload medical reports, get AI-powered explanations, predict disease risks, and manage your health journey with personalized insights.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Start Free Trial
            </Link>
            <a href="#features" className="btn-outline text-lg px-8 py-4">
              Learn More
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="mt-16 relative">
            <div className="glass-card p-4 md:p-8 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4"><p className="text-3xl font-bold gradient-text">50K+</p><p className="text-sm text-muted">Reports Analyzed</p></div>
                <div className="p-4"><p className="text-3xl font-bold gradient-text">98%</p><p className="text-sm text-muted">Accuracy Rate</p></div>
                <div className="p-4"><p className="text-3xl font-bold gradient-text">200+</p><p className="text-sm text-muted">Verified Doctors</p></div>
                <div className="p-4"><p className="text-3xl font-bold gradient-text">24/7</p><p className="text-sm text-muted">AI Support</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="px-6 py-20 bg-white dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Powerful Features</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">Everything you need to take control of your health, powered by cutting-edge AI technology</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass-card p-8 card-hover">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-medical-500 flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Loved by Users</h2>
            <p className="text-muted text-lg">See what people are saying about MediMind AI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="glass-card p-8">
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <HiHeart key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-medical-400 flex items-center justify-center text-white font-semibold">{t.name[0]}</div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-20 bg-white dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="heading-1 mb-4">Simple Pricing</h2>
            <p className="text-muted text-lg">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Free', price: '0', features: ['5 Report Uploads', 'Basic AI Analysis', '1 Disease Prediction', 'Medicine Reminders'] },
              { name: 'Pro', price: '299', features: ['Unlimited Reports', 'Advanced AI Analysis', 'All Predictions', 'Priority Support', 'Health Score', 'Diet Plans'], popular: true },
              { name: 'Premium', price: '599', features: ['Everything in Pro', 'Video Consultations', 'Family Accounts', 'API Access', 'Custom Reports', 'Dedicated Support'] }
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`glass-card p-8 ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}>
                {plan.popular && <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded-full mb-4">Most Popular</span>}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <HiLightningBolt className="w-4 h-4 text-primary-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={plan.popular ? 'btn-primary w-full text-center block' : 'btn-outline w-full text-center block'}>
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-1 mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-muted text-lg mb-8">Join thousands of users who trust MediMind AI for their healthcare needs</p>
          <Link to="/register" className="btn-primary text-lg px-10 py-4">Get Started Free</Link>
        </div>
      </section>

      <footer className="px-6 py-8 bg-white dark:bg-[#1e2935] border-t border-gray-100 dark:border-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-medical-500 rounded-lg flex items-center justify-center">
              <HiCog className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold gradient-text">MediMind AI</span>
          </div>
          <p className="text-sm text-muted">© 2024 MediMind AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
