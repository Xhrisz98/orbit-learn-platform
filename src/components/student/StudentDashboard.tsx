import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  Clock,
  UploadCloud,
  FileText,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';


export const StudentDashboard: React.FC = () => {
  const { assignments, submitAssignment } = useApp();
  const [selectedStudent, setSelectedStudent] = useState<'s1' | 's2'>('s1');
  const [uploadModalAssignmentId, setUploadModalAssignmentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [driveLink, setDriveLink] = useState('');

  // Get assignments for current student
  const studentAssignments = assignments.filter(a => a.studentId === selectedStudent);
  const pendingAssignments = studentAssignments.filter(a => a.status === 'missing' || a.status === 'due-soon');
  const completedAssignments = studentAssignments.filter(a => a.status === 'submitted' || a.status === 'graded');

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadModalAssignmentId) {
      const finalFileName = fileName || driveLink || 'Mi_Tarea_Entregada.pdf';
      submitAssignment(uploadModalAssignmentId, finalFileName);
      setUploadModalAssignmentId(null);
      setFileName('');
      setDriveLink('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
              Modo Estudiante
            </span>
            <span className="text-xs text-[#52697C]">Planner y Entregas Escolares</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A2332]">
            {selectedStudent === 's1' ? 'Alex Miller — 10th Grade' : 'Jordan Miller — 7th Grade'}
          </h1>
          <p className="text-xs text-[#52697C]">
            {selectedStudent === 's1' ? 'West Valley High School • GPA 3.6' : 'Oakridge Middle School • GPA 3.8'}
          </p>
        </div>

        {/* Toggle between Alex and Jordan for demo */}
        <div className="flex items-center gap-1 bg-[#F8F6F3] p-1 rounded-xl border border-[#E8E4DF]">
          <button
            onClick={() => setSelectedStudent('s1')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedStudent === 's1'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[#52697C] hover:text-[#1A2332]'
            }`}
          >
            Alex (High School)
          </button>
          <button
            onClick={() => setSelectedStudent('s2')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              selectedStudent === 's2'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-[#52697C] hover:text-[#1A2332]'
            }`}
          >
            Jordan (Middle School)
          </button>
        </div>
      </div>

      {/* Grid: Tasks + Integration Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (2 cols): Pending Tasks / Planner */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-[#1A2332] flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>Tareas Pendientes & Vencidas ({pendingAssignments.length})</span>
              </h2>
            </div>

            <div className="space-y-3">
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1A2332]">¡Felicidades, estás al día!</p>
                  <p className="text-xs text-[#52697C]">No tienes tareas pendientes en este momento.</p>
                </div>
              ) : (
                pendingAssignments.map(a => (
                  <div
                    key={a.id}
                    className="p-4 rounded-xl border border-[#E8E4DF] bg-[#F8F6F3]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-indigo-200 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-700">
                          {a.subject}
                        </span>
                        <span className="text-[10px] text-[#52697C]">
                          Vence: {a.dueDate} {a.dueTime && `(${a.dueTime})`}
                        </span>
                        {a.status === 'missing' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#FFE4DC] text-[#FF6B54]">
                            ¡Vencida!
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-[#1A2332] mt-1">{a.title}</h3>
                      {a.instructions && (
                        <p className="text-xs text-[#52697C] mt-0.5 line-clamp-1">{a.instructions}</p>
                      )}
                    </div>

                    <button
                      onClick={() => setUploadModalAssignmentId(a.id)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Entregar Tarea</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed / Submitted Tasks */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
            <h2 className="text-base font-bold text-[#1A2332] mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Tareas Entregadas y Calificadas ({completedAssignments.length})</span>
            </h2>

            <div className="space-y-2">
              {completedAssignments.map(a => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl border border-gray-100 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-semibold text-[#1A2332]">{a.title}</span>
                      <span className="text-[#52697C] ml-2">• {a.subject}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {a.grade ? (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Nota: {a.grade}
                      </span>
                    ) : (
                      <span className="text-gray-500 font-medium">Entregado</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Google Drive & Tools */}
        <div className="space-y-4">
          {/* Google Workspace Card */}
          <div className="bg-white p-5 rounded-2xl border border-[#E8E4DF] shadow-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#0D8B8B] flex items-center justify-center">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1A2332]">Google Workspace</h3>
                <p className="text-[11px] text-[#52697C]">Conectado a tu cuenta estudiantil</p>
              </div>
            </div>

            <p className="text-xs text-[#52697C] mb-4">
              Crea o vincula documentos de Google Docs, Sheets o Slides directamente en tus entregas sin salir de OrbitLearn.
            </p>

            <div className="space-y-2">
              <a
                href="https://docs.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[#E8E4DF] text-xs font-semibold text-[#1A2332] hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-blue-500" />
                <span>Crear nuevo Google Doc</span>
              </a>
            </div>
          </div>

          {/* Quick Study Tip */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
            <h3 className="font-bold text-sm text-indigo-950 mb-1">
              💡 Consejo de Estudio Orbit
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed">
              Recuerda desglosar las tareas grandes en sesiones de 25 minutos (Pomodoro). La entrega de Álgebra vence mañana, ¡revisa tus notas con tiempo!
            </p>
          </div>
        </div>
      </div>

      {/* Homework Upload Modal */}
      {uploadModalAssignmentId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#E8E4DF] shadow-xl">
            <h3 className="text-lg font-bold text-[#1A2332] mb-1">
              Entregar Asignación
            </h3>
            <p className="text-xs text-[#52697C] mb-4">
              Sube tu archivo PDF o pega tu enlace de Google Drive / Classroom
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                  Nombre del Archivo o Documento
                </label>
                <input
                  type="text"
                  placeholder="Ej: algebra_ejercicios_cap4_alex.pdf"
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                  O Enlace de Google Drive / Docs
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/document/d/..."
                  value={driveLink}
                  onChange={e => setDriveLink(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF] focus:outline-none focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadModalAssignmentId(null)}
                  className="flex-1 py-2 text-xs font-semibold text-[#52697C] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                >
                  Confirmar Entrega
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
