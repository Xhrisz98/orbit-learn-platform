import { supabase } from '../lib/supabase';
import type { QuizArea } from '../types';
import { orangeCountyAreas } from '../data/orangeCountyData';

export const initialDefaultAreas: QuizArea[] = [
  ...orangeCountyAreas,
  {
    id: 'area-tech',
    name: 'Tecnología & Software',
    description: 'Desarrollo Frontend/Backend, Cloud Infrastructure, DevOps, Redes y Ciberseguridad.',
    icon: 'Laptop',
  },
  {
    id: 'area-trades',
    name: 'Operaciones & Oficios Técnicos',
    description: 'Electricidad Industrial, Mecánica, Mantenimiento de Planta, Soldadura y Sistemas HVAC.',
    icon: 'Wrench',
  },
  {
    id: 'area-health',
    name: 'Salud & Clínica',
    description: 'Procedimientos clínicos, Farmacología, Enfermería, Asistencia Médica y Normas HIPAA.',
    icon: 'HeartPulse',
  },
  {
    id: 'area-finance',
    name: 'Finanzas & Contabilidad',
    description: 'Auditoría Financiera, Normas NIIF/IFRS, Impuestos Corporativos y Modelación Financiera.',
    icon: 'TrendingUp',
  },
  {
    id: 'area-sales',
    name: 'Ventas & Marketing Digital',
    description: 'Prospección B2B, Growth Marketing, Gestión de CRM, Estrategia SEM/SEO y Negociación.',
    icon: 'Megaphone',
  },
  {
    id: 'area-hr',
    name: 'Recursos Humanos & Gestión',
    description: 'Reclutamiento Técnico, Legislación Laboral, Compensaciones y Clima Organizacional.',
    icon: 'Users',
  },
];

export const areaService = {
  async getAll(): Promise<QuizArea[]> {
    const { data, error } = await supabase
      .from('quiz_areas')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Could not fetch quiz_areas from Supabase, using defaults:', error.message);
      return initialDefaultAreas;
    }

    if (!data || data.length === 0) {
      return initialDefaultAreas;
    }

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      icon: item.icon || 'Briefcase',
      classifications:
        item.classifications ||
        orangeCountyAreas.find(
          a => a.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        )?.classifications ||
        [],
      createdAt: item.created_at ? item.created_at.split('T')[0] : '',
    }));
  },

  async create(name: string, description: string = '', icon: string = 'Briefcase'): Promise<QuizArea> {
    const { data, error } = await supabase
      .from('quiz_areas')
      .insert({
        name: name.trim(),
        description: description.trim(),
        icon: icon.trim(),
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      icon: data.icon || 'Briefcase',
      createdAt: data.created_at ? data.created_at.split('T')[0] : '',
    };
  },

  async delete(areaId: string): Promise<void> {
    const { error } = await supabase
      .from('quiz_areas')
      .delete()
      .eq('id', areaId);

    if (error) throw error;
  },
};
