# 🧠 QuizGenius AI - Frontend

![QuizGenius AI](public/logo.png)

**QuizGenius AI** es una plataforma educativa inteligente que permite a estudiantes subir documentos PDF para generar automáticamente cuestionarios y flashcards usando inteligencia artificial. La aplicación facilita el aprendizaje personalizado para estudiantes.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Registro y Login funcional** con validación
- **Protección de rutas** con middleware
- **Gestión de sesiones** persistente

### 📚 Módulos Educativos
- **📂 Upload**: Subida de documentos PDF y procesamiento automático
- **🧠 Quiz**: Cuestionarios interactivos con feedback inmediato
- **🃏 Flashcards**: Sistema de repaso con tarjetas de estudio
- **⚙️ Settings**: Configuración de perfil y preferencias

### 👥 Gestión de Usuarios
- **🎓 Estudiante**: Acceso completo a herramientas de estudio

## 🛠 Tecnologías Utilizadas

### Frontend Framework
- **Next.js 15.2.4** - Framework React con SSR
- **React 19** - Biblioteca de componentes
- **TypeScript 5** - Tipado estático

### UI/UX
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **Radix UI** - Componentes accesibles y personalizables
- **Lucide React** - Iconos vectoriales
- **Next Themes** - Soporte para modo oscuro/claro

### Formularios y Validación
- **React Hook Form 7.54.1** - Gestión de formularios
- **Zod 3.24.1** - Validación de esquemas
- **@hookform/resolvers** - Integración con validadores

### Gráficos y Visualización
- **Recharts 2.15.0** - Gráficos interactivos
- **Date-fns 4.1.0** - Manipulación de fechas

### Componentes Adicionales
- **Sonner** - Sistema de notificaciones toast
- **Vaul** - Componentes de drawer
- **React Resizable Panels** - Paneles redimensionables
- **Embla Carousel** - Carrusel de componentes

## 📁 Estructura del Proyecto

```
QuizGenius-AI/
├── app/                          # App Router de Next.js
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   ├── login/                   # Página de login
│   ├── register/                # Página de registro
│   ├── choose-topics/           # Selección de temas
│   ├── dashboard/               # Dashboard principal
│   │   └── [workspaceId]/       # Rutas dinámicas por workspace
│   └── settings/                # Configuraciones
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes de UI base
│   ├── voiceflow-widget/        # Widget de chat de Voiceflow
│   ├── PrivateRoute.tsx         # Protección de rutas
│   ├── RootLayoutContent.tsx    # Contenido del layout
│   ├── Sidebar.tsx              # Barra lateral
│   └── theme-provider.tsx       # Proveedor de temas
├── hooks/                       # Custom hooks
├── lib/                         # Librerías y utilidades
│   ├── auth-context.tsx         # Contexto de autenticación
│   ├── types.ts                 # Tipos TypeScript
│   ├── user-utils.ts            # Utilidades de usuario
│   └── utils.ts                 # Utilidades generales
├── public/                      # Archivos estáticos
├── styles/                      # Estilos adicionales
└── types/                       # Definiciones de tipos
```

## 🚦 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **pnpm** (gestor de paquetes recomendado)

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd QuizGenius-AI
```

### 2. Instalar dependencias
```bash
pnpm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:
```env
# Variables de entorno del frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_VOICEFLOW_PROJECT_ID=your_voiceflow_project_id
```

### 4. Ejecutar en modo desarrollo
```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

### Roles y Permisos

#### 🎓 Estudiante (student)
- Acceso a dashboard personal
- Subida de documentos
- Realización de quizzes
- Uso de flashcards
- Visualización de progreso personal

## 🤖 Integración con Voiceflow

El proyecto incluye un widget de chat inteligente:
- **Asistente virtual** para ayuda contextual
- **Procesamiento de voz** para interacción natural
- **Respuestas contextuales** basadas en la página actual

## 📊 Funcionalidades por Módulo

### 📂 Upload Module
- Subida de archivos PDF con drag & drop
- Validación de formato y tamaño
- Procesamiento automático con IA
- Extracción de conceptos clave
- Generación automática de preguntas

### 🧠 Quiz Module
- Preguntas de opción múltiple
- Feedback inmediato
- Sistema de puntuación
- Estadísticas de rendimiento
- Modo práctica y evaluación

### 🃏 Flashcards Module
- Tarjetas de estudio interactivas
- Sistema de repetición espaciada
- Categorización por dificultad
- Progreso de memorización
- Exportación de tarjetas

## 🔧 Configuración Avanzada

### Personalización de Componentes UI
Los componentes están construidos sobre Radix UI y pueden personalizarse en:
```
components/ui/
```

### Configuración de Tailwind
Personaliza el tema en:
```javascript
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      colors: {
        // Colores personalizados
      }
    }
  }
}
```

### Configuración de Next.js
Ajustes adicionales en:
```javascript
// next.config.mjs
const nextConfig = {
  // Configuraciones personalizadas
}