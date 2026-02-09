
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Logo from '../components/Logo';

// Types for the interactive demos
interface Student {
  id: string;
  name: string;
  grade: string;
  totalFees: number;
  paid: number;
  remaining: number;
  status: 'paid' | 'partial' | 'overdue';
  phone: string;
  lastPayment?: string;
}

interface Transaction {
  id: string;
  type: 'IN' | 'OUT';
  description: string;
  amount: number;
  date: string;
  method: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  salary: number;
  paid: number;
  status: 'paid' | 'pending';
}

interface AgentCapability {
  id: string;
  icon: string;
  name: string;
  description: string;
}

const LandingPage: React.FC = () => {
  // Slide state
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 10;

  // Language
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    if (typeof window === 'undefined') return 'en';
    return (window.localStorage.getItem('seekers-lang') as 'en' | 'ar') || 'en';
  });
  const isArabic = language === 'ar';
  const t = (en: string, ar: string) => (isArabic ? ar : en);
  const currency = isArabic ? 'ج.م' : 'EGP';

  // Demo 1: Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Welcome to our International School Admissions AI. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Solution 3: Enhanced Finance CRM Demo State
  const [crmActiveTab, setCrmActiveTab] = useState<'dashboard' | 'students' | 'transactions' | 'teachers' | 'overdue' | 'forecast'>('dashboard');
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [animatedStats, setAnimatedStats] = useState({ collected: 0, pending: 0, students: 0 });

  // Mock CRM Data
  const students = useMemo<Student[]>(
    () =>
      isArabic
        ? [
            { id: '1', name: 'أحمد محمد علي', grade: 'الصف العاشر', totalFees: 45000, paid: 45000, remaining: 0, status: 'paid', phone: '01012345678', lastPayment: '2024-01-15' },
            { id: '2', name: 'سارة محمود حسن', grade: 'الصف الحادي عشر', totalFees: 48000, paid: 35500, remaining: 12500, status: 'overdue', phone: '01098765432' },
            { id: '3', name: 'ياسين ابراهيم خالد', grade: 'الصف التاسع', totalFees: 42000, paid: 42000, remaining: 0, status: 'paid', phone: '01123456789', lastPayment: '2024-01-20' },
            { id: '4', name: 'ليلى يوسف أحمد', grade: 'الصف العاشر', totalFees: 45000, paid: 40000, remaining: 5000, status: 'partial', phone: '01234567890' },
            { id: '5', name: 'محمد عبدالله سعيد', grade: 'الصف الثاني عشر', totalFees: 52000, paid: 26000, remaining: 26000, status: 'overdue', phone: '01087654321' },
            { id: '6', name: 'نور الهدى فاروق', grade: 'الصف التاسع', totalFees: 42000, paid: 42000, remaining: 0, status: 'paid', phone: '01198765432', lastPayment: '2024-02-01' },
          ]
        : [
            { id: '1', name: 'Ahmed Mohamed Ali', grade: 'Grade 10', totalFees: 45000, paid: 45000, remaining: 0, status: 'paid', phone: '01012345678', lastPayment: '2024-01-15' },
            { id: '2', name: 'Sara Mahmoud Hassan', grade: 'Grade 11', totalFees: 48000, paid: 35500, remaining: 12500, status: 'overdue', phone: '01098765432' },
            { id: '3', name: 'Yassin Ibrahim Khaled', grade: 'Grade 9', totalFees: 42000, paid: 42000, remaining: 0, status: 'paid', phone: '01123456789', lastPayment: '2024-01-20' },
            { id: '4', name: 'Laila Youssef Ahmed', grade: 'Grade 10', totalFees: 45000, paid: 40000, remaining: 5000, status: 'partial', phone: '01234567890' },
            { id: '5', name: 'Mohamed Abdallah Said', grade: 'Grade 12', totalFees: 52000, paid: 26000, remaining: 26000, status: 'overdue', phone: '01087654321' },
            { id: '6', name: 'Nour El Hoda Farouk', grade: 'Grade 9', totalFees: 42000, paid: 42000, remaining: 0, status: 'paid', phone: '01198765432', lastPayment: '2024-02-01' },
          ],
    [isArabic]
  );

  const transactions = useMemo<Transaction[]>(
    () =>
      isArabic
        ? [
            { id: '1', type: 'IN', description: 'قسط أحمد محمد علي', amount: 15000, date: '2024-01-15', method: 'نقدي' },
            { id: '2', type: 'OUT', description: 'رواتب شهر يناير', amount: 85000, date: '2024-01-28', method: 'تحويل بنكي' },
            { id: '3', type: 'IN', description: 'قسط سارة محمود حسن', amount: 12000, date: '2024-01-20', method: 'فيزا' },
            { id: '4', type: 'OUT', description: 'فواتير المرافق', amount: 12500, date: '2024-01-25', method: 'شيك' },
            { id: '5', type: 'IN', description: 'رسوم الباص', amount: 45000, date: '2024-02-01', method: 'نقدي' },
          ]
        : [
            { id: '1', type: 'IN', description: 'Ahmed Mohamed Ali tuition', amount: 15000, date: '2024-01-15', method: 'Cash' },
            { id: '2', type: 'OUT', description: 'January payroll', amount: 85000, date: '2024-01-28', method: 'Bank transfer' },
            { id: '3', type: 'IN', description: 'Sara Mahmoud Hassan tuition', amount: 12000, date: '2024-01-20', method: 'Visa' },
            { id: '4', type: 'OUT', description: 'Utilities invoices', amount: 12500, date: '2024-01-25', method: 'Cheque' },
            { id: '5', type: 'IN', description: 'Bus fees', amount: 45000, date: '2024-02-01', method: 'Cash' },
          ],
    [isArabic]
  );

  const teachers = useMemo<Teacher[]>(
    () =>
      isArabic
        ? [
            { id: '1', name: 'أ/ محمد سعيد إبراهيم', subject: 'لغة عربية', salary: 15000, paid: 15000, status: 'paid' },
            { id: '2', name: 'أ/ منى أحمد عبدالله', subject: 'رياضيات', salary: 18500, paid: 0, status: 'pending' },
            { id: '3', name: 'Mr. John Williams', subject: 'English', salary: 22000, paid: 22000, status: 'paid' },
            { id: '4', name: 'Dr. Sarah Johnson', subject: 'Science', salary: 25000, paid: 25000, status: 'paid' },
          ]
        : [
            { id: '1', name: 'Mohamed Saeed Ibrahim', subject: 'Arabic', salary: 15000, paid: 15000, status: 'paid' },
            { id: '2', name: 'Mona Ahmed Abdallah', subject: 'Mathematics', salary: 18500, paid: 0, status: 'pending' },
            { id: '3', name: 'John Williams', subject: 'English', salary: 22000, paid: 22000, status: 'paid' },
            { id: '4', name: 'Sarah Johnson', subject: 'Science', salary: 25000, paid: 25000, status: 'paid' },
          ],
    [isArabic]
  );

  const monthlyCollections = useMemo(() => {
    const labels = isArabic
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const values = [620, 540, 730, 680, 820, 760, 880, 710, 790, 920, 660, 840];
    return labels.map((label, index) => ({ label, value: values[index] }));
  }, [isArabic]);

  const maxMonthlyCollection = useMemo(
    () => Math.max(...monthlyCollections.map(item => item.value)),
    [monthlyCollections]
  );

  const forecastData = useMemo(() => {
    const labels = isArabic
      ? ['الربع القادم', 'النصف الثاني', 'نهاية العام']
      : ['Next Quarter', 'Second Half', 'Year End'];
    const values = [2.6, 5.4, 9.8];
    return labels.map((label, index) => ({ label, value: values[index] }));
  }, [isArabic]);

  // Agentic Application State
  const [dreamIdea, setDreamIdea] = useState('');
  const [isDreamSubmitted, setIsDreamSubmitted] = useState(false);
  const [selectedCapabilities] = useState<string[]>([]);
  const [isAgentBuilding, setIsAgentBuilding] = useState(false);
  const [agentBuildProgress, setAgentBuildProgress] = useState(0);

  // Chat auto-scroll ref
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const agentCapabilities: AgentCapability[] = isArabic
    ? [
        { id: 'data', icon: 'database', name: 'تحليل البيانات', description: 'معالجة وتحليل كميات كبيرة من البيانات تلقائياً' },
        { id: 'chat', icon: 'chat', name: 'شات ذكي', description: 'فهم اللغة الطبيعية والردود الذكية' },
        { id: 'automation', icon: 'bolt', name: 'أتمتة المهام', description: 'أتمتة العمليات المتكررة والمهام' },
        { id: 'notifications', icon: 'notifications', name: 'تنبيهات ذكية', description: 'نظام تنبيهات ذكي ومترابط' },
        { id: 'integration', icon: 'hub', name: 'تكامل API', description: 'ربط مع الخدمات الخارجية بسهولة' },
        { id: 'reports', icon: 'assessment', name: 'تقارير تلقائية', description: 'إنشاء تقارير شاملة تلقائياً' },
      ]
    : [
        { id: 'data', icon: 'database', name: 'Data Analysis', description: 'Process and analyze large datasets automatically' },
        { id: 'chat', icon: 'chat', name: 'Smart Chat', description: 'Natural language understanding and responses' },
        { id: 'automation', icon: 'bolt', name: 'Task Automation', description: 'Automate repetitive workflows and tasks' },
        { id: 'notifications', icon: 'notifications', name: 'Smart Alerts', description: 'Intelligent notification system' },
        { id: 'integration', icon: 'hub', name: 'API Integration', description: 'Connect with external services seamlessly' },
        { id: 'reports', icon: 'assessment', name: 'Auto Reports', description: 'Generate comprehensive reports automatically' },
      ];

  // Chat auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isBotTyping]);

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 50;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        collected: Math.floor(1240000 * progress),
        pending: Math.floor(845000 * progress),
        students: Math.floor(2450 * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('seekers-lang', language);
    document.documentElement.lang = language === 'ar' ? 'ar' : 'en';
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    setChatMessages([
      {
        role: 'bot',
        text: language === 'ar'
          ? 'أهلًا! معاك مساعد القبول للمدرسة. أقدر أساعدك في إيه؟'
          : 'Welcome to our International School Admissions AI. How can I assist you today?'
      }
    ]);
    setChatInput('');
    setIsBotTyping(false);
  }, [language]);

  // Slide navigation
  const nextSlide = () => { if (currentSlide < totalSlides - 1) setCurrentSlide(prev => prev + 1); };
  const prevSlide = () => { if (currentSlide > 0) setCurrentSlide(prev => prev - 1); };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isBotTyping) return;

    const userMsg = chatInput;
    const newMessages = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newMessages);
    setChatInput('');
    setIsBotTyping(true);

    try {
      const response = await fetch('https://n8n.srv1131703.hstgr.cloud/webhook/7dcdf598-a491-4c39-aafd-614cb91191f7/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: userMsg,
          sessionId: "presentation-demo-session",
          language: isArabic ? 'ar' : 'en'
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const botResponseText = typeof data === 'string' ? data : (data.output || data.text || data.response || t("I've received your request and notified the admissions team via WhatsApp.", 'تم استلام طلبك وتم إخطار فريق القبول عبر واتساب.'));

      setChatMessages(prev => [...prev, { role: 'bot', text: botResponseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: t('Your request has been recorded and we will contact you on WhatsApp shortly.', 'تم تسجيل طلبك وسيتم التواصل معك عبر الواتساب فوراً.') }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleDreamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamIdea.trim()) return;
    setIsAgentBuilding(true);

    let progress = 0;
    const buildInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(buildInterval);
      }
      setAgentBuildProgress(Math.min(progress, 100));
    }, 200);

    try {
      await fetch('https://n8n.srv1131703.hstgr.cloud/webhook/381845cd-f34b-4498-84d0-3118a6e8569d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: dreamIdea, sessionId: 'agentic-builder-session', timestamp: new Date().toISOString(), source: 'presentation-demo' }),
      });
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      clearInterval(buildInterval);
      setAgentBuildProgress(100);
      setTimeout(() => {
        setIsAgentBuilding(false);
        setIsDreamSubmitted(true);
      }, 500);
    }
  };



  const triggerWhatsAppCampaign = () => {
    setIsSimulatingAction(true);
    setTimeout(() => setIsSimulatingAction(false), 3000);
  };

  const handlePayment = () => {
    if (selectedStudent && paymentAmount) {
      setShowPaymentModal(false);
      setPaymentAmount('');
      setSelectedStudent(null);
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.includes(searchQuery) || s.grade.includes(searchQuery)
  );

  const overdueStudents = students.filter(s => s.status === 'overdue');
  const totalPending = students.reduce((sum, s) => sum + s.remaining, 0);

  const slideTitles = [
    t('Who We Are', 'من نحن'),
    t('What We Do', 'ماذا نفعل'),
    t('Education Sector', 'قطاع التعليم'),
    t('Social Media Audit', 'تدقيق السوشيال ميديا'),
    t('24/7 Lead Capture', 'التقاط العملاء'),
    t('Streamline Operations', 'تنظيم العمليات'),
    t('Finance CRM', 'إدارة المالية'),
    t('Agentic Future', 'مستقبل الأتمتة'),
    t('Any Questions?', 'أي أسئلة؟'),
    t('Thank You', 'شكراً')
  ];

  return (
    <div className="h-screen bg-background-dark text-slate-100 overflow-hidden flex flex-col font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] bg-primary/5 blur-[150px] rounded-full animate-glow-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-indigo-500/5 blur-[150px] rounded-full animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] bg-purple-500/3 blur-[120px] rounded-full animate-glow-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Animation Styles */}
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideLeft { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideRight { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInBlur { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 20px rgba(161,158,255,0.1); } 50% { box-shadow: 0 0 40px rgba(161,158,255,0.3); } }
        @keyframes rotateIn { from { opacity: 0; transform: rotate(-10deg) scale(0.9); } to { opacity: 1; transform: rotate(0deg) scale(1); } }
        @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { opacity: 1; transform: scale(1.05); } 70% { transform: scale(0.95); } 100% { transform: scale(1); } }
        @keyframes typewriter { from { width: 0; } to { width: 100%; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes slideInBounce { 0% { opacity: 0; transform: translateY(30px); } 60% { opacity: 1; transform: translateY(-5px); } 100% { transform: translateY(0); } }
        @keyframes ripple { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        @keyframes borderGlow { 0%, 100% { border-color: rgba(161,158,255,0.1); } 50% { border-color: rgba(161,158,255,0.4); } }
        .anim-slide-up { animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-slide-down { animation: slideDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-slide-left { animation: slideLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-slide-right { animation: slideRight 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-fade-blur { animation: fadeInBlur 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-float { animation: float 3s ease-in-out infinite; }
        .anim-pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
        .anim-rotate-in { animation: rotateIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-bounce-in { animation: bounceIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-slide-in-bounce { animation: slideInBounce 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-border-glow { animation: borderGlow 2s ease-in-out infinite; }
        .anim-gradient-bg { background-size: 200% 200%; animation: gradientShift 4s ease infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-900 { animation-delay: 0.9s; }
        .delay-1000 { animation-delay: 1.0s; }
        /* Mobile chat improvements */
        .chat-message-enter { animation: slideInBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        /* Smooth scroll for chat */
        .chat-scroll-smooth { scroll-behavior: smooth; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; }
        /* Mobile touch improvements */
        @media (max-width: 768px) {
          .mobile-card { padding: 1rem !important; }
          .mobile-text-sm { font-size: 0.8rem !important; }
          .mobile-gap-2 { gap: 0.5rem !important; }
        }
        /* Enhanced hover states */
        .hover-scale { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .hover-scale:hover { transform: scale(1.03); }
        .hover-glow:hover { box-shadow: 0 0 30px rgba(161,158,255,0.2); }
      `}</style>

      {/* Minimal Presentation Header */}
      <div className="relative z-50 flex items-center justify-between px-8 md:px-16 py-4 bg-surface-dark/40 backdrop-blur-3xl border-b border-white/5">
        <Logo size={40} showText={false} className="!items-start" />
        <div className="flex items-center gap-6">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] hidden md:block">
            {t('Strategy Session 2025', 'جلسة استراتيجية 2025')}
          </p>
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <h2 className="text-sm md:text-base font-black uppercase tracking-widest">{slideTitles[currentSlide]}</h2>
          <button
            onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
            className="px-3 py-1.5 rounded-full border border-primary/30 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/10 transition-all"
          >
            {isArabic ? 'EN' : 'ع'}
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 md:px-16 lg:px-24 py-6 md:py-12">

        {/* ==================== SLIDE 0: WHO WE ARE ==================== */}
        {currentSlide === 0 && (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-4 md:space-y-6">
            <div className="anim-scale-in">
              <Logo size={window.innerWidth < 80 ? 50 : 100} showText={false} />
            </div>
            <div className="space-y-3 anim-slide-up delay-200">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{t('// SEEKERS AI', '// سيكرز للذكاء الاصطناعي')}</p>
              <h1 className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                {t('AI That Drives', 'ذكاء اصطناعي يقود')} <br />
                <span className="gradient-text-animated italic">{t('Real Business Results', 'نتائج أعمال حقيقية')}</span>
              </h1>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 anim-slide-up delay-300">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">{t('Abdelrahman Dessouky', 'عبدالرحمن الدسوقي')}</h3>
                <p className="text-primary text-xs sm:text-sm font-black uppercase tracking-widest">{t('AI Engineering Lead / Co-Founder', 'قائد هندسة الذكاء الاصطناعي / شريك مؤسس')}</p>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 max-w-3xl anim-fade-blur delay-400">
              <p className="text-slate-400 text-sm sm:text-base md:text-lg font-medium px-2">
                {t('We\'ve worked across 6 different industries this year, delivering production-ready AI systems that drive revenue, reduce cost, and save time.', 'عملنا في 6 قطاعات مختلفة هذا العام، نقدم أنظمة ذكاء اصطناعي جاهزة للإنتاج تزيد الإيرادات وتقلل التكاليف وتوفر الوقت.')}
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
                {[t('Education', 'التعليم'), t('Healthcare', 'الرعاية الصحية'), t('Real Estate', 'العقارات'), t('Retail', 'التجزئة'), t('Hospitality', 'الضيافة'), t('Finance', 'المالية')].map((industry, i) => (
                  <span key={i} className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default" style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 anim-slide-up delay-600">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{t('Currently Partnering With', 'نعمل حالياً مع')}</p>
              <div className="flex items-center justify-center gap-4 sm:gap-8">
                <div className="h-16 sm:h-20 md:h-24 px-4 sm:px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:border-primary/30 transition-all anim-pulse-glow">
                  <img src="https://raw.githubusercontent.com/Dessouky13/School-demo/main/rajac-language-schools.png" alt="Rajac International School" className="h-10 sm:h-14 md:h-18 object-contain" />
                </div>
                <div className="h-16 sm:h-20 md:h-24 px-4 sm:px-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:border-primary/30 transition-all anim-pulse-glow">
                  <img src="https://raw.githubusercontent.com/Dessouky13/School-demo/main/Genesis-Logo-BlueBG-.png" alt="Genesis International School" className="h-10 sm:h-14 md:h-18 object-contain" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SLIDE 1: WHAT WE DO ==================== */}
        {currentSlide === 1 && (
          <div className="h-full flex flex-col justify-center max-w-6xl mx-auto space-y-8 md:space-y-12">
            <div className="text-center space-y-4 anim-slide-down">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{t('// OUR MISSION', '// مهمتنا')}</p>
              <h2 className="text-3xl sm:text-4xl md:text-7xl font-extrabold tracking-tight leading-tight">
                {t('Transform Businesses with', 'نحوّل الأعمال بـ')} <br />
                <span className="gradient-text-animated italic">{t('Smart AI Integration', 'تكامل ذكاء اصطناعي ذكي')}</span>
              </h2>
              <p className="text-slate-400 text-sm sm:text-lg md:text-xl font-medium max-w-3xl mx-auto px-2">
                {t('We focus on your pain points and build AI solutions that directly impact your bottom line.', 'نركز على نقاط الألم عندك ونبني حلول ذكاء اصطناعي تأثر مباشرة على أرباحك.')}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[
                { icon: 'share', title: t('Smart Social Media AI', 'ذكاء اصطناعي للسوشيال ميديا'), desc: t('AI agents that manage your social media inboxes, reply to comments, and capture every lead 24/7.', 'وكلاء ذكاء اصطناعي يديروا صفحاتك ويردوا على التعليقات ويمسكوا كل عميل 24/7.') },
                { icon: 'bolt', title: t('Smart Automation', 'أتمتة ذكية'), desc: t('Automate repetitive tasks, data entry, and workflows to free your team for what matters.', 'أتمتة المهام المتكررة وإدخال البيانات وسير العمل لتحرير فريقك.') },
                { icon: 'notifications_active', title: t('Instant Notifications', 'إشعارات فورية'), desc: t('Real-time alerts via WhatsApp, email, and SMS so you never miss a critical event.', 'تنبيهات فورية عبر واتساب وإيميل ورسائل قصيرة عشان ما يفوتك حاجة.') },
                { icon: 'smart_toy', title: t('Custom Agentic Apps', 'تطبيقات وكيل مخصصة'), desc: t('Fully customized AI applications built on your specific preferences and business ideas.', 'تطبيقات ذكاء اصطناعي مخصصة بالكامل على حسب أفكارك واحتياجاتك.') },
              ].map((item, idx) => (
                <div key={idx} className="presentation-card p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] space-y-3 sm:space-y-4 hover-lift group anim-slide-up" style={{ animationDelay: `${0.15 + idx * 0.12}s` }}>
                  <div className="size-12 sm:size-16 bg-primary/10 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-background-dark transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="text-sm sm:text-xl font-black tracking-tight">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SLIDE 2: EDUCATION SECTOR PAIN POINTS ==================== */}
        {currentSlide === 2 && (
          <div className="h-full flex flex-col justify-center max-w-6xl mx-auto space-y-8 md:space-y-10">
            <div className="text-center space-y-4 anim-slide-down">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">{t('// EDUCATION SECTOR RESEARCH', '// بحث قطاع التعليم')}</p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {t('Pain Points We Discovered', 'نقاط الألم اللي اكتشفناها')}
              </h2>
              <p className="text-slate-400 text-sm sm:text-lg font-medium max-w-3xl mx-auto px-2">
                {t('When we reached out to stakeholders in the education sector, we found critical gaps costing schools thousands in lost revenue.', 'لما تواصلنا مع أصحاب القرار في قطاع التعليم، لقينا فجوات حرجة بتكلف المدارس آلاف في إيرادات ضائعة.')}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="presentation-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-3 border-red-500/20 anim-slide-up delay-100 hover-lift">
                <div className="size-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-2xl sm:text-3xl">person_off</span>
                </div>
                <h4 className="text-base sm:text-lg font-black">{t('Lost Leads from Social Media', 'عملاء ضائعين من السوشيال ميديا')}</h4>
                <p className="text-xs sm:text-sm text-slate-400">{t('Schools have staff checking inboxes only 9-to-5, missing the majority of parent inquiries that come after hours and on weekends.', 'المدارس عندها ناس بتشيك على الرسائل من 9 لـ 5 بس، وبتضيع أغلب استفسارات أولياء الأمور اللي بتيجي بعد المواعيد وفي الويك إند.')}</p>
              </div>
              <div className="presentation-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-3 border-red-500/20 anim-slide-up delay-200 hover-lift">
                <div className="size-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-2xl sm:text-3xl">trending_down</span>
                </div>
                <h4 className="text-base sm:text-lg font-black">{t('Low Engagement', 'تفاعل ضعيف')}</h4>
                <p className="text-xs sm:text-sm text-slate-400">{t('Comments sections are left unanswered. Engaging with comments boosts the school\'s profile in the algorithm, bringing more organic visibility.', 'التعليقات بتتساب من غير رد. الرد على التعليقات بيزود ظهور المدرسة في الخوارزمية وبيجيب زيارات أورجانيك أكتر.')}</p>
              </div>
              <div className="presentation-card p-5 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-3 border-red-500/20 anim-slide-up delay-300 hover-lift">
                <div className="size-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-2xl sm:text-3xl">timer_off</span>
                </div>
                <h4 className="text-base sm:text-lg font-black">{t('Slow Response = Lost Students', 'رد بطيء = طلاب ضائعين')}</h4>
                <p className="text-xs sm:text-sm text-slate-400">{t('Every hour of delayed response reduces conversion chance by 30%. Parents move on to the next school.', 'كل ساعة تأخير في الرد بتقلل فرصة التحويل 30%. أولياء الأمور بيروحوا للمدرسة اللي بعدها.')}</p>
              </div>
            </div>

            {/* Teaser for next slide */}
            <div className="text-center anim-fade-blur delay-500">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-full">
                <span className="material-symbols-outlined text-red-400 text-xl">warning</span>
                <p className="text-sm sm:text-base font-black text-red-400 uppercase tracking-widest">{t('We tested your school\'s social media response time →', 'اختبرنا سرعة رد مدرستك على السوشيال ميديا ←')}</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SLIDE 3: SOCIAL MEDIA AUDIT (SCREENSHOTS) ==================== */}
        {currentSlide === 3 && (
          <div className="h-full flex flex-col justify-center max-w-6xl mx-auto space-y-6 md:space-y-8">
            <div className="text-center space-y-3 anim-slide-down">
              <p className="text-red-400 text-[10px] font-black uppercase tracking-[0.5em]">{t('// SOCIAL MEDIA AUDIT', '// تدقيق السوشيال ميديا')}</p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                {t('We tested your school\'s', 'اختبرنا سرعة رد')} <br />
                <span className="text-red-400">{t('social media response time', 'مدرستك على السوشيال ميديا')}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-8">
              {/* Instagram DM Screenshot */}
              <div className="presentation-card p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-4 border-pink-500/20 anim-slide-right delay-100 hover-lift">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-black text-pink-500">Instagram DM</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest anim-pulse-glow">{t('No Response 24h+', 'بدون رد +24 ساعة')}</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 anim-scale-in delay-300">
                  <img src="https://raw.githubusercontent.com/Dessouky13/School-demo/main/Instagram%20DM.jpeg" alt="Instagram DM - No response after 24 hours to student transfer inquiry" className="w-full h-auto max-h-[55vh] object-contain" />
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">{t('A parent asked about student transfer — no response after 24 hours.', 'ولي أمر سأل عن تحويل طالب — مفيش رد بعد 24 ساعة.')}</p>
              </div>

              {/* Facebook Comments Screenshot */}
              <div className="presentation-card p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] space-y-4 border-blue-500/20 anim-slide-left delay-200 hover-lift">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-xl">facebook</span>
                    </div>
                    <div>
                      <p className="text-base sm:text-lg font-black text-blue-500">Facebook Comments</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest anim-pulse-glow">{t('No Replies for Weeks', 'بدون رد لأسابيع')}</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30 anim-scale-in delay-400">
                  <img src="https://raw.githubusercontent.com/Dessouky13/School-demo/main/Facebook%20comments.jpeg" alt="Facebook comments with no replies for weeks on marketing posts" className="w-full h-auto max-h-[55vh] object-contain" />
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">{t('Marketing post comments left completely unanswered for weeks.', 'تعليقات على بوست تسويقي متسابة من غير أي رد لأسابيع.')}</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SLIDE 4: SOLUTION 01 - LEAD CAPTURE ==================== */}
        {currentSlide === 4 && (
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="space-y-5">
                <div>
                  <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-3">{t('SOLUTION 01', 'الحل 01')}</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{t('24/7 Lead Capture', 'التقاط العملاء على مدار الساعة')} <br />{t('& Conversion', 'والتحويل')}</h2>
                </div>
                <div className="presentation-card p-5 rounded-[1.5rem] space-y-2">
                  <p className="text-red-400 font-black text-base uppercase tracking-widest">{t('The Problem:', 'المشكلة:')}</p>
                  <p className="text-slate-400 text-base">{t('Schools lose 60% of prospective parents who message after hours or during peak enrollment periods.', 'المدارس بتخسر 60% من أولياء الأمور اللي بيتواصلوا بعد المواعيد أو وقت الزحمة.')}</p>
                </div>
                <ul className="space-y-3">
                  {[
                    t('Implemented at Global International Institutions', 'مطبق في مؤسسات تعليمية دولية'),
                    t('Average 3x increase in lead capture rate', 'زيادة 3 أضعاف في معدل التقاط العملاء'),
                    t('24/7 Multilingual support (Arabic/English)', 'دعم متعدد اللغات 24/7 (عربي/إنجليزي)'),
                    t('WhatsApp instant notification for admission team with instant lead gathering', 'تنبيهات واتساب فورية لفريق القبول مع جمع العملاء فوراً'),
                    t('Automated comments replies to boost engagement & algorithm ranking', 'ردود تلقائية على التعليقات لزيادة التفاعل وترتيب الخوارزمية'),
                    t('Multi AI agents for each school organization (National, IGCSE, American, HR)', 'عدة وكلاء ذكاء اصطناعي لكل قسم (وطني، IGCSE، أمريكي، HR)'),
                    t('Monthly & weekly analytics reports with lead & conversation tracking', 'تقارير تحليلية شهرية وأسبوعية لتتبع العملاء والمحادثات'),
                    t('Instant knowledge base updates', 'تحديثات فورية لقاعدة المعرفة')
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 font-bold">
                      <span className="material-symbols-outlined text-primary shrink-0 text-xl">check_circle</span>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="presentation-card rounded-[2rem] p-3 bg-slate-900/50 border-white/5 shadow-2xl">
                <div className="bg-background-dark/80 rounded-[1.5rem] overflow-hidden flex flex-col h-[500px]">
                  <div className="p-4 bg-surface-dark border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">school</span>
                      </div>
                      <div>
                        <p className="text-sm font-black dark:text-white uppercase tracking-widest">{t('Admissions AI Bot', 'بوت القبول الذكي')}</p>
                        <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                          <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {t('Online', 'متصل')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div ref={chatContainerRef} className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar chat-scroll-smooth">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex chat-message-enter ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm sm:text-base ${msg.role === 'user' ? 'bg-primary text-background-dark font-bold rounded-tr-none' : 'bg-surface-dark text-slate-300 rounded-tl-none border border-white/5'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isBotTyping && (
                      <div className="flex justify-start">
                        <div className="bg-surface-dark text-slate-300 p-3 rounded-2xl rounded-tl-none border border-white/5">
                          <div className="typing-indicator"><span></span><span></span><span></span></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <form onSubmit={handleChatSubmit} className="p-3 bg-surface-dark border-t border-white/5 flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={t('Ask about tuition or curriculum...', 'اسأل عن المصروفات أو المنهج...')}
                      className="flex-1 bg-background-dark border-none rounded-xl text-sm py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                      disabled={isBotTyping}
                    />
                    <button type="submit" disabled={isBotTyping} className="size-10 bg-primary text-background-dark rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50">
                      <span className="material-symbols-outlined font-black">send</span>
                    </button>
                  </form>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 px-3 pb-3">
                  {[
                    { value: '0.8s', label: t('Avg Response', 'متوسط الرد') },
                    { value: '450+', label: t('Leads/Month', 'عملاء/شهر') },
                    { value: '98%', label: t('Satisfaction', 'رضا') }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <p className="text-2xl font-black text-primary">{stat.value}</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code Section */}
              <div className="presentation-card p-4 sm:p-6 rounded-2xl anim-slide-up delay-400 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://www.demo.seekersai.org&bgcolor=0f172a&color=a19eff&format=png`}
                    alt="QR Code - Try the demo"
                    className="size-28 sm:size-36 rounded-xl border-2 border-primary/30 p-1 bg-white"
                  />
                </div>
                <div className="text-center sm:text-start space-y-2">
                  <h4 className="text-base sm:text-lg font-black flex items-center gap-2 justify-center sm:justify-start">
                    <span className="material-symbols-outlined text-primary">qr_code_2</span>
                    {t('Try It Yourself!', 'جرّبها بنفسك!')}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">
                    {t('Scan the QR code to chat with our AI admissions bot live on your phone.', 'امسح الكود عشان تتكلم مع بوت القبول الذكي من موبايلك.')}
                  </p>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">www.demo.seekersai.org</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SLIDE 5: SOLUTION 02 - OPERATIONS ==================== */}
        {currentSlide === 5 && (
          <div className="h-full flex flex-col justify-center max-w-6xl mx-auto space-y-6 md:space-y-10">
            <div className="text-center space-y-4 anim-slide-down">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{t('SOLUTION 02', 'الحل 02')}</p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">{t('Streamline Operations', 'نظّم العمليات')}</h2>
              <p className="text-slate-400 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto font-medium px-2">{t('Reduce administrative overhead and eliminate manual data entry across your entire school ecosystem.', 'قلّل العبء الإداري وامنع الإدخال اليدوي للبيانات في كل أقسام المدرسة.')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { title: t('Admissions Workflows', 'سير عمل القبول'), icon: 'assignment_ind', desc: t('Automated application processing, document OCR, and smart interview scheduling.', 'أتمتة معالجة الطلبات، قراءة المستندات، وجدولة المقابلات.') },
                { title: t('Student Records Sync', 'مزامنة سجلات الطلاب'), icon: 'sync_alt', desc: t('Unified data synchronization with Odoo ERP, PowerSchool, Veracross, and Blackbaud.', 'مزامنة موحدة للبيانات مع أنظمة المدرسة.') },
                { title: t('Parent Communication', 'تواصل أولياء الأمور'), icon: 'notifications_active', desc: t('Multi-channel bulk messaging for announcements, emergency alerts, and individual updates.', 'رسائل جماعية متعددة القنوات للإعلانات والتنبيهات والتحديثات.') },
                { title: t('HR & Payroll Automation', 'أتمتة الموارد البشرية والمرتبات'), icon: 'badge', desc: t('Teacher contract management, attendance tracking, and leave requests with approval chains.', 'إدارة العقود والحضور والإجازات بموافقات تلقائية.') },
                { title: t('Inventory & Procurement', 'المخزون والمشتريات'), icon: 'inventory_2', desc: t('Automated textbook reordering, lab supply tracking, and maintenance request routing.', 'إعادة طلب الكتب وتتبع المعامل وتحويل طلبات الصيانة تلقائياً.') },
                { title: t('Advanced SIS Integration', 'تكامل أنظمة SIS'), icon: 'hub', desc: t('Native API connectors for global school information systems to ensure data integrity.', 'روابط API مباشرة لضمان تكامل البيانات.') }
              ].map((item, idx) => (
                <div key={idx} className="presentation-card p-5 sm:p-8 rounded-xl sm:rounded-[2rem] hover-lift cursor-pointer group anim-slide-in-bounce" style={{ animationDelay: `${0.1 + idx * 0.1}s` }}>
                  <div className="size-12 sm:size-14 bg-primary/10 text-primary rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all group-hover:scale-110">
                    <span className="material-symbols-outlined text-2xl sm:text-3xl font-black">{item.icon}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black mb-2 sm:mb-3 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== SLIDE 6: SOLUTION 03 - FINANCE CRM ==================== */}
        {currentSlide === 6 && (
          <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-700">
            <div className="text-center space-y-2 anim-slide-down">
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">{t('SOLUTION 03', 'الحل 03')}</p>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{t('Seekers Finance CRM', 'سيكرز لإدارة المالية')}</h2>
              <p className="text-slate-400 text-sm sm:text-base font-medium max-w-3xl mx-auto px-2">{t('Complete financial management system with automated payment tracking, intelligent reminders, and real-time analytics.', 'نظام مالي متكامل لتتبع المدفوعات تلقائياً، وتنبيهات ذكية، وتحليلات لحظية.')}</p>
              <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap pt-2">
                {[
                  { title: t('Live Data Sync', 'مزامنة حية'), icon: 'sync' },
                  { title: t('Smart Reminders', 'تنبيهات ذكية'), icon: 'notifications' },
                  { title: t('Analytics', 'تحليلات'), icon: 'analytics' },
                  { title: t('Multi-user', 'متعدد المستخدمين'), icon: 'group' }
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-primary text-sm">{f.icon}</span>
                    {f.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Full-width Interactive CRM Demo UI */}
            <div className="presentation-card rounded-[2rem] overflow-hidden bg-slate-900/60 border-white/5 shadow-2xl anim-scale-in delay-200">
                <div className="p-3 bg-surface-dark/80 border-b border-white/5 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 bg-gradient-to-br from-primary to-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg">S</div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider">{t('Seekers Finance', 'سيكرز للمالية')}</h3>
                      <p className="text-[9px] text-slate-500">{t('Live Demo - Interactive', 'عرض حي - تفاعلي')}</p>
                    </div>
                  </div>

                  <div className="flex bg-background-dark/80 p-1 rounded-xl border border-white/10 overflow-x-auto">
                    {[
                      { id: 'dashboard', label: t('Dashboard', 'لوحة التحكم'), icon: 'dashboard' },
                      { id: 'students', label: t('Students', 'الطلاب'), icon: 'school' },
                      { id: 'transactions', label: t('Transactions', 'المعاملات'), icon: 'receipt_long' },
                      { id: 'teachers', label: t('Teachers', 'المدرسين'), icon: 'person' },
                      { id: 'overdue', label: t('Overdue', 'المتأخرات'), icon: 'warning' },
                      { id: 'forecast', label: t('Forecast', 'التوقعات'), icon: 'insights' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setCrmActiveTab(tab.id as any)}
                        className={`px-3 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${crmActiveTab === tab.id ? 'bg-primary text-background-dark' : 'text-slate-500 hover:text-white'}`}
                      >
                        <span className="material-symbols-outlined text-xs">{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5 min-h-[420px] max-h-[65vh] overflow-y-auto no-scrollbar">

                  {/* Dashboard Tab */}
                  {crmActiveTab === 'dashboard' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                          { label: t('Total Students', 'إجمالي الطلاب'), value: animatedStats.students.toLocaleString(), icon: 'groups', color: 'primary' },
                          { label: t('Collected', 'المحصل'), value: `${(animatedStats.collected / 1000).toFixed(0)}K ${currency}`, icon: 'payments', color: 'emerald' },
                          { label: t('Pending', 'المتبقي'), value: `${(animatedStats.pending / 1000).toFixed(0)}K ${currency}`, icon: 'pending', color: 'amber' },
                          { label: t('Collection Rate', 'نسبة التحصيل'), value: '59.5%', icon: 'trending_up', color: 'blue' }
                        ].map((stat, idx) => (
                          <div key={idx} className="crm-stat-card">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`material-symbols-outlined text-${stat.color}-500 text-lg`}>{stat.icon}</span>
                            </div>
                            <p className="text-2xl font-black text-white">{stat.value}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-background-dark/50 rounded-2xl p-4 border border-white/5">
                          <h4 className="text-sm font-black mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-base">bar_chart</span>
                            {t('Monthly Collections', 'التحصيل الشهري')}
                          </h4>
                          <div className="h-32 flex items-end justify-between gap-1">
                            {monthlyCollections.map((item, i) => (
                              <div key={item.label} className="flex-1 flex flex-col items-center gap-0.5">
                                <span className="text-[7px] text-slate-500 font-bold">{item.value}K</span>
                                <div
                                  className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-sm chart-bar"
                                  style={{ height: `${Math.round((item.value / maxMonthlyCollection) * 100)}%`, animationDelay: `${i * 0.05}s` }}
                                />
                                <span className="text-[7px] text-slate-600">{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-background-dark/50 rounded-2xl p-4 border border-white/5">
                          <h4 className="text-sm font-black mb-3 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-base">pie_chart</span>
                            {t('Payment Distribution', 'توزيع الدفعات')}
                          </h4>
                          <div className="flex items-center justify-around">
                            <div className="relative size-28">
                              <svg className="w-full h-full -rotate-90">
                                <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                <circle cx="56" cy="56" r="48" fill="none" stroke="#10b981" strokeWidth="10" strokeDasharray="302" strokeDashoffset="120" />
                                <circle cx="56" cy="56" r="48" fill="none" stroke="#fbbf24" strokeWidth="10" strokeDasharray="302" strokeDashoffset="240" />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-black">59.5%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="size-3 rounded bg-emerald-500"></span>
                                <span>{t('Paid in Full', 'مدفوع بالكامل')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="size-3 rounded bg-amber-500"></span>
                                <span>{t('Partially Paid', 'مدفوع جزئياً')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="size-3 rounded bg-red-500"></span>
                                <span>{t('Overdue', 'متأخر')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Students Tab */}
                  {crmActiveTab === 'students' && (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('Search for a student...', 'ابحث عن طالب...')}
                            className="w-full bg-background-dark/80 border border-white/10 rounded-xl py-2 pr-8 pl-3 text-xs focus:ring-1 focus:ring-primary outline-none"
                            dir={isArabic ? 'rtl' : 'ltr'}
                          />
                        </div>
                      </div>

                      <div className="bg-background-dark/40 rounded-xl border border-white/5 overflow-hidden">
                        <div className="grid grid-cols-12 gap-2 p-3 bg-white/5 text-[9px] font-black uppercase tracking-wider text-slate-500" dir={isArabic ? 'rtl' : 'ltr'}>
                          <div className="col-span-4">{t('Student', 'الطالب')}</div>
                          <div className="col-span-2">{t('Fees', 'الرسوم')}</div>
                          <div className="col-span-2">{t('Paid', 'المدفوع')}</div>
                          <div className="col-span-2">{t('Remaining', 'المتبقي')}</div>
                          <div className="col-span-2">{t('Status', 'الحالة')}</div>
                        </div>
                        <div className="divide-y divide-white/5">
                          {filteredStudents.map((student) => (
                            <div
                              key={student.id}
                              className="grid grid-cols-12 gap-2 p-3 crm-table-row cursor-pointer"
                              dir={isArabic ? 'rtl' : 'ltr'}
                              onClick={() => { setSelectedStudent(student); setShowPaymentModal(true); }}
                            >
                              <div className="col-span-4 flex items-center gap-2">
                                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                  {student.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-xs font-bold">{student.name}</p>
                                  <p className="text-[9px] text-slate-500">{student.grade}</p>
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center text-xs font-semibold">{student.totalFees.toLocaleString()}</div>
                              <div className="col-span-2 flex items-center text-xs font-semibold text-emerald-400">{student.paid.toLocaleString()}</div>
                              <div className="col-span-2 flex items-center text-xs font-semibold text-amber-400">{student.remaining.toLocaleString()}</div>
                              <div className="col-span-2 flex items-center">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                  student.status === 'paid' ? 'status-paid' :
                                  student.status === 'partial' ? 'status-pending' : 'status-overdue'
                                }`}>
                                  {student.status === 'paid' ? t('Paid', 'مدفوع') : student.status === 'partial' ? t('Partial', 'جزئي') : t('Overdue', 'متأخر')}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transactions Tab */}
                  {crmActiveTab === 'transactions' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-base font-black">{t('Financial Transactions', 'المعاملات المالية')}</h4>
                        <button className="px-3 py-1.5 bg-primary text-background-dark rounded-lg text-xs font-bold flex items-center gap-1 hover:scale-105 transition-all">
                          <span className="material-symbols-outlined text-xs">add</span>
                          {t('New Transaction', 'معاملة جديدة')}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-3 bg-background-dark/40 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className={`size-10 rounded-lg flex items-center justify-center ${tx.type === 'IN' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                                <span className="material-symbols-outlined text-lg">{tx.type === 'IN' ? 'arrow_downward' : 'arrow_upward'}</span>
                              </div>
                              <div dir={isArabic ? 'rtl' : 'ltr'}>
                                <p className="text-xs font-bold">{tx.description}</p>
                                <p className="text-[9px] text-slate-500">{tx.date} • {tx.method}</p>
                              </div>
                            </div>
                            <p className={`text-sm font-black ${tx.type === 'IN' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {tx.type === 'IN' ? '+' : '-'}{tx.amount.toLocaleString()} {currency}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Teachers Tab */}
                  {crmActiveTab === 'teachers' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-base font-black">{t('Teachers & Payroll', 'إدارة المدرسين والرواتب')}</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {teachers.map((teacher) => (
                          <div key={teacher.id} className="p-4 bg-background-dark/40 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                  <span className="material-symbols-outlined text-lg">person</span>
                                </div>
                                <div dir={isArabic ? 'rtl' : 'ltr'}>
                                  <p className="text-sm font-bold">{teacher.name}</p>
                                  <p className="text-[10px] text-slate-500">{teacher.subject}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${teacher.status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                                {teacher.status === 'paid' ? t('Paid', 'تم الصرف') : t('Pending', 'قيد الإنتظار')}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-center" dir={isArabic ? 'rtl' : 'ltr'}>
                              <div>
                                <p className="text-[10px] text-slate-500">{t('Salary', 'الراتب')}</p>
                                <p className="text-sm font-black text-white">{teacher.salary.toLocaleString()} {currency}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-500">{t('Paid', 'المدفوع')}</p>
                                <p className="text-sm font-black text-emerald-400">{teacher.paid.toLocaleString()} {currency}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="progress-bar">
                                <div className="progress-bar-fill bg-gradient-to-r from-primary to-indigo-500" style={{ width: `${(teacher.paid / teacher.salary) * 100}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Overdue Tab */}
                  {crmActiveTab === 'overdue' && (
                    <div className="space-y-4">
                      <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-[1.5rem] text-center">
                        <div className="size-16 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-red-500/30">
                          <span className="material-symbols-outlined text-3xl">warning</span>
                        </div>
                        <h4 className="text-xl font-black text-white mb-1">{t('Total Overdue', 'إجمالي المتأخرات')}</h4>
                        <p className="text-4xl font-black text-red-500 mb-3">{totalPending.toLocaleString()} {currency}</p>
                        <p className="text-xs text-slate-400 mb-4">{t(`${overdueStudents.length} students overdue`, `${overdueStudents.length} طالب متأخر في السداد`)}</p>

                        <button
                          onClick={triggerWhatsAppCampaign}
                          disabled={isSimulatingAction}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                        >
                          {isSimulatingAction ? (
                            <>
                              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                              {t('Sending WhatsApp reminders...', 'جاري إرسال تنبيهات الواتساب...')}
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined text-sm">send</span>
                              {t('Launch Smart Collection Campaign', 'تفعيل حملة التحصيل الذكية')}
                            </>
                          )}
                        </button>
                      </div>

                      <div className="space-y-2">
                        {overdueStudents.map((student) => (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-xl" dir={isArabic ? 'rtl' : 'ltr'}>
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <span className="material-symbols-outlined text-lg">person</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold">{student.name}</p>
                                <p className="text-[10px] text-slate-500">{student.grade} • {student.phone}</p>
                              </div>
                            </div>
                            <div className={isArabic ? 'text-right' : 'text-left'}>
                              <p className="text-sm font-black text-red-400">{student.remaining.toLocaleString()} {currency}</p>
                              <button className="text-[9px] text-primary hover:underline">{t('Send reminder', 'إرسال تذكير')}</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Forecast Tab */}
                  {crmActiveTab === 'forecast' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h4 className="text-base font-black">{t('Future Predictions', 'توقعات المستقبل')}</h4>
                          <p className="text-xs text-slate-500">{t('AI-driven revenue outlook based on current trends.', 'توقعات الإيرادات بالذكاء الاصطناعي بناءً على الاتجاهات الحالية.')}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                          <span className="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          {t('Updated today', 'محدّث اليوم')}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3">
                        {forecastData.map((item) => (
                          <div key={item.label} className="presentation-card p-4 rounded-xl">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
                            <p className="text-2xl font-black text-primary mt-2">{item.value.toFixed(1)}M {currency}</p>
                            <p className="text-[9px] text-slate-500 mt-1">{t('Projected collections', 'الإيرادات المتوقعة')}</p>
                          </div>
                        ))}
                      </div>

                      <div className="bg-background-dark/50 rounded-xl p-4 border border-white/5">
                        <h5 className="text-xs font-black mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-sm">insights</span>
                          {t('Key Drivers', 'أهم العوامل')}
                        </h5>
                        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-400">
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>{t('Higher on-time payments due to WhatsApp automation.', 'زيادة الدفع في المواعيد بسبب أتمتة واتساب.')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>{t('Improved retention and fee collection efficiency.', 'تحسن الاستمرارية وكفاءة التحصيل.')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>{t('Seasonal peak during enrollment cycles.', 'ذروة موسمية خلال دورات التسجيل.')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                            <span>{t('Automated follow-ups reducing overdue balances.', 'متابعات تلقائية تقلل المتأخرات.')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-surface-dark/50 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xl font-black text-primary">96.4%</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t('Collection Rate', 'نسبة التحصيل')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-emerald-400">+12%</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t('vs last month', 'مقارنة بالشهر السابق')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-amber-400">2,450</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t('Active Students', 'طلاب نشطين')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-blue-400">6</p>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{t('Departments', 'الأقسام')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-black uppercase tracking-widest">{t('Live Demo', 'عرض حي')}</span>
                  </div>
                </div>
              </div>
          </div>
        )}

        {/* ==================== SLIDE 7: AGENTIC FUTURE ==================== */}
        {currentSlide === 7 && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="text-center space-y-3">
              <p className="text-primary text-xs font-black uppercase tracking-[0.3em]">{t('THE FUTURE OF AUTOMATION', 'مستقبل الأتمتة')}</p>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">{t('Build your own', 'ابنِ بنفسك')}<br /><span className="gradient-text-animated">{t('agentic AI application', 'تطبيق ذكاء اصطناعي وكِيل')}</span></h2>
              <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
                {t('Share your idea and we will shape it into a production-ready agentic application tailored to your workflows.', 'احكي فكرتك وإحنا هنحوّلها لتطبيق وكِيل جاهز للإطلاق حسب شغلك.')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Interactive Agent Builder */}
              <div className="presentation-card p-8 rounded-[2rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-indigo-500/5"></div>

                <div className="relative z-10 space-y-6">
                  {isAgentBuilding ? (
                    <div className="text-center py-8 space-y-6">
                      <div className="size-24 mx-auto relative">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-3xl text-primary">smart_toy</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black mb-2">{t('Building Your Application...', 'جاري بناء التطبيق...')}</h3>
                        <p className="text-slate-400 text-base">{t('AI is configuring your custom agentic app', 'الذكاء الاصطناعي بيجهز التطبيق الوكيل الخاص بك')}</p>
                      </div>
                      <div className="max-w-md mx-auto">
                        <div className="progress-bar h-3">
                          <div className="progress-bar-fill bg-gradient-to-r from-primary to-indigo-500" style={{ width: `${agentBuildProgress}%` }}></div>
                        </div>
                        <p className="text-base text-primary mt-2 font-bold">{Math.round(agentBuildProgress)}%</p>
                      </div>
                    </div>
                  ) : isDreamSubmitted ? (
                    <div className="text-center py-8 space-y-5">
                      <div className="size-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <span className="material-symbols-outlined text-5xl">rocket_launch</span>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black mb-2">{t('Idea Submitted!', 'تم إرسال الفكرة!')}</h3>
                        <p className="text-slate-400 text-base max-w-md mx-auto">
                          {t('We\'ve received your idea and our team will reach out to discuss next steps.', 'استلمنا فكرتك وفريقنا هيتواصل معاك لمناقشة الخطوات الجاية.')}
                        </p>
                      </div>
                      <button
                        onClick={() => {setIsDreamSubmitted(false); setDreamIdea(''); setAgentBuildProgress(0);}}
                        className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-black uppercase tracking-widest hover:border-primary transition-all"
                      >
                        {t('Submit Another Idea', 'أرسل فكرة أخرى')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight">{t('Agentic App Builder', 'منشئ التطبيقات الوكيلة')}</h3>
                        <p className="text-base text-slate-400 font-medium">{t('Describe your idea and we\'ll build it for you', 'احكي فكرتك وإحنا هنبنيها ليك')}</p>
                      </div>

                      <form onSubmit={handleDreamSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-500">{t('Describe Your Idea', 'وصف الفكرة')}</p>
                          <textarea
                            value={dreamIdea}
                            onChange={(e) => setDreamIdea(e.target.value)}
                            placeholder={t('Describe the app you want to build...', 'اكتب تفاصيل التطبيق...')}
                            className="w-full h-36 bg-background-dark/80 border border-white/10 rounded-xl p-4 text-base font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={!dreamIdea.trim()}
                          className="w-full py-5 bg-gradient-to-r from-primary to-indigo-500 text-background-dark rounded-xl text-base font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {t('Submit My Idea', 'أرسل فكرتي')}
                          <span className="material-symbols-outlined text-xl">auto_awesome</span>
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>

              {/* Features & Benefits */}
              <div className="space-y-6">
                <div className="space-y-5">
                  {[
                    { icon: 'lightbulb', title: t('Any Idea, Any Scale', 'أي فكرة وبأي حجم'), desc: t('From simple automation tasks to complex multi-agent systems, bring any concept to life.', 'من مهام بسيطة لأنظمة متعددة الوكلاء، خلي فكرتك حقيقة.') },
                    { icon: 'speed', title: t('Rapid Deployment', 'إطلاق سريع'), desc: t('Go from idea to production in hours, not months.', 'حوّل فكرتك للإنتاج في ساعات مش شهور.') },
                    { icon: 'psychology', title: t('Continuous Learning', 'تعلّم مستمر'), desc: t('Your agents evolve and improve over time, learning from every interaction.', 'الوكلاء بيتطوروا مع كل تفاعل.') },
                    { icon: 'security', title: t('Enterprise Security', 'أمان مؤسسي'), desc: t('Bank-grade encryption and compliance with international data protection standards.', 'تشفير قوي والالتزام بمعايير حماية البيانات.') }
                  ].map((feature, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <div className="size-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all shrink-0">
                        <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black mb-1">{feature.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="presentation-card p-6 rounded-xl">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">{t('Popular Use Cases', 'أمثلة شائعة')}</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      t('Student Analytics', 'تحليلات الطلاب'),
                      t('Automated Grading', 'تصحيح تلقائي'),
                      t('Parent Communication', 'تواصل أولياء الأمور'),
                      t('HR Assistant', 'مساعد الموارد البشرية'),
                      t('Inventory Management', 'إدارة المخزون'),
                      t('Report Generation', 'إنشاء التقارير'),
                      t('Attendance Tracking', 'متابعة الحضور'),
                      t('Fee Collection', 'تحصيل المصروفات')
                    ].map((use, idx) => (
                      <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                        {use}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SLIDE 8: ANY QUESTIONS ==================== */}
        {currentSlide === 8 && (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-8 sm:space-y-12">
            <div className="anim-bounce-in">
              <div className="size-20 sm:size-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 anim-pulse-glow">
                <span className="material-symbols-outlined text-4xl sm:text-5xl text-primary">help</span>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter leading-tight anim-slide-up delay-200">
              {t('Any Questions?', 'أي أسئلة؟')}
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary rounded-full anim-scale-in delay-400"></div>
            <p className="text-slate-400 text-base sm:text-xl font-medium max-w-2xl mx-auto px-4 anim-fade-blur delay-500">
              {t('We\'d love to discuss how AI can transform your operations. Let\'s talk!', 'نحب نناقش إزاي الذكاء الاصطناعي يحوّل عملياتك. يلا نتكلم!')}
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 anim-slide-up delay-600">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="text-sm font-bold">info@seekers-ai.com</span>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:border-primary/30 transition-all">
                <span className="material-symbols-outlined text-emerald-500">chat</span>
                <span className="text-sm font-bold">WhatsApp</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SLIDE 9: THANK YOU ==================== */}
        {currentSlide === 9 && (
          <div className="h-full flex flex-col justify-center items-center text-center space-y-8 sm:space-y-12">
            <div className="anim-bounce-in">
              <Logo size={window.innerWidth < 768 ? 60 : 100} showText={false} />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-extrabold tracking-tighter leading-tight gradient-text-animated anim-slide-up delay-200">
              {t('Thank You!', '!شكرًا لك')}
            </h2>
            <div className="w-16 sm:w-24 h-1 bg-primary rounded-full anim-scale-in delay-300"></div>
            <p className="text-slate-400 text-base sm:text-xl font-medium max-w-xl mx-auto px-4 anim-fade-blur delay-400">
              {t('Let\'s build something extraordinary together.', 'يلا نبني حاجة استثنائية مع بعض.')}
            </p>
          </div>
        )}
      </main>

      {/* Bottom Slide Navigation */}
      <div className="relative z-50 flex items-center justify-center gap-6 bg-surface-dark/80 backdrop-blur-3xl border-t border-white/5 px-8 py-3">
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background-dark disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <span className="material-symbols-outlined font-black">arrow_back</span>
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${i === currentSlide ? 'w-10 bg-primary shadow-[0_0_10px_rgba(161,158,255,0.6)]' : 'w-2 bg-white/10 hover:bg-white/20'}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="size-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background-dark disabled:opacity-30 disabled:pointer-events-none transition-all"
        >
          <span className="material-symbols-outlined font-black">arrow_forward</span>
        </button>
        <div className="absolute right-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
          {currentSlide + 1} / {totalSlides}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-surface-dark rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">{t('Record New Payment', 'تسجيل دفعة جديدة')}</h3>
              <button onClick={() => setShowPaymentModal(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className="p-4 bg-background-dark/50 rounded-2xl">
                <p className="text-sm text-slate-500">{t('Student', 'الطالب')}</p>
                <p className="text-lg font-bold">{selectedStudent.name}</p>
                <p className="text-xs text-slate-500">{selectedStudent.grade}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background-dark/50 rounded-2xl text-center">
                  <p className="text-xs text-slate-500">{t('Remaining', 'المتبقي')}</p>
                  <p className="text-xl font-black text-amber-400">{selectedStudent.remaining.toLocaleString()} {currency}</p>
                </div>
                <div className="p-4 bg-background-dark/50 rounded-2xl text-center">
                  <p className="text-xs text-slate-500">{t('Paid', 'المدفوع')}</p>
                  <p className="text-xl font-black text-emerald-400">{selectedStudent.paid.toLocaleString()} {currency}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">{t('Payment Amount', 'مبلغ الدفعة')}</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={t('Enter amount', 'أدخل المبلغ')}
                  className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-lg font-bold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={!paymentAmount}
                className="w-full py-4 bg-primary text-background-dark rounded-xl font-black uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-all"
              >
                {t('Confirm Payment', 'تأكيد الدفع')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
