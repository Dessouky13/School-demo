
import React, { useState, useEffect, useRef } from 'react';
import Logo from '../components/Logo';

const InteractiveDemo: React.FC = () => {
  // Language
  const [language, setLanguage] = useState<'en' | 'ar'>(() => {
    if (typeof window === 'undefined') return 'en';
    return (window.localStorage.getItem('seekers-lang') as 'en' | 'ar') || 'en';
  });
  const isArabic = language === 'ar';
  const t = (en: string, ar: string) => (isArabic ? ar : en);

  // Active tab: chatbot or agentic idea
  const [activeTab, setActiveTab] = useState<'chat' | 'idea'>('chat');

  // Chatbot state
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', text: 'Welcome to our International School Admissions AI. How can I assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Agentic idea state
  const [dreamIdea, setDreamIdea] = useState('');
  const [isDreamSubmitted, setIsDreamSubmitted] = useState(false);
  const [isAgentBuilding, setIsAgentBuilding] = useState(false);
  const [agentBuildProgress, setAgentBuildProgress] = useState(0);

  // Save language
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

  // Chat auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isBotTyping]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isBotTyping) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsBotTyping(true);

    try {
      const response = await fetch('https://n8n.srv1131703.hstgr.cloud/webhook/7dcdf598-a491-4c39-aafd-614cb91191f7/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatInput: userMsg,
          sessionId: 'demo-mobile-session-' + Date.now(),
          language: isArabic ? 'ar' : 'en'
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const botText = typeof data === 'string' ? data : (data.output || data.text || data.response || t("I've received your request and notified the admissions team via WhatsApp.", 'تم استلام طلبك وتم إخطار فريق القبول عبر واتساب.'));
      setChatMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch {
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
      if (progress >= 100) { progress = 100; clearInterval(buildInterval); }
      setAgentBuildProgress(Math.min(progress, 100));
    }, 200);

    try {
      await fetch('https://n8n.srv1131703.hstgr.cloud/webhook/381845cd-f34b-4498-84d0-3118a6e8569d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: dreamIdea, sessionId: 'agentic-builder-session', timestamp: new Date().toISOString(), source: 'interactive-demo' }),
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

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 flex flex-col font-sans" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Styles */}
      <style>{`
        @keyframes slideInBounce { 0% { opacity: 0; transform: translateY(30px); } 60% { opacity: 1; transform: translateY(-5px); } 100% { transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
        @keyframes fadeInBlur { from { opacity: 0; filter: blur(10px); } to { opacity: 1; filter: blur(0); } }
        .anim-slide-in-bounce { animation: slideInBounce 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-scale-in { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .anim-fade-blur { animation: fadeInBlur 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .chat-message-enter { animation: slideInBounce 0.35s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .chat-scroll-smooth { scroll-behavior: smooth; overscroll-behavior-y: contain; -webkit-overflow-scrolling: touch; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[60vw] h-[60vw] bg-[#a19eff]/5 blur-[80px] rounded-full"></div>
        <div className="absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] bg-indigo-500/5 blur-[80px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 flex items-center justify-between px-4 py-3 bg-[#0f1629]/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Logo size={28} showText={false} />
          <div>
            <h1 className="text-sm font-black uppercase tracking-wider">{t('Interactive Demo', 'العرض التفاعلي')}</h1>
            <p className="text-[9px] text-[#a19eff] font-bold uppercase tracking-widest">{t('Seekers AI', 'سيكرز AI')}</p>
          </div>
        </div>
        <button
          onClick={() => setLanguage(isArabic ? 'en' : 'ar')}
          className="px-2.5 py-1 rounded-full border border-[#a19eff]/30 text-[10px] font-black uppercase tracking-[0.2em] text-[#a19eff] hover:bg-[#a19eff]/10 transition-all active:scale-95"
        >
          {isArabic ? 'EN' : 'ع'}
        </button>
      </header>

      {/* Tab Switcher */}
      <div className="relative z-10 flex bg-[#0f1629]/60 border-b border-white/5">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${activeTab === 'chat' ? 'text-[#a19eff] border-b-2 border-[#a19eff] bg-[#a19eff]/5' : 'text-slate-500'}`}
        >
          <span className="material-symbols-outlined text-base">school</span>
          {t('AI Chatbot', 'بوت القبول')}
        </button>
        <button
          onClick={() => setActiveTab('idea')}
          className={`flex-1 py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all ${activeTab === 'idea' ? 'text-[#a19eff] border-b-2 border-[#a19eff] bg-[#a19eff]/5' : 'text-slate-500'}`}
        >
          <span className="material-symbols-outlined text-base">auto_awesome</span>
          {t('Agentic Idea', 'فكرة وكيل ذكي')}
        </button>
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col min-h-0">

        {/* ========== CHATBOT TAB ========== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 anim-fade-blur">
            {/* Chat header */}
            <div className="px-4 py-3 bg-[#0f1629]/40 border-b border-white/5 flex items-center gap-3">
              <div className="size-10 rounded-full bg-[#a19eff]/20 flex items-center justify-center text-[#a19eff]">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">{t('Admissions AI Bot', 'بوت القبول الذكي')}</p>
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1">
                  <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {t('Online', 'متصل')}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 no-scrollbar chat-scroll-smooth">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex chat-message-enter ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animationDelay: `${i * 0.04}s` }}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-[#a19eff] text-[#0a0e1a] font-bold rounded-tr-sm'
                    : 'bg-[#161d33] text-slate-300 rounded-tl-sm border border-white/5'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#161d33] text-slate-300 p-3 rounded-2xl rounded-tl-sm border border-white/5">
                    <div className="flex gap-1.5 items-center h-5">
                      <span className="size-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="size-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="size-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestions */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                t('Tuition fees?', 'المصروفات؟'),
                t('Available grades?', 'الصفوف المتاحة؟'),
                t('Curriculum info', 'معلومات المنهج'),
                t('Visit campus', 'زيارة المدرسة'),
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => { setChatInput(q); }}
                  className="shrink-0 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-slate-400 hover:text-white hover:border-[#a19eff]/30 transition-all active:scale-95"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleChatSubmit} className="px-3 py-3 bg-[#0f1629]/60 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={t('Ask about tuition, curriculum...', 'اسأل عن المصروفات أو المنهج...')}
                className="flex-1 bg-[#0a0e1a] border border-white/10 rounded-xl text-sm py-3 px-4 focus:ring-1 focus:ring-[#a19eff] outline-none placeholder-slate-600"
                disabled={isBotTyping}
              />
              <button type="submit" disabled={isBotTyping} className="size-11 bg-[#a19eff] text-[#0a0e1a] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-50">
                <span className="material-symbols-outlined font-black text-xl">send</span>
              </button>
            </form>

            {/* Stats */}
            <div className="px-4 py-2.5 bg-[#0f1629]/40 border-t border-white/5 grid grid-cols-3 gap-2">
              {[
                { value: '0.8s', label: t('Avg Response', 'متوسط الرد') },
                { value: '450+', label: t('Leads/Month', 'عملاء/شهر') },
                { value: '98%', label: t('Satisfaction', 'رضا') }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-lg font-black text-[#a19eff]">{stat.value}</p>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========== AGENTIC IDEA TAB ========== */}
        {activeTab === 'idea' && (
          <div className="flex-1 overflow-y-auto px-4 py-6 anim-fade-blur">
            <div className="max-w-lg mx-auto space-y-6">

              {isAgentBuilding ? (
                <div className="text-center py-8 space-y-6 anim-scale-in">
                  <div className="size-20 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-[#a19eff]/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#a19eff] border-t-transparent animate-spin"></div>
                    <div className="absolute inset-3 rounded-full bg-[#a19eff]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl text-[#a19eff]">smart_toy</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-1">{t('Building Your App...', 'جاري بناء التطبيق...')}</h3>
                    <p className="text-slate-400 text-sm">{t('AI is configuring your custom agentic app', 'الذكاء الاصطناعي بيجهز التطبيق الوكيل')}</p>
                  </div>
                  <div className="max-w-xs mx-auto">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#a19eff] to-indigo-500 rounded-full transition-all duration-300" style={{ width: `${agentBuildProgress}%` }}></div>
                    </div>
                    <p className="text-sm text-[#a19eff] mt-2 font-bold">{Math.round(agentBuildProgress)}%</p>
                  </div>
                </div>

              ) : isDreamSubmitted ? (
                <div className="text-center py-8 space-y-5 anim-scale-in">
                  <div className="size-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-2">{t('Idea Submitted!', 'تم إرسال الفكرة!')}</h3>
                    <p className="text-slate-400 text-sm px-4">
                      {t("We've received your idea and our team will reach out to discuss next steps.", 'استلمنا فكرتك وفريقنا هيتواصل معاك لمناقشة الخطوات الجاية.')}
                    </p>
                  </div>
                  <button
                    onClick={() => { setIsDreamSubmitted(false); setDreamIdea(''); setAgentBuildProgress(0); }}
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-black uppercase tracking-widest hover:border-[#a19eff] transition-all active:scale-95"
                  >
                    {t('Submit Another Idea', 'أرسل فكرة أخرى')}
                  </button>
                </div>

              ) : (
                <>
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="size-14 bg-[#a19eff]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <span className="material-symbols-outlined text-3xl text-[#a19eff]">auto_awesome</span>
                    </div>
                    <h2 className="text-2xl font-black tracking-tight">{t('Agentic App Builder', 'منشئ التطبيقات الوكيلة')}</h2>
                    <p className="text-sm text-slate-400">{t("Describe your idea and we'll build it for you", 'احكي فكرتك وإحنا هنبنيها ليك')}</p>
                  </div>

                  {/* Capabilities */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: 'database', label: t('Data Analysis', 'تحليل بيانات') },
                      { icon: 'chat', label: t('Smart Chat', 'شات ذكي') },
                      { icon: 'bolt', label: t('Automation', 'أتمتة') },
                      { icon: 'notifications', label: t('Alerts', 'تنبيهات') },
                      { icon: 'hub', label: t('API Integration', 'تكامل API') },
                      { icon: 'assessment', label: t('Reports', 'تقارير') },
                    ].map((cap, i) => (
                      <div key={i} className="flex flex-col items-center gap-1.5 p-3 bg-white/5 border border-white/5 rounded-xl">
                        <span className="material-symbols-outlined text-[#a19eff] text-xl">{cap.icon}</span>
                        <span className="text-[10px] font-bold text-slate-400 text-center leading-tight">{cap.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Form */}
                  <form onSubmit={handleDreamSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('Describe Your Idea', 'وصف الفكرة')}</p>
                      <textarea
                        value={dreamIdea}
                        onChange={(e) => setDreamIdea(e.target.value)}
                        placeholder={t('Describe the app you want to build...', 'اكتب تفاصيل التطبيق...')}
                        className="w-full h-32 bg-[#0a0e1a] border border-white/10 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-[#a19eff] focus:border-transparent outline-none transition-all resize-none placeholder-slate-600"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!dreamIdea.trim()}
                      className="w-full py-4 bg-gradient-to-r from-[#a19eff] to-indigo-500 text-[#0a0e1a] rounded-xl text-sm font-black uppercase tracking-[0.2em] shadow-lg shadow-[#a19eff]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {t('Submit My Idea', 'أرسل فكرتي')}
                      <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    </button>
                  </form>

                  {/* Popular use cases */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('Popular Use Cases', 'أمثلة شائعة')}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        t('Student Analytics', 'تحليلات الطلاب'),
                        t('Automated Grading', 'تصحيح تلقائي'),
                        t('Parent Comms', 'تواصل أولياء الأمور'),
                        t('HR Assistant', 'مساعد HR'),
                        t('Inventory', 'المخزون'),
                        t('Reports', 'التقارير'),
                        t('Attendance', 'الحضور'),
                        t('Fee Collection', 'تحصيل الرسوم')
                      ].map((use, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDreamIdea(prev => prev ? prev + ', ' + use : use)}
                          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold text-slate-400 hover:border-[#a19eff]/30 hover:text-white transition-all active:scale-95"
                        >
                          {use}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-50 px-4 py-3 bg-[#0f1629]/60 backdrop-blur-xl border-t border-white/5 text-center">
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
          {t('Powered by Seekers AI — Enterprise Automation Platform', 'بواسطة سيكرز AI — منصة أتمتة المؤسسات')}
        </p>
      </footer>
    </div>
  );
};

export default InteractiveDemo;
