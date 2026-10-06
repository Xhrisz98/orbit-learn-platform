# OrbitLearn — MVP (One platform. All your students' learning.)

Bienvenido al repositorio del **MVP de OrbitLearn**, la plataforma unificada para el ecosistema educativo familiar, agregación de tareas escolares (Google Classroom, Canvas, Schoology), marketplace verificado de tutores, gestión de autorizaciones escolares (E-Signatures FERPA) y mensajería integral.

---

## 🚀 Características Implementadas en el MVP

### 1. Conmutador Dinámico Multi-Rol (Role Switcher)
Permite alternar en tiempo real sin recargar entre los 4 actores del sistema:
- **👨‍👩‍👧‍👦 Padres (Parent):** Vista agregada multihijo (Alex & Jordan), alertas de tareas vencidas, recomendaciones inteligentes y búsqueda de tutores.
- **📚 Estudiantes (Student):** Agenda/planner unificado, checklist de tareas y modal de entrega con soporte para Google Drive.
- **👨‍🏫 Profesores (Teacher):** Creación de asignaciones con sincronización simulada de Google Classroom / Canvas y seguimiento de entregas.
- **⭐ Tutores & Proveedores (Tutor):** Perfil verificado, calendario de disponibilidad, control de reservas y cálculo de ganancias.

### 2. Agregador Académico y Panel Multihijo
- Detección proactiva de tareas vencidas o faltantes (*Missing: 3 assignments*).
- Filtros por materia, estado (faltantes, próximas, entregadas) y búsqueda en tiempo real.
- Botón de **Sincronización LMS en tiempo real** (Google Classroom & Canvas).

### 3. Marketplace de Tutores ("Zillow para Educación")
- Búsqueda y filtrado por materias (Matemáticas, SAT Prep, Biología, Literatura, Programación).
- Perfiles con insignia de verificación y antecedentes (*FERPA & Background Checked*).
- **Flujo de Reserva y Pago:** Selección de hijo, franja horaria y confirmación inmediata.

### 4. Centro de Cumplimiento Escolar (E-Signatures)
- Bandeja de permisos escolares y consentimientos institucionales.
- **Lienzo de Firma Digital (HTML5 Canvas)** interactivo para firmar con ratón/touch o mediante nombre manuscrito.
- Generación de sello de auditoría legal conforme a normativas FERPA/COPPA.

### 5. Centro de Mensajes Familiares
- Canales directos entre Padres, Profesores y Tutores organizados por estudiante.
- Envío y recepción de mensajes en tiempo real con persistencia en `localStorage`.

### 6. Landing Page Comercial Interactiva
- Conversión fiel del diseño de lanzamiento de OrbitLearn integrado dentro de la misma aplicación, permitiendo saltar a la prueba del producto con un clic.

---

## 🛠️ Stack Tecnológico

- **Framework:** React 19 + TypeScript + Vite 8
- **Estilos:** Tailwind CSS v4 (con paleta corporativa: Teal `#0D8B8B`, Coral `#FF6B54`, Crema `#F8F6F3`)
- **Iconografía:** Lucide React
- **Persistencia:** React Context API + LocalStorage

---

## ⚡ Cómo Ejecutar el Proyecto

```bash
# 1. Instalar dependencias (ya instaladas en el entorno)
npm install

# 2. Iniciar servidor de desarrollo local
npm run dev

# 3. Compilar para producción
npm run build
```
