import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PlusCircle, CheckCircle } from 'lucide-react';


export const TeacherDashboard: React.FC = () => {
  const { assignments, addAssignment, students } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Matemáticas');
  const [studentId, setStudentId] = useState('s1');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [dueTime, setDueTime] = useState('11:59 PM');
  const [instructions, setInstructions] = useState('');
  const [sourceLms, setSourceLms] = useState<'Google Classroom' | 'Canvas'>('Google Classroom');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedStudent = students.find(s => s.id === studentId);

    addAssignment({
      studentId,
      studentName: selectedStudent ? selectedStudent.name : 'Estudiante',
      title,
      subject,
      dueDate,
      dueTime,
      sourceLms,
      status: 'due-soon',
      instructions,
      teacherName: 'Prof. Vance',
    });

    setIsModalOpen(false);
    setTitle('');
    setInstructions('');
  };

  const teacherAssignments = assignments.filter(a => a.teacherName?.includes('Vance'));

  return (
    <div className="space-y-6">
      {/* Teacher Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              Portal Docente
            </span>
            <span className="text-xs text-[#52697C]">West Valley High School</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A2332]">
            Prof. Vance — Departamento de Ciencias & Matemáticas
          </h1>
          <p className="text-xs text-[#52697C]">
            Gestión de tareas, calificaciones y permisos escolares
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nueva Asignación</span>
        </button>
      </div>

      {/* Grid: Teacher classes overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#E8E4DF]">
          <span className="text-xs font-semibold text-[#52697C] uppercase">Curso Activo</span>
          <p className="text-lg font-bold text-[#1A2332] mt-1">Álgebra II (Periodo 3)</p>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3.5 h-3.5" /> 28 Estudiantes sincronizados con Google Classroom
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E4DF]">
          <span className="text-xs font-semibold text-[#52697C] uppercase">Asignaciones en Curso</span>
          <p className="text-lg font-bold text-[#1A2332] mt-1">{teacherAssignments.length} Actividades</p>
          <p className="text-xs text-[#52697C] mt-2">1 alerta de entrega vencida</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E8E4DF]">
          <span className="text-xs font-semibold text-[#52697C] uppercase">Cumplimiento / E-Sign</span>
          <p className="text-lg font-bold text-[#1A2332] mt-1">1 Permiso Emitido</p>
          <p className="text-xs text-amber-600 mt-2 font-medium">Excursión al Observatorio</p>
        </div>
      </div>

      {/* List of assignments under Prof. Vance */}
      <div className="bg-white rounded-2xl border border-[#E8E4DF] p-5 shadow-xs">
        <h2 className="text-base font-bold text-[#1A2332] mb-4">
          Tareas Asignadas Recientemente
        </h2>

        <div className="space-y-3">
          {teacherAssignments.map(a => (
            <div
              key={a.id}
              className="p-4 rounded-xl border border-[#E8E4DF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-gray-100 text-[#1A2332]">
                    {a.subject}
                  </span>
                  <span className="text-xs text-[#52697C]">Estudiante: {a.studentName}</span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                    {a.sourceLms}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1A2332] mt-1">{a.title}</h3>
                <p className="text-xs text-[#52697C]">Vence: {a.dueDate} ({a.dueTime})</p>
              </div>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  a.status === 'missing'
                    ? 'bg-[#FFE4DC] text-[#FF6B54]'
                    : a.status === 'submitted'
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {a.status === 'missing'
                  ? 'Sin entregar (Alerta a padres enviada)'
                  : a.status === 'submitted'
                  ? 'Entregada por el alumno'
                  : 'En plazo de entrega'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4DF] shadow-xl">
            <h3 className="text-lg font-bold text-[#1A2332] mb-1">
              Publicar Nueva Asignación Escolar
            </h3>
            <p className="text-xs text-[#52697C] mb-4">
              Se sincronizará en tiempo real con Google Classroom y aparecerá en el panel familiar OrbitLearn
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                  Título de la Asignación
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Álgebra: Prueba de Ecuaciones Cuadráticas"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF] focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                    Materia
                  </label>
                  <select
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                  >
                    <option>Matemáticas</option>
                    <option>Ciencias</option>
                    <option>Biología</option>
                    <option>Física</option>
                    <option>Historia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                    Estudiante Asignado
                  </label>
                  <select
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.grade.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                    Fecha de Entrega
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                  >
                  </input>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                    Hora Límite
                  </label>
                  <input
                    type="text"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                  Plataforma de Sincronización
                </label>
                <select
                  value={sourceLms}
                  onChange={e => setSourceLms(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                >
                  <option value="Google Classroom">Google Classroom (Real-time Sync)</option>
                  <option value="Canvas">Canvas LMS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                  Instrucciones o Criterios de Evaluación
                </label>
                <textarea
                  rows={3}
                  placeholder="Detallar entregables requeridos..."
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF] focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-xs font-semibold text-[#52697C] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                >
                  Publicar y Notificar a Familia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
