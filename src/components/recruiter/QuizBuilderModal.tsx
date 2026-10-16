import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Quiz, Question } from '../../types';
import {
  PlusCircle,
  Trash2,
  CheckCircle2,
  X,
  Download,
  FileSpreadsheet,
  FolderPlus,
  Shield,
  Zap,
  Award,
} from 'lucide-react';
import { downloadCsvTemplate, parseQuestionsCsv } from '../../utils/csvParser';
import { getLocalizedArea } from '../../utils/areaLocalization';
import { orangeCountyAreas } from '../../data/orangeCountyData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quizToEdit?: Quiz | null;
}

export const QuizBuilderModal: React.FC<Props> = ({ isOpen, onClose, quizToEdit }) => {
  const { createQuiz, updateQuiz, areas, createArea, t, language } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(2);
  const [supportedClassifications, setSupportedClassifications] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // New Area Modal state
  const [showNewAreaModal, setShowNewAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDescription, setNewAreaDescription] = useState('');
  const [isCreatingArea, setIsCreatingArea] = useState(false);

  // CSV upload message
  const [csvFeedback, setCsvFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (quizToEdit) {
        setTitle(quizToEdit.title);
        setCategory(quizToEdit.category);
        setDescription(quizToEdit.description);
        setTimeLimitMinutes(quizToEdit.timeLimitMinutes || 60);
        setDifficulty(quizToEdit.difficulty || 2);
        setSupportedClassifications(quizToEdit.supportedClassifications || []);
        setQuestions(JSON.parse(JSON.stringify(quizToEdit.questions)));
      } else {
        setTitle('');
        setCategory(areas[0]?.name || '');
        setDescription('');
        setTimeLimitMinutes(60);
        setDifficulty(2);
        setSupportedClassifications([]);
        setQuestions([
          {
            id: `q-${Date.now()}-1`,
            text: '',
            categoryTag: '',
            explanation: '',
            options: [
              { id: 'opt-1', text: '' },
              { id: 'opt-2', text: '' },
              { id: 'opt-3', text: '' },
              { id: 'opt-4', text: '' },
            ],
            correctOptionIds: ['opt-1'],
          },
        ]);
      }
    }
  }, [isOpen, quizToEdit, areas]);

  if (!isOpen) return null;

  const handleCreateAreaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    try {
      setIsCreatingArea(true);
      const created = await createArea(newAreaName, newAreaDescription);
      setCategory(created.name);
      setNewAreaName('');
      setNewAreaDescription('');
      setShowNewAreaModal(false);
    } catch (err) {
      console.error('Error creating area:', err);
    } finally {
      setIsCreatingArea(false);
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (!text) return;

      const { questions: parsed, errors, difficulty: parsedDiff, targetRoles } = parseQuestionsCsv(text);
      if (errors.length > 0 && parsed.length === 0) {
        alert(t.recruiter.createQuizModal.csvImportError.replace('{errors}', errors.join('\n')));
        return;
      }

      const isSingleEmpty = questions.length === 1 && !questions[0].text.trim();
      const combined = isSingleEmpty ? parsed : [...questions, ...parsed];
      setQuestions(combined);

      if (parsedDiff) setDifficulty(parsedDiff);
      if (targetRoles && targetRoles.length > 0) {
        setSupportedClassifications(prev => Array.from(new Set([...prev, ...targetRoles])));
      }

      setCsvFeedback(
        t.recruiter.createQuizModal.csvImportSuccess.replace('{count}', String(parsed.length))
      );
      setTimeout(() => setCsvFeedback(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}-${questions.length + 1}`,
      text: '',
      categoryTag: '',
      explanation: '',
      options: [
        { id: `opt-${Date.now()}-1`, text: '' },
        { id: `opt-${Date.now()}-2`, text: '' },
        { id: `opt-${Date.now()}-3`, text: '' },
      ],
      correctOptionIds: [],
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionTextChange = (qIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].text = text;
    setQuestions(updated);
  };

  const handleCategoryTagChange = (qIndex: number, tag: string) => {
    const updated = [...questions];
    updated[qIndex].categoryTag = tag;
    setQuestions(updated);
  };

  const handleExplanationChange = (qIndex: number, explanation: string) => {
    const updated = [...questions];
    updated[qIndex].explanation = explanation;
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    const newOptId = `opt-${Date.now()}-${updated[qIndex].options.length + 1}`;
    updated[qIndex].options.push({ id: newOptId, text: '' });
    setQuestions(updated);
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) return;
    const removedOpt = updated[qIndex].options[optIndex];
    updated[qIndex].options = updated[qIndex].options.filter((_, i) => i !== optIndex);
    updated[qIndex].correctOptionIds = updated[qIndex].correctOptionIds.filter(id => id !== removedOpt.id);
    setQuestions(updated);
  };

  const handleOptionTextChange = (qIndex: number, optIndex: number, text: string) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex].text = text;
    setQuestions(updated);
  };

  const toggleCorrectOption = (qIndex: number, optId: string) => {
    const updated = [...questions];
    const isCorrect = updated[qIndex].correctOptionIds.includes(optId);
    if (isCorrect) {
      updated[qIndex].correctOptionIds = updated[qIndex].correctOptionIds.filter(id => id !== optId);
    } else {
      updated[qIndex].correctOptionIds.push(optId);
    }
    setQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Validate that questions have text and at least 1 correct answer
    const isValid = questions.every(
      q => q.text.trim() && q.options.some(o => o.text.trim()) && q.correctOptionIds.length > 0
    );

    if (!isValid) {
      alert(t.recruiter.createQuizModal.validationAlert);
      return;
    }

    if (quizToEdit) {
      updateQuiz(quizToEdit.id, {
        title,
        category: category || 'General Skills',
        description,
        timeLimitMinutes,
        difficulty,
        supportedClassifications,
        questions,
      });
    } else {
      createQuiz({
        title,
        category: category || 'General Skills',
        description,
        timeLimitMinutes,
        difficulty,
        supportedClassifications,
        questions,
      });
    }

    onClose();
  };

  const currentAreaObj = areas.find(a => a.name === category) || orangeCountyAreas.find(a => a.name === category);
  const availableClassifications = currentAreaObj?.classifications || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-7 border border-slate-200 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900">
              {quizToEdit ? t.recruiter.createQuizModal.editTitle : t.recruiter.createQuizModal.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {quizToEdit ? t.recruiter.createQuizModal.editSubtitle : t.recruiter.createQuizModal.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto pr-1 py-4 space-y-6 flex-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                {t.recruiter.createQuizModal.fieldTitle} *
              </label>
              <input
                type="text"
                required
                placeholder={t.recruiter.createQuizModal.titlePlaceholder}
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <label className="text-xs font-semibold text-slate-800">
                  {t.recruiter.createQuizModal.fieldCategory} *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewAreaModal(true)}
                  className="text-xs font-bold text-[#2368f5] hover:text-[#144cc0] flex items-center gap-1 cursor-pointer transition-colors py-0.5 px-2 rounded-lg hover:bg-blue-50 shrink-0"
                  title={t.recruiter.createQuizModal.newAreaBtn}
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.recruiter.createQuizModal.newAreaBtn}</span>
                </button>
              </div>
              <select
                required
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5] bg-white font-medium"
              >
                <option value="">{t.recruiter.createQuizModal.selectCategoryPlaceholder}</option>
                {areas.map(a => (
                  <option key={a.id} value={a.name}>
                    {getLocalizedArea(a.name, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                {t.recruiter.createQuizModal.fieldTime}
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={timeLimitMinutes}
                onChange={e => setTimeLimitMinutes(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
              />
            </div>

            {/* Technical Difficulty Level */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                {t.recruiter.createQuizModal.fieldDifficulty} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDifficulty(1)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 min-h-[42px] rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    difficulty === 1
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Shield className={`w-4 h-4 shrink-0 ${difficulty === 1 ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span className="truncate">{t.recruiter.createQuizModal.diffLevel1}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDifficulty(2)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 min-h-[42px] rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    difficulty === 2
                      ? 'bg-blue-50 border-[#2368f5] text-[#2368f5] ring-2 ring-blue-500/20 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Zap className={`w-4 h-4 shrink-0 ${difficulty === 2 ? 'text-[#2368f5]' : 'text-slate-400'}`} />
                  <span className="truncate">{t.recruiter.createQuizModal.diffLevel2}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDifficulty(3)}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 min-h-[42px] rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    difficulty === 3
                      ? 'bg-purple-50 border-purple-500 text-purple-800 ring-2 ring-purple-500/20 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Award className={`w-4 h-4 shrink-0 ${difficulty === 3 ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="truncate">{t.recruiter.createQuizModal.diffLevel3}</span>
                </button>
              </div>
            </div>

            {/* Dependent County of Orange Classifications */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                <label className="text-xs font-semibold text-slate-800">
                  {t.recruiter.createQuizModal.supportedRolesLabel}
                </label>
                {availableClassifications.length > 0 && availableClassifications.some(c => !supportedClassifications.includes(c)) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSupportedClassifications(prev => Array.from(new Set([...prev, ...availableClassifications])));
                    }}
                    className="text-[11px] font-semibold text-[#2368f5] hover:text-[#144cc0] cursor-pointer"
                  >
                    + {language === 'es' ? 'Agregar todas las clasificaciones de esta área' : 'Add all classifications for this area'}
                  </button>
                )}
              </div>

              {availableClassifications.length > 0 ? (
                <div className="space-y-2">
                  <select
                    value=""
                    onChange={e => {
                      const val = e.target.value;
                      if (val && !supportedClassifications.includes(val)) {
                        setSupportedClassifications(prev => [...prev, val]);
                      }
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                  >
                    <option value="" disabled>
                      {t.recruiter.createQuizModal.selectRolesPlaceholder}
                    </option>
                    {availableClassifications
                      .filter(c => !supportedClassifications.includes(c))
                      .map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>

                  {/* Render chips */}
                  {supportedClassifications.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl max-h-32 overflow-y-auto">
                      {supportedClassifications.map(role => (
                        <span
                          key={role}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-[#2368f5] border border-blue-200 shadow-2xs"
                        >
                          <span className="truncate max-w-[200px] sm:max-w-xs">{role}</span>
                          <button
                            type="button"
                            onClick={() => setSupportedClassifications(prev => prev.filter(r => r !== role))}
                            className="text-blue-400 hover:text-blue-700 cursor-pointer shrink-0"
                            title="Remove role"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">
                      {t.recruiter.createQuizModal.noRolesAdded}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  {t.recruiter.createQuizModal.noRolesAdded}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                {t.recruiter.createQuizModal.fieldDescription}
              </label>
              <textarea
                rows={2}
                placeholder={t.recruiter.createQuizModal.descPlaceholder}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
              />
            </div>
          </div>

          {/* Questions Builder */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            {/* Feedback notification if CSV was imported */}
            {csvFeedback && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
                <span>{csvFeedback}</span>
                <button
                  type="button"
                  onClick={() => setCsvFeedback(null)}
                  className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {t.recruiter.createQuizModal.questionsTitle} ({questions.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  {t.recruiter.createQuizModal.optionsSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Download CSV Template */}
                <button
                  type="button"
                  onClick={downloadCsvTemplate}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-colors cursor-pointer min-h-[36px]"
                  title={t.recruiter.createQuizModal.csvTemplateTooltip}
                >
                  <Download className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>{t.recruiter.createQuizModal.csvTemplateBtn}</span>
                </button>

                {/* Import CSV */}
                <label className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition-colors cursor-pointer min-h-[36px]">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.recruiter.createQuizModal.uploadCsvBtn}</span>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCsvFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Add Manual Question */}
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-[#2368f5] text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200 min-h-[36px]"
                >
                  <PlusCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.recruiter.createQuizModal.addQuestionBtn}</span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {questions.map((q, qIndex) => (
                <div
                  key={q.id}
                  className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#2368f5] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>

                    <input
                      type="text"
                      required
                      placeholder={t.recruiter.createQuizModal.questionPlaceholder}
                      value={q.text}
                      onChange={e => handleQuestionTextChange(qIndex, e.target.value)}
                      className="flex-1 text-xs font-medium p-2.5 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                    />

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-lg cursor-pointer shrink-0"
                        title={t.recruiter.createQuizModal.removeQuestion}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sub-tag and Explanation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-0 sm:pl-9">
                    <input
                      type="text"
                      placeholder={t.recruiter.createQuizModal.categoryTagPlaceholder}
                      value={q.categoryTag || ''}
                      onChange={e => handleCategoryTagChange(qIndex, e.target.value)}
                      className="text-xs p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                    />
                    <input
                      type="text"
                      placeholder={t.recruiter.createQuizModal.explanationPlaceholder}
                      value={q.explanation || ''}
                      onChange={e => handleExplanationChange(qIndex, e.target.value)}
                      className="text-xs p-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                    />
                  </div>

                  {/* Options List */}
                  <div className="pl-0 sm:pl-9 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                      <span>{t.recruiter.createQuizModal.optionsLabel}</span>
                    </p>

                    {q.options.map((opt, optIndex) => {
                      const isCorrect = q.correctOptionIds.includes(opt.id);
                      return (
                        <div key={opt.id} className="flex items-center gap-2">
                          {/* Toggle correct answer checkbox/button */}
                          <button
                            type="button"
                            onClick={() => toggleCorrectOption(qIndex, opt.id)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-white text-slate-400 border border-slate-300 hover:text-slate-700'
                            }`}
                            title="Mark as correct answer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">
                              {isCorrect ? t.recruiter.createQuizModal.correctBadge : t.recruiter.createQuizModal.markBadge}
                            </span>
                          </button>

                          <input
                            type="text"
                            required
                            placeholder={`${t.recruiter.createQuizModal.optionPlaceholder} (${String.fromCharCode(65 + optIndex)})`}
                            value={opt.text}
                            onChange={e => handleOptionTextChange(qIndex, optIndex, e.target.value)}
                            className={`flex-1 text-xs p-2 rounded-xl bg-white border focus:outline-none focus:ring-1 ${
                              isCorrect
                                ? 'border-emerald-500 bg-emerald-50/20 focus:ring-emerald-600 font-medium'
                                : 'border-slate-300 focus:ring-[#2368f5]'
                            }`}
                          />

                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(qIndex, optIndex)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                              title={t.recruiter.createQuizModal.removeOption}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => handleAddOption(qIndex)}
                      className="text-[11px] font-bold text-[#2368f5] hover:text-[#144cc0] pt-1 cursor-pointer"
                    >
                      {t.recruiter.createQuizModal.addOptionBtn}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold bg-[#2368f5] text-white rounded-xl hover:bg-[#144cc0] transition-colors shadow-xs cursor-pointer"
            >
              {quizToEdit ? t.recruiter.createQuizModal.updateQuizBtn : t.recruiter.createQuizModal.saveQuizBtn}
            </button>
          </div>
        </form>
      </div>

      {/* Modal: Crear Nueva Área Dinámica */}
      {showNewAreaModal && (
        <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2368f5] flex items-center justify-center">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t.recruiter.createQuizModal.newAreaModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewAreaModal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAreaSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t.recruiter.createQuizModal.newAreaModal.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.recruiter.createQuizModal.newAreaModal.namePlaceholder}
                  value={newAreaName}
                  onChange={e => setNewAreaName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  {t.recruiter.createQuizModal.newAreaModal.descLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.recruiter.createQuizModal.newAreaModal.descPlaceholder}
                  value={newAreaDescription}
                  onChange={e => setNewAreaDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAreaModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {t.recruiter.createQuizModal.newAreaModal.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingArea || !newAreaName.trim()}
                  className="flex-1 py-2 text-xs font-bold bg-[#2368f5] text-white rounded-xl hover:bg-[#144cc0] disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                >
                  {isCreatingArea ? t.recruiter.createQuizModal.newAreaModal.savingBtn : t.recruiter.createQuizModal.newAreaModal.saveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
