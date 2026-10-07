import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { Quiz, Question } from '../../types';
import { PlusCircle, Trash2, CheckCircle2, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  quizToEdit?: Quiz | null;
}

export const QuizBuilderModal: React.FC<Props> = ({ isOpen, onClose, quizToEdit }) => {
  const { createQuiz, updateQuiz, t } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(20);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (quizToEdit) {
        setTitle(quizToEdit.title);
        setCategory(quizToEdit.category);
        setDescription(quizToEdit.description);
        setTimeLimitMinutes(quizToEdit.timeLimitMinutes || 20);
        setQuestions(JSON.parse(JSON.stringify(quizToEdit.questions)));
      } else {
        setTitle('');
        setCategory('');
        setDescription('');
        setTimeLimitMinutes(20);
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
  }, [isOpen, quizToEdit]);

  if (!isOpen) return null;

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
      alert('Please make sure every question has text, valid option labels, and at least one marked correct answer.');
      return;
    }

    if (quizToEdit) {
      updateQuiz(quizToEdit.id, {
        title,
        category: category || 'General Skills',
        description,
        timeLimitMinutes,
        questions,
      });
    } else {
      createQuiz({
        title,
        category: category || 'General Skills',
        description,
        timeLimitMinutes,
        questions,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 border border-slate-200 shadow-2xl my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {quizToEdit ? t.recruiter.createQuizModal.editTitle : t.recruiter.createQuizModal.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {quizToEdit ? t.recruiter.createQuizModal.editSubtitle : t.recruiter.createQuizModal.subtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
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
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                {t.recruiter.createQuizModal.fieldCategory}
              </label>
              <input
                type="text"
                placeholder={t.recruiter.createQuizModal.categoryPlaceholder}
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#2368f5]"
              />
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  {t.recruiter.createQuizModal.questionsTitle} ({questions.length})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Multiple-choice with single or multi-correct answer keys
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-[#2368f5] text-xs font-bold rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.recruiter.createQuizModal.addQuestionBtn}</span>
              </button>
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
                              {isCorrect ? 'Correct' : 'Mark'}
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
                              className="text-slate-400 hover:text-red-500 text-xs px-1 cursor-pointer"
                            >
                              ✕
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
    </div>
  );
};
