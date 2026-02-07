
import React, { useState, useEffect } from 'react';
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
  // Demo 1: Chatbot State
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Welcome to our International School Admissions AI. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  // Solution 3: Enhanced Finance CRM Demo State
  const [crmActiveTab, setCrmActiveTab] = useState<'dashboard' | 'students' | 'transactions' | 'teachers' | 'overdue'>('dashboard');
  const [isSimulatingAction, setIsSimulatingAction] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [animatedStats, setAnimatedStats] = useState({ collected: 0, pending: 0, students: 0 });

  // Mock CRM Data
  const [students] = useState<Student[]>([
    { id: '1', name: 'أحمد محمد علي', grade: 'الصف العاشر', totalFees: 45000, paid: 45000, remaining: 0, status: 'paid', phone: '01012345678', lastPayment: '2024-01-15' },
    { id: '2', name: 'سارة محمود حسن', grade: 'الصف الحادي عشر', totalFees: 48000, paid: 35500, remaining: 12500, status: 'overdue', phone: '01098765432' },
    { id: '3', name: 'ياسين ابراهيم خالد', grade: 'الصف التاسع', totalFees: 42000, paid: 42000, remaining: 0, status: 'paid', phone: '01123456789', lastPayment: '2024-01-20' },
    { id: '4', name: 'ليلى يوسف أحمد', grade: 'الصف العاشر', totalFees: 45000, paid: 40000, remaining: 5000, status: 'partial', phone: '01234567890' },
    { id: '5', name: 'محمد عبدالله سعيد', grade: 'الصف الثاني عشر', totalFees: 52000, paid: 26000, remaining: 26000, status: 'overdue', phone: '01087654321' },
    { id: '6', name: 'نور الهدى فاروق', grade: 'الصف التاسع', totalFees: 42000, paid: 42000, remaining: 0, status: 'paid', phone: '01198765432', lastPayment: '2024-02-01' },
  ]);

  const [transactions] = useState<Transaction[]>([
    { id: '1', type: 'IN', description: 'قسط أحمد محمد علي', amount: 15000, date: '2024-01-15', method: 'نقدي' },
    { id: '2', type: 'OUT', description: 'رواتب شهر يناير', amount: 85000, date: '2024-01-28', method: 'تحويل بنكي' },
    { id: '3', type: 'IN', description: 'قسط سارة محمود حسن', amount: 12000, date: '2024-01-20', method: 'فيزا' },
    { id: '4', type: 'OUT', description: 'فواتير المرافق', amount: 12500, date: '2024-01-25', method: 'شيك' },
    { id: '5', type: 'IN', description: 'رسوم الباص', amount: 45000, date: '2024-02-01', method: 'نقدي' },
  ]);

  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'أ/ محمد سعيد إبراهيم', subject: 'لغة عربية', salary: 15000, paid: 15000, status: 'paid' },
    { id: '2', name: 'أ/ منى أحمد عبدالله', subject: 'رياضيات', salary: 18500, paid: 0, status: 'pending' },
    { id: '3', name: 'Mr. John Williams', subject: 'English', salary: 22000, paid: 22000, status: 'paid' },
    { id: '4', name: 'Dr. Sarah Johnson', subject: 'Science', salary: 25000, paid: 25000, status: 'paid' },
  ]);

  // Agentic Application State
  const [dreamIdea, setDreamIdea] = useState('');
  const [isDreamSubmitted, setIsDreamSubmitted] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [isAgentBuilding, setIsAgentBuilding] = useState(false);
  const [agentBuildProgress, setAgentBuildProgress] = useState(0);

  const agentCapabilities: AgentCapability[] = [
    { id: 'data', icon: 'database', name: 'Data Analysis', description: 'Process and analyze large datasets automatically' },
    { id: 'chat', icon: 'chat', name: 'Smart Chat', description: 'Natural language understanding and responses' },
    { id: 'automation', icon: 'bolt', name: 'Task Automation', description: 'Automate repetitive workflows and tasks' },
    { id: 'notifications', icon: 'notifications', name: 'Smart Alerts', description: 'Intelligent notification system' },
    { id: 'integration', icon: 'hub', name: 'API Integration', description: 'Connect with external services seamlessly' },
    { id: 'reports', icon: 'assessment', name: 'Auto Reports', description: 'Generate comprehensive reports automatically' },
  ];

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

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

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
          sessionId: "presentation-demo-session"
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();
      const botResponseText = typeof data === 'string' ? data : (data.output || data.text || data.response || "I've received your request and notified the admissions team via WhatsApp.");

      setChatMessages(prev => [...prev, { role: 'bot', text: botResponseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: 'bot', text: "لقد تم تسجيل طلبك وسيتم التواصل معك عبر الواتساب فوراً." }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  const handleDreamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamIdea.trim() && selectedCapabilities.length === 0) return;
    setIsAgentBuilding(true);

    // Simulate AI agent building process
    let progress = 0;
    const buildInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(buildInterval);
        setTimeout(() => {
          setIsAgentBuilding(false);
          setIsDreamSubmitted(true);
        }, 500);
      }
      setAgentBuildProgress(Math.min(progress, 100));
    }, 200);
  };

  const toggleCapability = (id: string) => {
    setSelectedCapabilities(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const triggerWhatsAppCampaign = () => {
    setIsSimulatingAction(true);
    setTimeout(() => setIsSimulatingAction(false), 3000);
  };

  const handlePayment = () => {
    if (selectedStudent && paymentAmount) {
      // Simulate payment processing
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

  // Floating particles component
  const FloatingParticles = () => (
    <div className="particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 10}s`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen text-slate-100">
      {/* Dynamic Background with Floating Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] bg-primary/5 blur-[120px] rounded-full animate-glow-pulse animate-morph"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] bg-indigo-500/5 blur-[120px] rounded-full animate-glow-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[50%] left-[50%] w-[30vw] h-[30vw] bg-violet-500/3 blur-[100px] rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <FloatingParticles />
      </div>

      {/* Floating Header */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50">
        <nav className="h-20 md:h-24 flex items-center justify-between px-6 md:px-12 bg-surface-dark/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-2xl animate-slide-up hover-glow">
          <Logo size={180} showText={false} className="!items-start" />
          <div className="hidden lg:flex items-center gap-10">
            {['Solutions', 'Process', 'Finance', 'Agentic-Future'].map((item, idx) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={scrollToSection(item.toLowerCase())}
                className={`text-[11px] font-black text-slate-400 hover:text-primary transition-all uppercase tracking-[0.4em] hover-scale stagger-${idx + 1}`}
              >
                {item.replace('-', ' ')}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em] px-4 py-2 border border-primary/20 rounded-full bg-primary/5 animate-glow">
               <span className="inline-block size-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
               Presentation Mode
             </span>
          </div>
        </nav>
      </div>

      {/* Hero Section with Enhanced Animations */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-48 md:pt-64 pb-24 text-center">
        <div className="animate-slide-up">
          <p className="text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.5em] mb-6 animate-shimmer">// SEEKERS AI FOR EDUCATION</p>
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.1] mb-8">
            Transform Your School's <br />
            <span className="gradient-text-animated italic">Revenue & Efficiency</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up stagger-2">
            AI-Powered Solutions for International Schools | Proven Results with Leading Global Institutions
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up stagger-3">
            <button onClick={scrollToSection('solutions')} className="w-full sm:w-auto px-10 py-5 bg-primary text-background-dark rounded-2xl text-sm font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all uppercase tracking-widest hover-glow neon-border">
              See Live Demos
            </button>
          </div>
        </div>

        {/* Animated Stats Preview */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { label: 'Schools Served', value: '15+', icon: 'school' },
            { label: 'Students Managed', value: '50K+', icon: 'groups' },
            { label: 'Revenue Increased', value: '35%', icon: 'trending_up' }
          ].map((stat, idx) => (
            <div key={idx} className={`text-center animate-bounce-in stagger-${idx + 1}`}>
              <div className="size-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-primary">{stat.icon}</span>
              </div>
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution 1: AI Lead Generation */}
      <section id="solutions" className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-slide-up">
            <div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">SOLUTION 01</p>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">24/7 Lead Capture <br />& Conversion</h2>
            </div>
            <div className="presentation-card p-8 rounded-[2rem] space-y-4 hover-lift">
              <p className="text-red-400 font-black text-sm uppercase tracking-widest">The Problem:</p>
              <p className="text-slate-400 text-lg">Schools lose 60% of prospective parents who message after hours or during peak enrollment periods.</p>
            </div>
            <ul className="space-y-4">
              {[
                'Implemented at Global International Institutions',
                'Average 3x increase in lead capture rate',
                '24/7 Multilingual support (Arabic/English)',
                'WhatsApp instant notification for admission team with instant lead gathering',
                'Multi AI agents for each school organization (National, IGCSE, American, HR)',
                'Monthly analytics reports',
                'Instant knowledge base modification'
              ].map((item, idx) => (
                <li key={item} className={`flex items-start gap-3 text-slate-300 font-bold animate-slide-up stagger-${Math.min(idx + 1, 5)}`}>
                  <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                  <span className="text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="presentation-card rounded-[3rem] p-4 bg-slate-900/50 border-white/5 shadow-2xl hover-lift">
            {/* Chatbot Demo UI */}
            <div className="bg-background-dark/80 rounded-[2rem] overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 bg-surface-dark border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-glow">
                    <span className="material-symbols-outlined">school</span>
                  </div>
                  <div>
                    <p className="text-xs font-black dark:text-white uppercase tracking-widest">Admissions AI Bot</p>
                    <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                      <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Online
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-background-dark font-bold rounded-tr-none' : 'bg-surface-dark text-slate-300 rounded-tl-none border border-white/5'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isBotTyping && (
                  <div className="flex justify-start animate-slide-up">
                    <div className="bg-surface-dark text-slate-300 p-4 rounded-2xl rounded-tl-none border border-white/5">
                      <div className="typing-indicator">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="p-4 bg-surface-dark border-t border-white/5 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about tuition or curriculum..."
                  className="flex-1 bg-background-dark border-none rounded-xl text-xs py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                  disabled={isBotTyping}
                />
                <button type="submit" disabled={isBotTyping} className="size-10 bg-primary text-background-dark rounded-xl flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 hover-glow">
                  <span className="material-symbols-outlined font-black">send</span>
                </button>
              </form>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4 px-4 pb-4">
              {[
                { value: '0.8s', label: 'Avg Response' },
                { value: '450+', label: 'Leads/Month' },
                { value: '98%', label: 'Satisfaction' }
              ].map((stat, idx) => (
                <div key={idx} className={`text-center animate-bounce-in stagger-${idx + 1}`}>
                  <p className="text-xl font-black text-primary">{stat.value}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solution 2: Internal Process Automation */}
      <section id="process" className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-white/5">
        <div className="text-center mb-16 animate-slide-up">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">SOLUTION 02</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">Streamline Operations</h2>
          <p className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto font-medium">Reduce administrative overhead and eliminate manual data entry across your entire school ecosystem.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Admissions Workflows', icon: 'assignment_ind', desc: 'Automated application processing, document OCR, and smart interview scheduling.' },
            { title: 'Student Records Sync', icon: 'sync_alt', desc: 'Unified data synchronization with Odoo ERP, PowerSchool, Veracross, and Blackbaud.' },
            { title: 'Parent Communication', icon: 'notifications_active', desc: 'Multi-channel bulk messaging for announcements, emergency alerts, and individual updates.' },
            { title: 'HR & Payroll Automation', icon: 'badge', desc: 'Teacher contract management, attendance tracking, and leave requests with approval chains.' },
            { title: 'Inventory & Procurement', icon: 'inventory_2', desc: 'Automated textbook reordering, lab supply tracking, and maintenance request routing.' },
            { title: 'Advanced SIS Integration', icon: 'hub', desc: 'Native API connectors for global school information systems to ensure data integrity.' }
          ].map((item, idx) => (
            <div key={idx} className={`presentation-card p-8 rounded-[2.5rem] hover-lift cursor-pointer group animate-slide-up stagger-${Math.min(idx + 1, 5)}`}>
              <div className="size-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background-dark transition-all group-hover:scale-110">
                <span className="material-symbols-outlined text-3xl font-black">{item.icon}</span>
              </div>
              <h3 className="text-xl font-black mb-3 tracking-tight group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solution 3: Interactive Finance CRM Demo */}
      <section id="finance" className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-white/5">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-10 animate-slide-up">
            <div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">SOLUTION 03</p>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">Seekers Finance CRM</h2>
              <p className="text-slate-400 text-lg mt-6 font-medium leading-relaxed">Complete financial management system with automated payment tracking, intelligent reminders, and real-time analytics.</p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Live Data Sync', desc: 'Real-time synchronization with your school database', icon: 'sync' },
                { title: 'Smart Reminders', desc: 'AI-powered WhatsApp payment reminders', icon: 'notifications' },
                { title: 'Analytics Dashboard', desc: 'Comprehensive financial insights and forecasting', icon: 'analytics' },
                { title: 'Multi-user Access', desc: 'Role-based permissions for your entire team', icon: 'group' }
              ].map((f, i) => (
                <div key={i} className={`flex gap-4 group p-4 rounded-2xl transition-all hover:bg-white/5 animate-slide-up stagger-${i + 1}`}>
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all">
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-base font-black dark:text-white">{f.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive CRM Demo UI */}
          <div className="lg:col-span-8 presentation-card rounded-[2.5rem] overflow-hidden bg-slate-900/60 border-white/5 shadow-2xl">
            {/* CRM Header */}
            <div className="p-4 bg-surface-dark/80 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-primary to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">S</div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">Seekers Finance</h3>
                  <p className="text-[10px] text-slate-500">Live Demo - Interactive</p>
                </div>
              </div>

              <div className="flex bg-background-dark/80 p-1 rounded-xl border border-white/10 overflow-x-auto">
                {[
                  { id: 'dashboard', label: 'لوحة التحكم', icon: 'dashboard' },
                  { id: 'students', label: 'الطلاب', icon: 'school' },
                  { id: 'transactions', label: 'المعاملات', icon: 'receipt_long' },
                  { id: 'teachers', label: 'المدرسين', icon: 'person' },
                  { id: 'overdue', label: 'المتأخرات', icon: 'warning' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCrmActiveTab(tab.id as any)}
                    className={`px-3 py-2 text-[10px] font-black rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${crmActiveTab === tab.id ? 'bg-primary text-background-dark' : 'text-slate-500 hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* CRM Content */}
            <div className="p-6 min-h-[500px]">

              {/* Dashboard Tab */}
              {crmActiveTab === 'dashboard' && (
                <div className="space-y-6 animate-slide-up">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'إجمالي الطلاب', value: animatedStats.students.toLocaleString(), icon: 'groups', color: 'primary' },
                      { label: 'المحصل', value: `${(animatedStats.collected / 1000).toFixed(0)}K ج.م`, icon: 'payments', color: 'emerald' },
                      { label: 'المتبقي', value: `${(animatedStats.pending / 1000).toFixed(0)}K ج.م`, icon: 'pending', color: 'amber' },
                      { label: 'نسبة التحصيل', value: '59.5%', icon: 'trending_up', color: 'blue' }
                    ].map((stat, idx) => (
                      <div key={idx} className={`crm-stat-card animate-bounce-in stagger-${idx + 1}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`material-symbols-outlined text-${stat.color}-500`}>{stat.icon}</span>
                        </div>
                        <p className="text-2xl font-black text-white">{stat.value}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-background-dark/50 rounded-2xl p-6 border border-white/5">
                      <h4 className="text-sm font-black mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">bar_chart</span>
                        التحصيل الشهري
                      </h4>
                      <div className="h-40 flex items-end justify-between gap-2">
                        {[65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 50, 88].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full bg-gradient-to-t from-primary/60 to-primary rounded-t-md chart-bar"
                              style={{ height: `${h}%`, animationDelay: `${i * 0.05}s` }}
                            />
                            <span className="text-[8px] text-slate-600">{i + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-background-dark/50 rounded-2xl p-6 border border-white/5">
                      <h4 className="text-sm font-black mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">pie_chart</span>
                        توزيع الدفعات
                      </h4>
                      <div className="flex items-center justify-around">
                        <div className="relative size-32">
                          <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                            <circle cx="64" cy="64" r="56" fill="none" stroke="#10b981" strokeWidth="12" strokeDasharray="352" strokeDashoffset="140" className="transition-all duration-1000" />
                            <circle cx="64" cy="64" r="56" fill="none" stroke="#fbbf24" strokeWidth="12" strokeDasharray="352" strokeDashoffset="280" className="transition-all duration-1000" style={{ strokeDashoffset: 280 }} />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-black">59.5%</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="size-3 rounded bg-emerald-500"></span>
                            <span>مدفوع بالكامل</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="size-3 rounded bg-amber-500"></span>
                            <span>مدفوع جزئياً</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="size-3 rounded bg-red-500"></span>
                            <span>متأخر</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Tab */}
              {crmActiveTab === 'students' && (
                <div className="space-y-4 animate-slide-up">
                  {/* Search Bar */}
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="البحث عن طالب..."
                        className="w-full bg-background-dark/80 border border-white/10 rounded-xl py-3 pr-10 pl-4 text-sm focus:ring-1 focus:ring-primary outline-none"
                        dir="rtl"
                      />
                    </div>
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary hover:text-background-dark transition-all">
                      <span className="material-symbols-outlined">filter_list</span>
                    </button>
                  </div>

                  {/* Students Table */}
                  <div className="bg-background-dark/40 rounded-2xl border border-white/5 overflow-hidden">
                    <div className="grid grid-cols-12 gap-2 p-4 bg-white/5 text-[10px] font-black uppercase tracking-wider text-slate-500" dir="rtl">
                      <div className="col-span-4">الطالب</div>
                      <div className="col-span-2">الرسوم</div>
                      <div className="col-span-2">المدفوع</div>
                      <div className="col-span-2">المتبقي</div>
                      <div className="col-span-2">الحالة</div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {filteredStudents.map((student, idx) => (
                        <div
                          key={student.id}
                          className={`grid grid-cols-12 gap-2 p-4 crm-table-row cursor-pointer animate-slide-up stagger-${Math.min(idx + 1, 5)}`}
                          dir="rtl"
                          onClick={() => { setSelectedStudent(student); setShowPaymentModal(true); }}
                        >
                          <div className="col-span-4 flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{student.name}</p>
                              <p className="text-[10px] text-slate-500">{student.grade}</p>
                            </div>
                          </div>
                          <div className="col-span-2 flex items-center text-sm font-semibold">{student.totalFees.toLocaleString()}</div>
                          <div className="col-span-2 flex items-center text-sm font-semibold text-emerald-400">{student.paid.toLocaleString()}</div>
                          <div className="col-span-2 flex items-center text-sm font-semibold text-amber-400">{student.remaining.toLocaleString()}</div>
                          <div className="col-span-2 flex items-center">
                            <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                              student.status === 'paid' ? 'status-paid' :
                              student.status === 'partial' ? 'status-pending' : 'status-overdue'
                            }`}>
                              {student.status === 'paid' ? 'مدفوع' : student.status === 'partial' ? 'جزئي' : 'متأخر'}
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
                <div className="space-y-4 animate-slide-up">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black">المعاملات المالية</h4>
                    <button className="px-4 py-2 bg-primary text-background-dark rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all">
                      <span className="material-symbols-outlined text-sm">add</span>
                      معاملة جديدة
                    </button>
                  </div>

                  <div className="space-y-3">
                    {transactions.map((tx, idx) => (
                      <div key={tx.id} className={`flex items-center justify-between p-4 bg-background-dark/40 rounded-2xl border border-white/5 hover:border-primary/30 transition-all animate-slide-up stagger-${Math.min(idx + 1, 5)}`}>
                        <div className="flex items-center gap-4">
                          <div className={`size-12 rounded-xl flex items-center justify-center ${tx.type === 'IN' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                            <span className="material-symbols-outlined">{tx.type === 'IN' ? 'arrow_downward' : 'arrow_upward'}</span>
                          </div>
                          <div dir="rtl">
                            <p className="text-sm font-bold">{tx.description}</p>
                            <p className="text-[10px] text-slate-500">{tx.date} • {tx.method}</p>
                          </div>
                        </div>
                        <p className={`text-lg font-black ${tx.type === 'IN' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.type === 'IN' ? '+' : '-'}{tx.amount.toLocaleString()} ج.م
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teachers Tab */}
              {crmActiveTab === 'teachers' && (
                <div className="space-y-4 animate-slide-up">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-black">إدارة المدرسين والرواتب</h4>
                    <button className="px-4 py-2 bg-primary text-background-dark rounded-xl text-sm font-bold flex items-center gap-2 hover:scale-105 transition-all">
                      <span className="material-symbols-outlined text-sm">person_add</span>
                      إضافة مدرس
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teachers.map((teacher, idx) => (
                      <div key={teacher.id} className={`p-5 bg-background-dark/40 rounded-2xl border border-white/5 hover:border-primary/30 transition-all animate-slide-up stagger-${Math.min(idx + 1, 4)}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="size-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined">person</span>
                            </div>
                            <div dir="rtl">
                              <p className="font-bold">{teacher.name}</p>
                              <p className="text-xs text-slate-500">{teacher.subject}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${teacher.status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                            {teacher.status === 'paid' ? 'تم الصرف' : 'قيد الإنتظار'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center" dir="rtl">
                          <div>
                            <p className="text-xs text-slate-500">الراتب</p>
                            <p className="text-lg font-black text-white">{teacher.salary.toLocaleString()} ج.م</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">المدفوع</p>
                            <p className="text-lg font-black text-emerald-400">{teacher.paid.toLocaleString()} ج.م</p>
                          </div>
                        </div>
                        <div className="mt-4">
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
                <div className="space-y-6 animate-slide-up">
                  <div className="p-8 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/20 rounded-[2rem] text-center">
                    <div className="size-20 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/30 animate-glow">
                      <span className="material-symbols-outlined text-4xl">warning</span>
                    </div>
                    <h4 className="text-2xl font-black text-white mb-2">إجمالي المتأخرات</h4>
                    <p className="text-5xl font-black text-red-500 mb-4">{totalPending.toLocaleString()} ج.م</p>
                    <p className="text-sm text-slate-400 mb-6">{overdueStudents.length} طالب متأخر في السداد</p>

                    <button
                      onClick={triggerWhatsAppCampaign}
                      disabled={isSimulatingAction}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl text-sm font-black uppercase tracking-wider hover:scale-105 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-3 mx-auto"
                    >
                      {isSimulatingAction ? (
                        <>
                          <span className="material-symbols-outlined animate-spin">sync</span>
                          جاري إرسال تنبيهات الواتساب...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined">send</span>
                          تفعيل حملة التحصيل الذكية
                        </>
                      )}
                    </button>
                  </div>

                  {/* Overdue Students List */}
                  <div className="space-y-3">
                    {overdueStudents.map((student, idx) => (
                      <div key={student.id} className={`flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-2xl animate-slide-up stagger-${Math.min(idx + 1, 3)}`} dir="rtl">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined">person</span>
                          </div>
                          <div>
                            <p className="font-bold">{student.name}</p>
                            <p className="text-xs text-slate-500">{student.grade} • {student.phone}</p>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-black text-red-400">{student.remaining.toLocaleString()} ج.م</p>
                          <button className="text-[10px] text-primary hover:underline">إرسال تذكير</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CRM Footer */}
            <div className="p-4 bg-surface-dark/50 border-t border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-lg font-black text-primary">96.4%</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest">نسبة التحصيل</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-emerald-400">+12%</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest">vs الشهر السابق</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Live Demo • CAI-FIN-01</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customizable Agentic Application Section - Enhanced */}
      <section id="agentic-future" className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 border-t border-white/5">
        <div className="text-center mb-16 animate-slide-up">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">THE FUTURE OF AUTOMATION</p>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">Build Your Own<br /><span className="gradient-text-animated">AI Agent</span></h2>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mt-6">
            Transform any idea into a powerful AI-powered application. Design, build, and deploy custom agents that understand your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Agent Builder */}
          <div className="presentation-card p-8 rounded-[3rem] relative overflow-hidden animate-slide-up">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-indigo-500/5"></div>

            <div className="relative z-10 space-y-8">
              {isAgentBuilding ? (
                <div className="text-center py-12 space-y-8">
                  <div className="size-24 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-primary">smart_toy</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-2">Building Your Agent...</h3>
                    <p className="text-slate-400">AI is configuring your custom agent</p>
                  </div>
                  <div className="max-w-md mx-auto">
                    <div className="progress-bar h-3">
                      <div className="progress-bar-fill bg-gradient-to-r from-primary to-indigo-500" style={{ width: `${agentBuildProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-primary mt-2 font-bold">{Math.round(agentBuildProgress)}%</p>
                  </div>
                </div>
              ) : isDreamSubmitted ? (
                <div className="text-center py-8 space-y-6 animate-bounce-in">
                  <div className="size-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-glow">
                    <span className="material-symbols-outlined text-5xl">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black mb-3">Your Agent is Ready!</h3>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                      Your custom AI agent with <span className="text-primary font-bold">{selectedCapabilities.length} capabilities</span> has been configured and is ready for deployment.
                    </p>
                  </div>

                  {/* Agent Preview Card */}
                  <div className="bg-background-dark/60 rounded-2xl p-6 border border-white/10 text-left max-w-md mx-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="size-12 bg-primary rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-background-dark">smart_toy</span>
                      </div>
                      <div>
                        <p className="font-black">Custom Agent</p>
                        <p className="text-xs text-emerald-500">Active & Ready</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCapabilities.map(cap => {
                        const c = agentCapabilities.find(a => a.id === cap);
                        return c ? (
                          <span key={cap} className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">
                            {c.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => {setIsDreamSubmitted(false); setSelectedCapabilities([]); setDreamIdea(''); setAgentBuildProgress(0);}}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-black uppercase tracking-widest hover:border-primary transition-all"
                  >
                    Build Another Agent
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight">AI Agent Builder</h3>
                    <p className="text-sm text-slate-400 font-medium">Select capabilities and describe your vision</p>
                  </div>

                  {/* Capability Selection */}
                  <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Select Capabilities</p>
                    <div className="grid grid-cols-2 gap-3">
                      {agentCapabilities.map((cap, idx) => (
                        <div
                          key={cap.id}
                          onClick={() => toggleCapability(cap.id)}
                          className={`agent-capability flex items-center gap-3 animate-slide-up stagger-${Math.min(idx + 1, 5)} ${selectedCapabilities.includes(cap.id) ? 'selected' : ''}`}
                        >
                          <span className={`material-symbols-outlined ${selectedCapabilities.includes(cap.id) ? 'text-primary' : 'text-slate-500'}`}>
                            {cap.icon}
                          </span>
                          <div>
                            <p className="text-sm font-bold">{cap.name}</p>
                            <p className="text-[10px] text-slate-500">{cap.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleDreamSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Describe Your Vision</p>
                      <textarea
                        value={dreamIdea}
                        onChange={(e) => setDreamIdea(e.target.value)}
                        placeholder="I want an AI that can automatically analyze student attendance patterns, predict potential dropouts, and send personalized intervention recommendations to counselors..."
                        className="w-full h-32 bg-background-dark/80 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={selectedCapabilities.length === 0 && !dreamIdea.trim()}
                      className="w-full py-5 bg-gradient-to-r from-primary to-indigo-500 text-background-dark rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Build My AI Agent
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Features & Benefits */}
          <div className="space-y-8 animate-slide-up stagger-2">
            <div className="space-y-6">
              {[
                { icon: 'lightbulb', title: 'Any Idea, Any Scale', desc: 'From simple automation tasks to complex multi-agent systems, bring any concept to life.' },
                { icon: 'speed', title: 'Rapid Deployment', desc: 'Go from idea to production in hours, not months. Our platform handles the complexity.' },
                { icon: 'psychology', title: 'Continuous Learning', desc: 'Your agents evolve and improve over time, learning from every interaction.' },
                { icon: 'security', title: 'Enterprise Security', desc: 'Bank-grade encryption and compliance with international data protection standards.' }
              ].map((feature, idx) => (
                <div key={idx} className={`flex gap-5 group animate-slide-up stagger-${idx + 1}`}>
                  <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background-dark transition-all shrink-0">
                    <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-black mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Use Cases */}
            <div className="presentation-card p-6 rounded-2xl">
              <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Popular Use Cases</p>
              <div className="flex flex-wrap gap-2">
                {['Student Analytics', 'Automated Grading', 'Parent Communication', 'HR Assistant', 'Inventory Management', 'Report Generation', 'Attendance Tracking', 'Fee Collection'].map((use, idx) => (
                  <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold hover:border-primary hover:text-primary transition-all cursor-pointer">
                    {use}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Thank You Section */}
      <footer id="trust" className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-48 text-center border-t border-white/5">
        <div className="animate-slide-up">
          <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-6">NEXT GENERATION AUTOMATION</p>
          <h2 className="text-6xl md:text-9xl font-extrabold tracking-tighter leading-tight mb-8 gradient-text-animated">
            Thank You
          </h2>
          <p className="text-lg md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12">
            For exploring the future of educational excellence with Seekers AI. We look forward to transforming your institution.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button onClick={scrollToSection('agentic-future')} className="w-full sm:w-auto px-16 py-6 bg-primary text-background-dark rounded-2xl text-sm font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] hover-glow neon-border">
              Start Scoping Now
            </button>
          </div>
          <div className="mt-24 pt-16 flex flex-col items-center opacity-40">
             <Logo size={200} showText={false} />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mt-6">Propelling Educational Intelligence</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)}>
          <div className="bg-surface-dark rounded-3xl p-8 max-w-md w-full border border-white/10 shadow-2xl animate-bounce-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black">تسجيل دفعة جديدة</h3>
              <button onClick={() => setShowPaymentModal(false)} className="size-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6" dir="rtl">
              <div className="p-4 bg-background-dark/50 rounded-2xl">
                <p className="text-sm text-slate-500">الطالب</p>
                <p className="text-lg font-bold">{selectedStudent.name}</p>
                <p className="text-xs text-slate-500">{selectedStudent.grade}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background-dark/50 rounded-2xl text-center">
                  <p className="text-xs text-slate-500">المتبقي</p>
                  <p className="text-xl font-black text-amber-400">{selectedStudent.remaining.toLocaleString()} ج.م</p>
                </div>
                <div className="p-4 bg-background-dark/50 rounded-2xl text-center">
                  <p className="text-xs text-slate-500">المدفوع</p>
                  <p className="text-xl font-black text-emerald-400">{selectedStudent.paid.toLocaleString()} ج.م</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">مبلغ الدفعة</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                  className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-lg font-bold focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <button
                onClick={handlePayment}
                disabled={!paymentAmount}
                className="w-full py-4 bg-primary text-background-dark rounded-xl font-black uppercase tracking-widest disabled:opacity-50 hover:scale-[1.02] transition-all"
              >
                تأكيد الدفع
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
