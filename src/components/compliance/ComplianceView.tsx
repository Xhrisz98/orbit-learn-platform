import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import type { PermissionSlip } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  PenTool,
  Lock,
  Download,
} from 'lucide-react';


export const ComplianceView: React.FC = () => {
  const { permissionSlips, signPermissionSlip } = useApp();
  const [selectedSlipForSigning, setSelectedSlipForSigning] = useState<PermissionSlip | null>(null);
  const [signerName, setSignerName] = useState('Mark Miller (Padre)');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('Mark Miller');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const pendingSlips = permissionSlips.filter(s => s.status === 'pending');
  const signedSlips = permissionSlips.filter(s => s.status === 'signed');

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = '#0D8B8B';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirmSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlipForSigning) return;

    let signatureData = typedSignature;
    if (signatureMode === 'draw' && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL();
    }

    signPermissionSlip(selectedSlipForSigning.id, signerName, signatureData);
    setSelectedSlipForSigning(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#E8E4DF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-[#0D8B8B]">
              Centro de Cumplimiento Escolar
            </span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> FERPA Compliant & COPPA Ready
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A2332]">
            Permisos Escolares y E-Signatures
          </h1>
          <p className="text-xs text-[#52697C]">
            Firma autorizaciones de paseos, consentimientos de salud y acuerdos escolares con validez legal y pista de auditoría.
          </p>
        </div>
      </div>

      {/* Pending Slips */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#1A2332] flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Pendientes de Firma ({pendingSlips.length})</span>
        </h2>

        {pendingSlips.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E4DF] p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1A2332]">¡Todo al día!</p>
            <p className="text-xs text-[#52697C]">No tienes autorizaciones escolares pendientes de firma.</p>
          </div>
        ) : (
          pendingSlips.map(slip => (
            <div
              key={slip.id}
              className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFE4DC] text-[#FF6B54]">
                    Requiere Firma de Padres
                  </span>
                  <span className="text-xs text-[#52697C]">Para: {slip.studentName}</span>
                  <span className="text-xs text-[#52697C]">• {slip.school}</span>
                </div>
                <h3 className="font-bold text-base text-[#1A2332]">{slip.title}</h3>
                <p className="text-xs text-[#52697C] max-w-2xl">{slip.description}</p>
                <p className="text-[11px] text-amber-700 font-medium">
                  Fecha límite: {slip.deadline} • Emitido por: {slip.issuer}
                </p>
              </div>

              <button
                onClick={() => setSelectedSlipForSigning(slip)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#0D8B8B] text-white text-xs font-semibold rounded-xl hover:bg-[#096363] transition-colors shadow-xs cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Firmar Digitalmente</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Signed History */}
      <div className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-[#1A2332] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Documentos Firmados y Archivados ({signedSlips.length})</span>
        </h2>

        <div className="space-y-3">
          {signedSlips.map(slip => (
            <div
              key={slip.id}
              className="bg-white rounded-2xl border border-[#E8E4DF] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1A2332]">{slip.title}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    ✓ Firmado
                  </span>
                </div>
                <p className="text-[#52697C] mt-1">
                  Estudiante: {slip.studentName} • Firmado por: {slip.signedBy} el {slip.signedAt}
                </p>
                <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                  ID de Auditoría Legal: {slip.ferpaAuditId}
                </p>
              </div>

              <button
                onClick={() => alert(`Descargando copia legal certificada (${slip.ferpaAuditId})`)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E8E4DF] text-[#1A2332] hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#0D8B8B]" />
                <span>Descargar PDF</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Signature Modal */}
      {selectedSlipForSigning && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E8E4DF] shadow-2xl">
            <div className="flex justify-between items-start pb-3 border-b border-[#E8E4DF]">
              <div>
                <h3 className="text-lg font-bold text-[#1A2332]">
                  Firma Electrónica de Permiso
                </h3>
                <p className="text-xs text-[#52697C]">{selectedSlipForSigning.title}</p>
              </div>
              <button
                onClick={() => setSelectedSlipForSigning(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSign} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#1A2332] mb-1">
                  Nombre Completo del Padre o Tutor Legal
                </label>
                <input
                  type="text"
                  required
                  value={signerName}
                  onChange={e => setSignerName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E4DF]"
                />
              </div>

              {/* Mode Selector: Draw vs Type */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureMode('draw')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                    signatureMode === 'draw' ? 'bg-[#0D8B8B] text-white' : 'bg-gray-100 text-[#52697C]'
                  }`}
                >
                  Dibujar Firma
                </button>
                <button
                  type="button"
                  onClick={() => setSignatureMode('type')}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold cursor-pointer ${
                    signatureMode === 'type' ? 'bg-[#0D8B8B] text-white' : 'bg-gray-100 text-[#52697C]'
                  }`}
                >
                  Escribir Firma
                </button>
              </div>

              {/* Signature Canvas */}
              {signatureMode === 'draw' ? (
                <div>
                  <div className="border border-dashed border-[#0D8B8B] rounded-xl bg-gray-50/50 relative overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={120}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="w-full h-32 cursor-crosshair bg-white"
                    />
                    {!hasDrawn && (
                      <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 pointer-events-none">
                        Firma aquí con el cursor o el dedo
                      </span>
                    )}
                  </div>
                  <div className="text-right mt-1">
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="text-[11px] text-[#52697C] hover:underline cursor-pointer"
                    >
                      Limpiar trazo
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={e => setTypedSignature(e.target.value)}
                    className="w-full text-lg font-serif italic p-3 rounded-xl border border-[#E8E4DF] bg-gray-50 text-[#0D8B8B]"
                  />
                </div>
              )}

              {/* Legal Notice */}
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 text-[11px] text-[#096363] flex items-start gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>
                  Al hacer clic en "Confirmar Firma", declaras bajo juramento ser el padre/tutor legal de {selectedSlipForSigning.studentName}. Se registrará una marca de tiempo y firma criptográfica según la Ley ESIGN y FERPA.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSlipForSigning(null)}
                  className="flex-1 py-2 text-xs font-semibold text-[#52697C] hover:bg-gray-100 rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-[#0D8B8B] text-white rounded-xl hover:bg-[#096363] transition-colors shadow-xs cursor-pointer"
                >
                  Confirmar y Firmar Permiso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
