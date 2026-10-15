import type { AssessmentAssignment, Quiz } from '../types';
import type { Language } from '../i18n/translations';
import { getLocalizedArea } from './areaLocalization';

export function exportScorecardToPdf(
  assignment: AssessmentAssignment,
  quiz?: Quiz,
  language: Language = 'es'
) {
  const isEs = language === 'es';
  const questionsToAudit = quiz
    ? assignment.selectedQuestionIds && assignment.selectedQuestionIds.length > 0
      ? quiz.questions.filter(q => assignment.selectedQuestionIds!.includes(q.id))
      : quiz.questions
    : [];

  const score = assignment.score ?? 0;
  
  // Review Status
  let statusBadge = '';
  let statusColor = '#0284c7';
  if (assignment.reviewStatus === 'approved') {
    statusBadge = isEs ? 'APROBADO' : 'APPROVED';
    statusColor = '#16a34a';
  } else if (assignment.reviewStatus === 'rejected' || score < 50) {
    statusBadge = isEs ? 'RECHAZADO' : 'REJECTED';
    statusColor = '#dc2626';
  } else {
    statusBadge = 'STAND BY';
    statusColor = '#d97706';
  }

  const dateStr = assignment.completedAt || new Date().toLocaleDateString();

  const questionsHtml = questionsToAudit
    .map((q, idx) => {
      const userSelectedIds = (assignment.answers && assignment.answers[q.id]) || [];
      const correctIds = q.correctOptionIds || [];
      const isCorrect =
        userSelectedIds.length === correctIds.length &&
        userSelectedIds.slice().sort().every((val: string, i: number) => val === correctIds.slice().sort()[i]);

      const optionsHtml = q.options
        .map(opt => {
          const wasSelected = userSelectedIds.includes(opt.id);
          const isOptionKey = correctIds.includes(opt.id);

          let optBorder = '#e2e8f0';
          let optBg = '#ffffff';
          let optColor = '#334155';
          let tag = '';

          if (isOptionKey && wasSelected) {
            optBorder = '#86efac';
            optBg = '#f0fdf4';
            optColor = '#166534';
            tag = isEs ? 'Respuesta Correcta' : 'Selected Correct';
          } else if (wasSelected && !isOptionKey) {
            optBorder = '#fca5a5';
            optBg = '#fef2f2';
            optColor = '#991b1b';
            tag = isEs ? 'Selección Incorrecta' : 'Selected Wrong';
          } else if (!wasSelected && isOptionKey) {
            optBorder = '#fde68a';
            optBg = '#fefce8';
            optColor = '#854d0e';
            tag = isEs ? 'Clave Esperada' : 'Expected Key';
          }

          return `
            <div style="padding: 7px 10px; margin-bottom: 5px; border-radius: 6px; border: 1px solid ${optBorder}; background: ${optBg}; color: ${optColor}; font-size: 11px; display: flex; justify-content: space-between; align-items: center;">
              <span><strong>${opt.id.split('-').pop()?.toUpperCase() || ''}.</strong> ${opt.text}</span>
              ${tag ? `<span style="font-weight: 700; font-size: 10px; text-transform: uppercase;">${tag}</span>` : ''}
            </div>
          `;
        })
        .join('');

      const cleanText = q.text.replace(/!\[.*?\]\((.*?)\)/g, '').trim();
      const imageUrl = q.imageUrl || q.text.match(/!\[.*?\]\((.*?)\)/)?.[1];

      return `
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 14px; page-break-inside: avoid; background: ${isCorrect ? '#f8fafc' : '#fffafb'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-weight: 700; font-size: 12px; color: #0f172a;">
              <span style="color: #2563eb;">#${idx + 1}.</span> ${cleanText}
            </div>
            <span style="padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; background: ${isCorrect ? '#dcfce7' : '#fee2e2'}; color: ${isCorrect ? '#15803d' : '#b91c1c'}; shrink: 0;">
              ${isCorrect ? (isEs ? 'ACIERTO (+1)' : 'CORRECT (+1)') : (isEs ? 'INCORRECTO (0)' : 'INCORRECT (0)')}
            </span>
          </div>

          ${imageUrl ? `<div style="text-align: center; margin: 8px 0;"><img src="${imageUrl}" style="max-height: 140px; max-width: 100%; border-radius: 6px; border: 1px solid #e2e8f0;" /></div>` : ''}

          <div style="margin-top: 8px;">
            ${optionsHtml}
          </div>

          ${q.explanation ? `
            <div style="margin-top: 8px; padding: 6px 10px; border-radius: 6px; background: #f1f5f9; font-size: 10.5px; color: #475569; font-style: italic;">
              <strong>${isEs ? 'Explicación Técnica:' : 'Technical Rationale:'}</strong> ${q.explanation}
            </div>
          ` : ''}
        </div>
      `;
    })
    .join('');

  const reportHtml = `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="utf-8">
      <title>SkillProof_Scorecard_${assignment.candidateName.replace(/\s+/g, '_')}_${dateStr.replace(/[/\\:]/g, '-')}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #0f172a;
          margin: 0;
          padding: 0;
          line-height: 1.4;
          background: #ffffff;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }
        .brand {
          font-size: 22px;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.5px;
        }
        .badge {
          display: inline-block;
          background: #eff6ff;
          color: #2563eb;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          text-transform: uppercase;
        }
        .meta-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 14px;
          margin-bottom: 20px;
        }
        .score-box {
          text-align: center;
          border-left: 2px solid #cbd5e1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .score-num {
          font-size: 38px;
          font-weight: 900;
          color: ${statusColor};
          line-height: 1;
        }
        .status-pill {
          margin-top: 6px;
          font-size: 11px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 6px;
          background: ${statusColor}15;
          color: ${statusColor};
          border: 1px solid ${statusColor}40;
        }
        .section-title {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #334155;
          margin-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 4px;
        }
        .footer {
          margin-top: 24px;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          font-size: 10px;
          color: #64748b;
          display: flex;
          justify-content: space-between;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">SkillProof <span style="color: #2563eb;">Enterprise</span></div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${isEs ? 'Reporte Oficial de Evaluación Técnica y Certificación de Habilidades' : 'Official Technical Assessment & Skills Certification Scorecard'}
          </div>
        </div>
        <div style="text-align: right;">
          <span class="badge">Verified Audit Record</span>
          <div style="font-size: 10px; color: #64748b; margin-top: 4px;">ID: ${assignment.id.substring(0, 13)}...</div>
        </div>
      </div>

      <div class="meta-grid">
        <div>
          <div style="font-size: 16px; font-weight: 800; color: #0f172a;">${assignment.candidateName}</div>
          <div style="font-size: 12px; color: #2563eb; font-weight: 600;">${assignment.roleApplied || 'Technical Candidate'}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Email: ${assignment.candidateEmail}</div>
          <div style="font-size: 11px; color: #334155; margin-top: 8px;">
            <strong>${isEs ? 'Evaluación:' : 'Assessment:'}</strong> ${getLocalizedArea(assignment.quizTitle, language)}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            <strong>${isEs ? 'Fecha de Realización:' : 'Completion Date:'}</strong> ${dateStr}
          </div>
        </div>

        <div class="score-box">
          <div style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b;">${isEs ? 'Puntaje Obtenido' : 'Overall Score'}</div>
          <div class="score-num">${score}%</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">${assignment.correctAnswersCount ?? 0} / ${assignment.totalQuestions} ${isEs ? 'aciertos' : 'correct'}</div>
          <div class="status-pill">${statusBadge}</div>
        </div>
      </div>

      <div class="section-title">
        ${isEs ? 'Desglose Detallado Pregunta por Pregunta' : 'Detailed Question-by-Question Audit'} (${questionsToAudit.length} ${isEs ? 'preguntas' : 'questions'})
      </div>

      <div>
        ${questionsHtml}
      </div>

      <div class="footer">
        <span>SkillProof Verified Assessment Engine • ID: ${assignment.id}</span>
        <span>${isEs ? 'Generado el' : 'Generated on'} ${new Date().toLocaleString()}</span>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
  }
}
