import type { Language } from '../i18n/translations';

const areaTranslations: Record<string, { en: string; es: string }> = {
  'Tecnología & Software': {
    en: 'Technology & Software',
    es: 'Tecnología & Software',
  },
  'Technology & Software': {
    en: 'Technology & Software',
    es: 'Tecnología & Software',
  },
  'Operaciones & Oficios Técnicos': {
    en: 'Operations & Technical Trades',
    es: 'Operaciones & Oficios Técnicos',
  },
  'Operations & Technical Trades': {
    en: 'Operations & Technical Trades',
    es: 'Operaciones & Oficios Técnicos',
  },
  'Salud & Clínica': {
    en: 'Healthcare & Clinical',
    es: 'Salud & Clínica',
  },
  'Healthcare & Clinical': {
    en: 'Healthcare & Clinical',
    es: 'Salud & Clínica',
  },
  'Finanzas & Contabilidad': {
    en: 'Finance & Accounting',
    es: 'Finanzas & Contabilidad',
  },
  'Finance & Accounting': {
    en: 'Finance & Accounting',
    es: 'Finanzas & Contabilidad',
  },
  'Ventas & Marketing Digital': {
    en: 'Sales & Digital Marketing',
    es: 'Ventas & Marketing Digital',
  },
  'Sales & Digital Marketing': {
    en: 'Sales & Digital Marketing',
    es: 'Ventas & Marketing Digital',
  },
  'Recursos Humanos & Gestión': {
    en: 'Human Resources & Management',
    es: 'Recursos Humanos & Gestión',
  },
  'Human Resources & Management': {
    en: 'Human Resources & Management',
    es: 'Recursos Humanos & Gestión',
  },
  'Mantenimiento & Maquinaria Pesada': {
    en: 'Maintenance & Heavy Equipment',
    es: 'Mantenimiento & Maquinaria Pesada',
  },
  'Maintenance & Heavy Equipment': {
    en: 'Maintenance & Heavy Equipment',
    es: 'Mantenimiento & Maquinaria Pesada',
  },
  'Gestión Vial & Superintendencia': {
    en: 'Roadway Management & Superintendency',
    es: 'Gestión Vial & Superintendencia',
  },
  'Roadway Management & Superintendency': {
    en: 'Roadway Management & Superintendency',
    es: 'Gestión Vial & Superintendencia',
  },
  'General Skills': {
    en: 'General Skills',
    es: 'Habilidades Generales',
  },
  'Habilidades Generales': {
    en: 'General Skills',
    es: 'Habilidades Generales',
  },
  'Industrial Electrician & Trade Systems Bank': {
    en: 'Industrial Electrician & Trade Systems Bank',
    es: 'Banco de Electricidad Industrial y Sistemas de Oficio',
  },
  'IT Systems, Networking & Cloud Infrastructure Bank': {
    en: 'IT Systems, Networking & Cloud Infrastructure Bank',
    es: 'Banco de Sistemas IT, Redes e Infraestructura Cloud',
  },
  'Healthcare & Clinical Safety Knowledge Bank': {
    en: 'Healthcare & Clinical Safety Knowledge Bank',
    es: 'Banco de Salud y Seguridad Clínica',
  },
  'Concrete Finisher & Curb Systems Assessment': {
    en: 'Concrete Finisher & Curb Systems Assessment',
    es: 'Evaluación de Acabador de Concreto y Sistemas de Bordillos',
  },
  'Cemex Assessments - Heavy Equipment & Truck Mechanic': {
    en: 'Cemex Assessments - Heavy Equipment & Truck Mechanic',
    es: 'Evaluación Cemex - Mecánico de Camiones y Equipo Pesado',
  },
  'Construction Equipment Mechanic - Diagnostic & Systems Assessment': {
    en: 'Construction Equipment Mechanic - Diagnostic & Systems Assessment',
    es: 'Mecánico de Equipo de Construcción - Diagnóstico y Sistemas',
  },
  'Roadway Superintendent - Construction Operations & Safety': {
    en: 'Roadway Superintendent - Construction Operations & Safety',
    es: 'Superintendente Vial - Operaciones de Construcción y Seguridad',
  },
  'Universal Heavy Equipment Operator - Field Competencies': {
    en: 'Universal Heavy Equipment Operator - Field Competencies',
    es: 'Operador Universal de Equipo Pesado - Competencias de Campo',
  },
  'Curb Profiles & Standards': {
    en: 'Curb Profiles & Standards',
    es: 'Perfiles de Bordillo y Normas',
  },
  'FDOT & ADA Specifications': {
    en: 'FDOT & ADA Specifications',
    es: 'Especificaciones FDOT y ADA',
  },
  'Concrete Mix & Placement': {
    en: 'Concrete Mix & Placement',
    es: 'Mezcla y Colocación de Concreto',
  },
  'Tolerances & Quality': {
    en: 'Tolerances & Quality',
    es: 'Tolerancias y Calidad',
  },
  'Joints & Cracking Control': {
    en: 'Joints & Cracking Control',
    es: 'Juntas y Control de Fisuras',
  },
  'Heavy Drivetrain & Gearboxes': {
    en: 'Heavy Drivetrain & Gearboxes',
    es: 'Tren Motriz Pesado y Cajas Reductoras',
  },
  'Hydraulic Actuators': {
    en: 'Hydraulic Actuators',
    es: 'Actuadores Hidráulicos',
  },
  'Drum Rotation & Hydrostatic Drive': {
    en: 'Drum Rotation & Hydrostatic Drive',
    es: 'Rotación del Tambor y Mando Hidrostático',
  },
  'Internal Components & Wear': {
    en: 'Internal Components & Wear',
    es: 'Componentes Internos y Desgaste',
  },
  'Confined Space & Drum LOTO': {
    en: 'Confined Space & Drum LOTO',
    es: 'Espacio Confinado y Bloqueo LOTO',
  },
  'Preventive Maintenance': {
    en: 'Preventive Maintenance',
    es: 'Mantenimiento Preventivo',
  },
  'Workplace Safety & LOTO': {
    en: 'Workplace Safety & LOTO',
    es: 'Seguridad en el Trabajo y LOTO',
  },
  'DOT Regulations': {
    en: 'DOT Regulations',
    es: 'Normas y Regulaciones DOT',
  },
  'Electronic Diagnostics': {
    en: 'Electronic Diagnostics',
    es: 'Diagnóstico Electrónico',
  },
  'Hydraulic Systems': {
    en: 'Hydraulic Systems',
    es: 'Sistemas Hidráulicos',
  },
  'Engine Cooling Systems': {
    en: 'Engine Cooling Systems',
    es: 'Sistemas de Refrigeración de Motor',
  },
  'Fasteners & Hardware': {
    en: 'Fasteners & Hardware',
    es: 'Fijaciones y Tornillería',
  },
  'Electrical Diagnostic Tools': {
    en: 'Electrical Diagnostic Tools',
    es: 'Herramientas de Diagnóstico Eléctrico',
  },
  'Heavy Equipment Electrical (24V)': {
    en: 'Heavy Equipment Electrical (24V)',
    es: 'Electricidad de Maquinaria Pesada (24V)',
  },
  'CAN Bus Diagnostics (J1939)': {
    en: 'CAN Bus Diagnostics (J1939)',
    es: 'Diagnóstico de Red CAN Bus (J1939)',
  },
  'HVAC & Climate Control': {
    en: 'HVAC & Climate Control',
    es: 'HVAC y Control de Climatización',
  },
  'High-Pressure Hydraulic Safety': {
    en: 'High-Pressure Hydraulic Safety',
    es: 'Seguridad en Hidráulica de Alta Presión',
  },
  'Diesel Aftertreatment Systems': {
    en: 'Diesel Aftertreatment Systems',
    es: 'Sistemas de Postratamiento Diésel',
  },
  'Construction Operations': {
    en: 'Construction Operations',
    es: 'Operaciones de Construcción',
  },
  'Stakeholder Relations': {
    en: 'Stakeholder Relations',
    es: 'Relaciones con Interesados e Inspectores',
  },
  'Proactive Resolution': {
    en: 'Proactive Resolution',
    es: 'Resolución Proactiva de Problemas',
  },
  'Management Tools': {
    en: 'Management Tools',
    es: 'Herramientas de Gestión y Software',
  },
  'Safety Measures': {
    en: 'Safety Measures',
    es: 'Medidas de Seguridad en Obra',
  },
  'Dozer Operations': {
    en: 'Dozer Operations',
    es: 'Operación de Bulldozer',
  },
  'Motor Grader Operations': {
    en: 'Motor Grader Operations',
    es: 'Operación de Motoniveladora',
  },
  'Excavator Safety': {
    en: 'Excavator Safety',
    es: 'Seguridad con Excavadora',
  },
  'Emergency Response': {
    en: 'Emergency Response',
    es: 'Respuesta ante Emergencias',
  },
  'Blueprints & Civil Plans': {
    en: 'Blueprints & Civil Plans',
    es: 'Planos y Lectura de Topografía',
  },
};

export function getLocalizedArea(name: string, lang: Language): string {
  if (!name) return name;
  const match = areaTranslations[name.trim()];
  if (match) {
    return match[lang] || name;
  }
  return name;
}
