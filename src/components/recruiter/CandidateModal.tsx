import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createCandidate, t } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [roleApplied, setRoleApplied] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    createCandidate({
      name,
      email,
      roleApplied: roleApplied || 'General Applicant',
    });

    setName('');
    setEmail('');
    setRoleApplied('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl">
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t.recruiter.createCandidateModal.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.recruiter.createCandidateModal.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              {t.recruiter.createCandidateModal.fieldName} *
            </label>
            <input
              type="text"
              required
              placeholder={t.recruiter.createCandidateModal.namePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              {t.recruiter.createCandidateModal.fieldEmail} *
            </label>
            <input
              type="email"
              required
              placeholder={t.recruiter.createCandidateModal.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              {t.recruiter.createCandidateModal.fieldRole}
            </label>
            <input
              type="text"
              placeholder={t.recruiter.createCandidateModal.rolePlaceholder}
              value={roleApplied}
              onChange={e => setRoleApplied(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
            />
          </div>

          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold bg-[#2368f5] text-white rounded-xl hover:bg-[#144cc0] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t.recruiter.createCandidateModal.saveBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
