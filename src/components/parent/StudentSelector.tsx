import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, AlertTriangle } from 'lucide-react';

export const StudentSelector: React.FC = () => {
  const { students, activeStudentId, setActiveStudentId, assignments } = useApp();

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-xs font-semibold text-[#52697C] uppercase tracking-wider mr-1">
        Ver datos de:
      </span>

      {/* Button: Todos los Hijos */}
      <button
        onClick={() => setActiveStudentId('all')}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          activeStudentId === 'all'
            ? 'bg-[#0D8B8B] text-white shadow-xs'
            : 'bg-white text-[#1A2332] border border-[#E8E4DF] hover:bg-gray-50'
        }`}
      >
        <Users className="w-3.5 h-3.5" />
        <span>Todos ({students.length} hijos)</span>
      </button>

      {/* Each Child */}
      {students.map(student => {
        const missingCount = assignments.filter(
          a => a.studentId === student.id && a.status === 'missing'
        ).length;

        const isSelected = activeStudentId === student.id;

        return (
          <button
            key={student.id}
            onClick={() => setActiveStudentId(student.id)}
            className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-[#0D8B8B] text-white shadow-xs'
                : 'bg-white text-[#1A2332] border border-[#E8E4DF] hover:bg-gray-50'
            }`}
          >
            <img
              src={student.avatar}
              alt={student.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span>{student.name}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-[#52697C]'
              }`}
            >
              {student.grade.split(' ')[0]}
            </span>

            {missingCount > 0 && (
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-[#FF6B54] text-white'
                    : 'bg-[#FFE4DC] text-[#FF6B54]'
                }`}
                title={`${missingCount} tareas vencidas`}
              >
                <AlertTriangle className="w-2.5 h-2.5" />
                {missingCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
