import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setActiveRole } = useApp();
  const [selectedRoleIndex, setSelectedRoleIndex] = useState(0);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');


  const roles = [
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Parents',
      roleKey: 'parent' as const,
      desc: "One dashboard for all kids, all schools. Know what's missing, what's due, and when to hire help.",
    },
    {
      icon: '📚',
      title: 'Students',
      roleKey: 'student' as const,
      desc: 'Your planner. Your files. Homework uploads. Study groups. All in one place.',
    },
    {
      icon: '👨‍🏫',
      title: 'Teachers',
      roleKey: 'teacher' as const,
      desc: 'Post assignments, collect work, e-sign permission slips, and connect families to support.',
    },
    {
      icon: '⭐',
      title: 'Tutors & Providers',
      roleKey: 'tutor' as const,
      desc: 'Your verified listing. Lead notifications. Scheduling, booking, and payment all built in.',
    },
  ];

  const handleLaunchAppWithRole = (roleKey: 'parent' | 'student' | 'teacher' | 'tutor') => {
    setActiveRole(roleKey);
    setCurrentView('dashboard');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Banner to launch MVP directly */}
      <div className="bg-[#0D8B8B] text-white p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-[#FFE4DC] text-[#FF6B54] font-bold px-2 py-0.5 rounded-full text-[10px]">
            MVP FUNCIONAL
          </span>
          <span>Puedes interactuar con la aplicación completa en vivo.</span>
        </div>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-white text-[#0D8B8B] rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors shadow-xs cursor-pointer"
        >
          <span>Abrir Dashboard Interactivo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1A2332] tracking-tight leading-tight">
            One platform. All your students' learning.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#52697C] leading-relaxed">
            Parents manage multiple school portals, tutors, and activities. OrbitLearn brings everything together—assignments, schedules, progress, and vetted education providers—in one family workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 rounded-xl bg-[#FF6B54] text-white font-bold text-sm hover:bg-[#FF5A40] transition-transform hover:-translate-y-0.5 shadow-md shadow-[#FF6B54]/25 cursor-pointer"
            >
              Start Free Trial (Abrir MVP)
            </button>
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-6 py-3 rounded-xl bg-white text-[#0D8B8B] font-bold text-sm border-2 border-[#0D8B8B] hover:bg-gray-50 transition-colors cursor-pointer"
            >
              See Demo
            </button>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="bg-gradient-to-tr from-[#0D8B8B] to-[#15A9A9] rounded-3xl p-8 sm:p-10 text-white flex flex-col items-center justify-center min-h-[380px] shadow-lg">
          <div className="text-5xl mb-4">📊</div>
          <div className="w-full max-w-xs bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-2.5">
            <div className="bg-white/15 p-3 rounded-xl text-xs text-left">
              <strong className="block text-white font-bold">Alex's Math</strong>
              <span className="text-red-200 font-semibold">Missing: 3 assignments</span>
            </div>
            <div className="bg-white/15 p-3 rounded-xl text-xs text-left">
              <strong className="block text-white font-bold">Jordan's Science</strong>
              <span className="text-teal-100">Due: Next Tuesday</span>
            </div>
            <div className="bg-white/15 p-3 rounded-xl text-xs text-left">
              <strong className="block text-white font-bold">Tutor Available</strong>
              <span className="text-amber-200">4.9★ Math specialist</span>
            </div>
          </div>
          <p className="text-xs text-white/80 mt-4">See everything at a glance</p>
        </div>
      </section>

      {/* Comparison Table: The Gap */}
      <section className="bg-white rounded-3xl border border-[#E8E4DF] p-6 sm:p-8 shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2332] text-center mb-3">
          No single product does all this
        </h2>
        <p className="text-center text-xs sm:text-sm text-[#52697C] max-w-xl mx-auto mb-8">
          Comparativa de capacidades entre plataformas convencionales y OrbitLearn
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E8E4DF] bg-[#F8F6F3]">
                <th className="p-3.5 font-bold text-[#1A2332]">Capacidad</th>
                <th className="p-3.5 text-[#52697C] font-semibold">Khan Academy</th>
                <th className="p-3.5 text-[#52697C] font-semibold">Google Classroom</th>
                <th className="p-3.5 text-[#52697C] font-semibold">Clever</th>
                <th className="p-3.5 text-[#52697C] font-semibold">Seesaw</th>
                <th className="p-3.5 text-[#0D8B8B] font-extrabold bg-teal-50/50">OrbitLearn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DF]">
              {[
                { name: 'Multi-school family view', k: false, g: false, c: false, s: false, o: true },
                { name: 'Assignment aggregation', k: false, g: true, c: false, s: true, o: true },
                { name: 'Tutoring marketplace', k: false, g: false, c: false, s: false, o: true },
                { name: 'Verified provider discovery', k: false, g: false, c: false, s: false, o: true },
                { name: 'Direct booking & payments', k: false, g: false, c: false, s: false, o: true },
                { name: 'Parent/student role switching', k: false, g: false, c: false, s: true, o: true },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/60">
                  <td className="p-3.5 font-semibold text-[#1A2332]">{row.name}</td>
                  <td className="p-3.5 text-gray-400">{row.k ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4" />}</td>
                  <td className="p-3.5 text-gray-400">{row.g ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4" />}</td>
                  <td className="p-3.5 text-gray-400">{row.c ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4" />}</td>
                  <td className="p-3.5 text-gray-400">{row.s ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4" />}</td>
                  <td className="p-3.5 bg-teal-50/30 font-bold text-[#0D8B8B]"><Check className="w-5 h-5 text-emerald-600" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Roles Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2332] text-center mb-8">
          Built for everyone in the family
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedRoleIndex(idx);
                handleLaunchAppWithRole(r.roleKey);
              }}
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-center ${
                selectedRoleIndex === idx
                  ? 'bg-gradient-to-tr from-[#0D8B8B] to-[#15A9A9] text-white border-[#0D8B8B] shadow-md scale-102'
                  : 'bg-white border-[#E8E4DF] hover:border-[#0D8B8B] hover:shadow-xs'
              }`}
            >
              <div className="text-4xl mb-3">{r.icon}</div>
              <h3 className={`text-base font-bold ${selectedRoleIndex === idx ? 'text-white' : 'text-[#1A2332]'}`}>
                {r.title}
              </h3>
              <p className={`text-xs mt-2 ${selectedRoleIndex === idx ? 'text-white/90' : 'text-[#52697C]'}`}>
                {r.desc}
              </p>
              <span className={`inline-block mt-4 text-[11px] font-bold underline ${selectedRoleIndex === idx ? 'text-white' : 'text-[#0D8B8B]'}`}>
                Probar rol en la app →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2332] text-center mb-8">
          Everything a modern family needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔐', title: 'Secure Role Switching', desc: 'Parents, students, teachers. Switch roles instantly. Each role sees only what matters to them.' },
            { icon: '📅', title: 'Assignment & Calendar Sync', desc: 'Pull assignments from Google Classroom, Canvas, and 50+ school platforms. One timeline, never miss a deadline.' },
            { icon: '📁', title: 'Google Drive & Docs Integration', desc: 'Homework uploads, file management, and one-click editing. Google Workspace lives in OrbitLearn.' },
            { icon: '🔍', title: 'Verified Tutoring Marketplace', desc: 'Zillow-style discovery. Filter by subject, rates, availability, and reviews. Vetted tutors and programs.' },
            { icon: '✅', title: 'E-Signature & Compliance', desc: 'Permission slips, consent forms, and family agreements. FERPA-aligned. Audit trails included.' },
            { icon: '💬', title: 'Family Communication', desc: 'Message teachers, tutors, and other families. Keep conversations organized by student and school.' },
            { icon: '📊', title: 'Progress Dashboards', desc: 'Weekly alerts. What’s working. What needs help. Predictive alerts for missing assignments.' },
            { icon: '💳', title: 'Built-in Payments', desc: 'Book tutoring sessions. Pay through OrbitLearn. Transparent billing for families and providers.' },
          ].map((feat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border-l-4 border-l-[#0D8B8B] border border-[#E8E4DF] shadow-xs">
              <div className="text-2xl mb-2">{feat.icon}</div>
              <h3 className="font-bold text-sm text-[#1A2332]">{feat.title}</h3>
              <p className="text-xs text-[#52697C] mt-1.5 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="bg-white rounded-3xl border border-[#E8E4DF] p-8 shadow-xs">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2332] text-center mb-2">
          Connects to everything your school uses
        </h2>
        <p className="text-center text-xs sm:text-sm text-[#52697C] max-w-xl mx-auto mb-8">
          OrbitLearn syncs seamlessly with the platforms your schools and tutors already use. Real-time data flow means no manual updates, no lost information.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '📚', name: 'Google Classroom', status: 'Real-time Sync' },
            { icon: '🎓', name: 'Canvas LMS', status: 'Real-time Sync' },
            { icon: '🏫', name: 'Schoology', status: 'Real-time Sync' },
            { icon: '🎯', name: 'Khan Academy', status: 'Real-time Sync' },
            { icon: '📁', name: 'Google Workspace', status: 'Real-time Sync' },
            { icon: '✏️', name: 'SAT & ACT Prep', status: 'Real-time Sync' },
            { icon: '💼', name: 'Microsoft Teams', status: 'Próximamente' },
            { icon: '🔐', name: 'Clever SSO', status: 'Real-time Sync' },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#E8E4DF] bg-[#F8F6F3]/50 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <h4 className="font-bold text-xs text-[#1A2332]">{item.name}</h4>
              <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1A2332] text-center mb-2">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-xs sm:text-sm text-[#52697C] mb-8 font-medium">
          7-day free trial on all paid plans. No credit card required.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#1A2332]">Student</h3>
              <p className="text-xs text-[#52697C]">For individual learners</p>
              <div className="text-3xl font-black text-[#1A2332] my-4">Free</div>
              <ul className="text-xs text-[#52697C] space-y-2 mb-6">
                <li>✓ One school connection</li>
                <li>✓ Planner & calendar</li>
                <li>✓ File uploads (2 GB)</li>
                <li>✓ Tutor discovery</li>
              </ul>
            </div>
            <button
              onClick={() => handleLaunchAppWithRole('student')}
              className="w-full py-2.5 rounded-xl border border-[#0D8B8B] text-[#0D8B8B] text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer"
            >
              Get Started Free
            </button>
          </div>

          {/* Family (Featured) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-[#FF6B54] shadow-lg relative flex flex-col justify-between scale-102">
            <span className="absolute -top-3 right-6 bg-[#FF6B54] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
              Most Popular
            </span>
            <div>
              <h3 className="font-bold text-lg text-[#1A2332]">Family</h3>
              <p className="text-xs text-[#52697C]">For families up to 4 students</p>
              <div className="text-3xl font-black text-[#1A2332] my-4">
                $12 <span className="text-xs font-normal text-[#52697C]">/ mes</span>
              </div>
              <ul className="text-xs text-[#52697C] space-y-2 mb-6">
                <li>✓ Multi-child dashboard (Alex & Jordan)</li>
                <li>✓ Multiple school connections</li>
                <li>✓ Google Drive integration</li>
                <li>✓ Parent alerts & missing assignment warnings</li>
                <li>✓ Tutor search & instant booking</li>
                <li>✓ E-Signature for permission slips</li>
              </ul>
            </div>
            <button
              onClick={() => handleLaunchAppWithRole('parent')}
              className="w-full py-2.5 rounded-xl bg-[#FF6B54] text-white text-xs font-bold hover:bg-[#FF5A40] transition-colors shadow-xs cursor-pointer"
            >
              Start 7-Day Trial (Explorar)
            </button>
          </div>

          {/* Family Plus */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-[#1A2332]">Family Plus</h3>
              <p className="text-xs text-[#52697C]">For larger families</p>
              <div className="text-3xl font-black text-[#1A2332] my-4">
                $22 <span className="text-xs font-normal text-[#52697C]">/ mes</span>
              </div>
              <ul className="text-xs text-[#52697C] space-y-2 mb-6">
                <li>✓ Unlimited children</li>
                <li>✓ AI study planning recommendations</li>
                <li>✓ Priority tutor matching</li>
                <li>✓ 100 GB storage</li>
              </ul>
            </div>
            <button
              onClick={() => handleLaunchAppWithRole('parent')}
              className="w-full py-2.5 rounded-xl border border-[#0D8B8B] text-[#0D8B8B] text-xs font-bold hover:bg-teal-50 transition-colors cursor-pointer"
            >
              Start Trial
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#0D8B8B] to-[#15A9A9] rounded-3xl p-8 text-white text-center shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Ready to simplify your family's school life?
        </h2>
        <p className="text-xs sm:text-sm text-white/90 max-w-md mx-auto mb-6">
          Start your 7-day free trial. No credit card required. Experience all roles right now.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            className="px-4 py-2.5 rounded-xl text-xs bg-white text-[#1A2332] focus:outline-none"
          />
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-5 py-2.5 bg-[#FF6B54] text-white text-xs font-bold rounded-xl hover:bg-[#FF5A40] transition-colors cursor-pointer"
          >
            Launch MVP
          </button>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#1A2332]">Schedule a Product Demo</h3>
            <p className="text-xs text-[#52697C] mt-1 mb-4">
              O simplemente explora directamente el MVP interactivo que ya está listo.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  setCurrentView('dashboard');
                }}
                className="w-full py-2.5 bg-[#0D8B8B] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Abrir Plataforma MVP Ahora
              </button>
              <button
                onClick={() => setShowDemoModal(false)}
                className="w-full py-2 text-xs text-[#52697C] hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
