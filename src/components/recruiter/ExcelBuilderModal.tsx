import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileSpreadsheet,
  UploadCloud,
  Clock,
  Briefcase,
  AlertCircle,
  FileText,
  Check,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { getLocalizedArea } from '../../utils/areaLocalization';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelBuilderModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createExcelAssessment, areas, t, language } = useApp();

  const [title, setTitle] = useState('');
  const [departmentArea, setDepartmentArea] = useState<string>(
    areas[0]?.name || 'Accounting'
  );
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(30);
  const [description, setDescription] = useState('');
  const [instructionsText, setInstructionsText] = useState('');
  const [templateFileName, setTemplateFileName] = useState('');
  const [templateFileUrl, setTemplateFileUrl] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setTemplateFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setTemplateFileUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage(
        language === 'es' ? 'El título de la tarea es obligatorio.' : 'Assessment title is required.'
      );
      return;
    }

    if (!description.trim()) {
      setErrorMessage(
        language === 'es'
          ? 'La descripción de la tarea es obligatoria.'
          : 'Task description is required.'
      );
      return;
    }

    const instructions = instructionsText
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean);

    if (instructions.length === 0) {
      setErrorMessage(
        language === 'es'
          ? 'Por favor escribe al menos una instrucción para el postulante.'
          : 'Please provide at least one step-by-step instruction.'
      );
      return;
    }

    // Default template file name if none uploaded
    const finalFileName = templateFileName || `${title.toLowerCase().replace(/\s+/g, '_')}_template.xlsx`;
    const finalFileUrl =
      templateFileUrl ||
      'data:text/csv;charset=utf-8,' +
        encodeURIComponent(
          `SkillProof Practical Assessment: ${title}\nInstructions: ${instructions.join('; ')}\nItem,Category,Budget,Actual,Variance\nSample A,Operations,1000,950,=C4-D4\nSample B,Marketing,1500,1620,=C5-D5\n`
        );

    createExcelAssessment({
      title: title.trim(),
      departmentArea,
      timeLimitMinutes: Number(timeLimitMinutes) || 30,
      description: description.trim(),
      instructions: instructionsText.trim(),
      templateFileName: finalFileName,
      templateFileData: finalFileUrl,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setInstructionsText('');
      setTemplateFileName('');
      setTemplateFileUrl(undefined);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 border border-slate-200 shadow-2xl max-h-[92vh] overflow-y-auto my-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {t.recruiter.excel.createTaskModalTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {language === 'es'
                  ? 'Configura tareas prácticas con descarga de libro plantilla y entrega de archivo'
                  : 'Define hands-on spreadsheet tasks with downloadable template workbooks'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSaved ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {language === 'es'
                ? 'Tarea de Excel creada con éxito'
                : 'Excel Task Created Successfully'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'es'
                ? 'Ahora puedes asignarla a cualquier postulante.'
                : 'You can now assign this task to candidates.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.recruiter.excel.fieldTitle}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={t.recruiter.excel.fieldTitlePlaceholder}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5]"
              />
            </div>

            {/* Department & Time limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-[#2368f5]" />
                  <span>{t.recruiter.excel.fieldArea}</span>
                </label>
                <CustomSelect
                  value={departmentArea}
                  onChange={val => setDepartmentArea(val)}
                  className="w-full"
                  options={areas.map(a => ({
                    value: a.name,
                    label: getLocalizedArea(a.name, language),
                  }))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.recruiter.excel.fieldTime}</span>
                </label>
                <CustomSelect
                  value={String(timeLimitMinutes)}
                  onChange={val => setTimeLimitMinutes(Number(val))}
                  className="w-full"
                  options={[
                    { value: '15', label: '15 min (Express)' },
                    { value: '30', label: '30 min (Standard)' },
                    { value: '45', label: '45 min (Comprehensive)' },
                    { value: '60', label: '60 min (Advanced Modeling)' },
                  ]}
                />
              </div>
            </div>

            {/* Summary Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {t.recruiter.excel.fieldDesc}
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder={t.recruiter.excel.fieldDescPlaceholder}
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5] resize-none"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#2368f5]" />
                  <span>{t.recruiter.excel.fieldInstructions}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  {language === 'es' ? '1 instrucción por línea' : '1 instruction per line'}
                </span>
              </label>
              <textarea
                required
                rows={4}
                value={instructionsText}
                onChange={e => setInstructionsText(e.target.value)}
                placeholder={t.recruiter.excel.fieldInstructionsPlaceholder}
                className="w-full text-xs p-3 font-mono rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2368f5]/20 focus:border-[#2368f5] resize-none"
              />
            </div>

            {/* Template File Attachment */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>{t.recruiter.excel.fieldTemplateFile}</span>
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="w-full sm:w-auto px-4 py-2.5 bg-white border border-slate-300 hover:border-emerald-500 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>{t.recruiter.excel.uploadFileBtn}</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {templateFileName ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 truncate max-w-full">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{templateFileName}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTemplateFileName('');
                        setTemplateFileUrl(undefined);
                      }}
                      className="p-1 hover:text-rose-600 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">
                    {language === 'es'
                      ? 'Si no adjuntas un archivo, se creará una plantilla estándar de prueba automáticamente.'
                      : 'If no file is attached, a default testing template workbook will be generated automatically.'}
                  </span>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>{t.recruiter.excel.saveTaskBtn}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
