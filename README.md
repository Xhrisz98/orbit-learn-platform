# TalentScreen — MVP (Pre-Employment Assessment & Talent Filtering Platform)

Plataforma SaaS de evaluación de habilidades pre-empleo diseñada para agencias y empresas de reclutamiento que conectan talento calificado con empleadores.

---

## 🎯 Propósito del Sistema

Filtrar objetivamente a los postulantes mediante pruebas estandarizadas de opción múltiple antes de presentarlos a las empresas contratantes.

### Funcionalidades por Rol:

#### 1. 💼 Rol Reclutador (Recruiter)
- **Creador de Cuestionarios (Quiz Builder):**
  - Creación dinámica de pruebas de opción múltiple.
  - Soporte para preguntas con una o múltiples respuestas válidas.
  - Ponderación y tiempo límite opcional.
- **Directorio de Candidatos (Talent Pool):**
  - Registro de candidatos y perfil al que postulan.
  - Asignación de evaluaciones personalizadas.
- **Pipeline de Resultados & Scoring Automatizado:**
  - Cálculo instantáneo de aciertos: $\text{Score} = \left(\frac{\text{Aciertos}}{\text{Total Preguntas}}\right) \times 100$.
  - Seguimiento por etapas: **Pendiente (Awaiting Candidate)** y **Completado (Evaluation Completed)**.
  - Clasificación de talento: **Calificado / Apto ($\ge 75\%$)** vs. **En Revisión ($< 75\%$)**.
  - **Auditoría de Respuestas:** Modal para inspeccionar pregunta por pregunta qué seleccionó el postulante versus las respuestas correctas y sus justificaciones.

#### 2. 🎓 Rol Candidato (Candidate Portal)
- Interfaz limpia, enfocada y sin distracciones para resolver pruebas técnicas.
- Selección interactiva de opciones con soporte para selección simple y múltiple.
- Calificación y feedback instantáneo al finalizar la prueba.
- **Selector Demo de Candidato:** Permite probar el flujo alternando entre diferentes candidatos con pruebas pendientes o completadas.

---

## 🌐 Soporte Bilingüe & Adaptabilidad Responsiva
- **Inglés como idioma predeterminado (`EN`)** y **Español secundario (`ES`)** con selector en tiempo real.
- Diseño optimizado para dispositivos móviles, tablets y monitores de escritorio.

---

## 🛠️ Stack Tecnológico
- **Frontend:** React 19 + TypeScript + Vite 8
- **Estilos:** Tailwind CSS v4
- **Iconografía:** Lucide React
- **Persistencia:** React Context API + LocalStorage

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```
