import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, Mars, Venus, Briefcase, Layers } from 'lucide-react';
import { getLocalizedArea } from '../../utils/areaLocalization';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createCandidate, areas, t, language } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [customRoleText, setCustomRoleText] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  // Initialize selected area when modal opens
  useEffect(() => {
    if (isOpen && areas.length > 0) {
      const initialArea = selectedArea || areas[0].name;
      setSelectedArea(initialArea);
      const areaObj = areas.find(a => a.name === initialArea);
      const cls = areaObj?.classifications || [];
      if (cls.length > 0) {
        setSelectedClassification(cls[0]);
        setIsCustomRole(false);
      } else {
        setIsCustomRole(true);
      }
    }
  }, [isOpen, areas]);

  // Handle area change
  const handleAreaChange = (newAreaName: string) => {
    setSelectedArea(newAreaName);
    const areaObj = areas.find(a => a.name === newAreaName);
    const cls = areaObj?.classifications || [];
    if (cls.length > 0) {
      setSelectedClassification(cls[0]);
      setIsCustomRole(false);
    } else {
      setSelectedClassification('');
      setIsCustomRole(true);
    }
  };

  if (!isOpen) return null;

  const currentAreaObj = areas.find(a => a.name === selectedArea);
  const availableClassifications = currentAreaObj?.classifications || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const finalRole = isCustomRole ? customRoleText.trim() : selectedClassification;

    createCandidate({
      name: name.trim(),
      email: email.trim(),
      area: selectedArea,
      roleApplied: finalRole || 'General Applicant',
      gender,
    });

    setName('');
    setEmail('');
    setCustomRoleText('');
    setIsCustomRole(false);
    setGender('male');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto">
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

          {/* Area Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2368f5]" />
              <span>{t.recruiter.createCandidateModal.fieldArea} *</span>
            </label>
            <select
              value={selectedArea}
              onChange={e => handleAreaChange(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5] font-medium"
            >
              {areas.map(a => (
                <option key={a.id} value={a.name}>
                  {getLocalizedArea(a.name, language)}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-area / Classification Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#2368f5]" />
              <span>{t.recruiter.createCandidateModal.fieldRole} *</span>
            </label>

            <select
              value={isCustomRole ? '__custom__' : selectedClassification}
              onChange={e => {
                if (e.target.value === '__custom__') {
                  setIsCustomRole(true);
                } else {
                  setIsCustomRole(false);
                  setSelectedClassification(e.target.value);
                }
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5] font-medium"
            >
              {availableClassifications.map((item, idx) => (
                <option key={idx} value={item}>
                  {item}
                </option>
              ))}
              <option value="__custom__">
                {t.recruiter.createCandidateModal.customRoleOption}
              </option>
            </select>

            {isCustomRole && (
              <input
                type="text"
                required
                placeholder={t.recruiter.createCandidateModal.customRolePlaceholder}
                value={customRoleText}
                onChange={e => setCustomRoleText(e.target.value)}
                className="w-full text-xs p-2.5 mt-2 rounded-xl border border-blue-300 bg-blue-50/20 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
              />
            )}
          </div>

          {/* Gender Selection: Mars (Male) & Venus (Female) Icons */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              {t.recruiter.createCandidateModal.fieldGender} *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  gender === 'male'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs ring-1 ring-blue-500'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Mars className="w-4 h-4 text-blue-600" />
                <span>{t.recruiter.createCandidateModal.genderMale}</span>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  gender === 'female'
                    ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-xs ring-1 ring-purple-500'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Venus className="w-4 h-4 text-purple-600" />
                <span>{t.recruiter.createCandidateModal.genderFemale}</span>
              </button>
            </div>
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
