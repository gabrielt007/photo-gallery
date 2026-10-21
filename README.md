# 📸 Photo Gallery — DAM Deber 03

> **Aplicación móvil de galería fotográfica** desarrollada con **Ionic + Angular + Capacitor**  
> Materia: Desarrollo de Aplicaciones Móviles (DAM) · 5to Semestre · EPN  
> Autor: **Toaquiza**

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías y Dependencias](#-tecnologías-y-dependencias)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Ejecución](#-ejecución)
- [Permisos Android](#-permisos-android)
- [Descripción de Componentes](#-descripción-de-componentes)
- [Flujo de Datos](#-flujo-de-datos)
- [Scripts Disponibles](#-scripts-disponibles)
- [Notas de Desarrollo](#-notas-de-desarrollo)

---

## 📖 Descripción

**Photo Gallery** es una aplicación móvil híbrida que permite al usuario **capturar fotografías** con la cámara del dispositivo y visualizarlas en una galería en cuadrícula. Las fotos capturadas se **persisten localmente** usando el sistema de archivos del dispositivo y las preferencias de Capacitor, de modo que permanecen disponibles incluso después de cerrar y reabrir la aplicación.

El proyecto sigue el tutorial oficial de Ionic Framework y fue extendido con funcionalidades adicionales como la **eliminación de fotos** y guardado en la galería del dispositivo.

---

## ✨ Características

| Característica | Descripción |
|---|---|
| 📷 **Captura de fotos** | Abre la cámara nativa del dispositivo para tomar fotos |
| 🖼️ **Galería en cuadrícula** | Muestra todas las fotos en un grid de 2 columnas |
| 💾 **Persistencia local** | Las fotos se guardan en el sistema de archivos y en `Preferences` |
| 🗑️ **Eliminación de fotos** | Botón de papelera sobre cada foto para eliminarla |
| 📱 **Cross-platform** | Funciona en navegador web y en Android |
| 🔄 **Estado reactivo** | Uso de Angular Signals para manejo de estado sin boilerplate |
| 💿 **Guardado en galería** | Las fotos se guardan también en la galería nativa del dispositivo |

---

## 🛠️ Tecnologías y Dependencias

### Stack Principal

| Tecnología | Versión | Rol |
|---|---|---|
| Angular | `22.1.7` | Framework frontend (SPA) |
| Ionic Framework | `^9.0.0` | UI Components móviles |
| Capacitor | `8.5.3` | Bridge nativo (Android/iOS) |
| TypeScript | `~6.0.0` | Lenguaje principal |

### Plugins de Capacitor

| Plugin | Versión | Función |
|---|---|---|
| `@capacitor/camera` | `^8.2.5` | Acceso a la cámara nativa |
| `@capacitor/filesystem` | `^8.1.4` | Lectura/escritura de archivos |
| `@capacitor/preferences` | `^8.0.1` | Almacenamiento clave-valor persistente |
| `@capacitor/android` | `8.5.3` | Soporte para plataforma Android |
| `@capacitor-community/media` | `^9.1.0` | Acceso a la galería del sistema |
| `@capacitor/app` | `8.1.2` | Ciclo de vida de la app |
| `@capacitor/haptics` | `8.0.2` | Retroalimentación háptica |
| `@capacitor/keyboard` | `8.0.6` | Control del teclado virtual |
| `@capacitor/status-bar` | `8.0.4` | Control de la barra de estado |

### Herramientas de Desarrollo

| Herramienta | Versión | Uso |
|---|---|---|
| Angular CLI | `22.1.8` | Scaffolding y build |
| Capacitor CLI | `8.5.3` | Sincronización con plataformas nativas |
| ESLint + angular-eslint | `22.5.0` | Linting de código |
| Vitest | `~4.0.18` | Testing unitario |

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────┐
│                  Angular App                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    │
│  │  Tab 1   │ │  Tab 2   │ │  Tab 3   │    │
│  │(Explore) │ │(Gallery) │ │(Explore) │    │
│  └──────────┘ └────┬─────┘ └──────────┘    │
│                    │                        │
│          ┌─────────▼──────────┐             │
│          │   PhotoService     │             │
│          │  (Angular Signal)  │             │
│          └─────────┬──────────┘             │
└────────────────────┼────────────────────────┘
                     │ Capacitor Bridge
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    @cap/camera  @cap/filesystem @cap/preferences
    (Cámara)     (Archivos)      (Persistencia KV)
```

### Patrón de Diseño

- **Service Layer**: `PhotoService` centraliza toda la lógica de negocio (captura, guardado, carga, eliminación).
- **Reactive State**: Angular `signal<UserPhoto[]>` para un manejo de estado más ligero que RxJS.
- **Standalone Components**: Todos los componentes usan `imports: [...]` directamente sin módulos NgModule.
- **Lazy Loading**: Las rutas de tabs se cargan de forma diferida mediante `loadChildren`.

---

## 📁 Estructura de Carpetas

```
photo-gallery/
├── android/                        # Proyecto Android nativo (Capacitor)
│   └── app/src/main/
│       └── AndroidManifest.xml     # Permisos y configuración Android
├── src/
│   ├── app/
│   │   ├── services/
│   │   │   └── photo.service.ts    # ⭐ Lógica principal de la galería
│   │   ├── tab1/                   # Tab 1 – Pantalla de exploración
│   │   ├── tab2/                   # Tab 2 – Galería de fotos (funcionalidad principal)
│   │   │   ├── tab2.page.html      # Template de la galería
│   │   │   ├── tab2.page.ts        # Controlador del componente
│   │   │   └── tab2.page.scss      # Estilos de la galería
│   │   ├── tab3/                   # Tab 3 – Pantalla de exploración
│   │   ├── tabs/                   # Componente raíz con la barra de tabs
│   │   ├── explore-container/      # Componente placeholder reutilizable
│   │   ├── app.component.ts        # Componente raíz de la app
│   │   └── app.routes.ts           # Configuración de rutas
│   ├── assets/                     # Recursos estáticos
│   ├── environments/               # Variables de entorno (dev/prod)
│   ├── theme/
│   │   └── variables.css           # Variables de tema Ionic
│   ├── global.scss                 # Estilos globales
│   └── index.html                  # Punto de entrada HTML
├── capacitor.config.ts             # Configuración de Capacitor
├── ionic.config.json               # Configuración de Ionic CLI
├── angular.json                    # Configuración del workspace Angular
├── package.json                    # Dependencias y scripts npm
└── tsconfig.json                   # Configuración de TypeScript
```

---

## ✅ Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** — `npm install -g @angular/cli`
- **Ionic CLI** — `npm install -g @ionic/cli`
- **Android Studio** (para build/deploy Android)
- **JDK 17+** (requerido por Android Studio)

```bash
# Verificar versiones
node -v
npm -v
ng version
ionic --version
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd photo-gallery
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Sincronizar con plataformas nativas

```bash
npx cap sync android
```

---

## ▶️ Ejecución

### Web (Navegador)

```bash
ionic serve
# o equivalentemente:
npm start
```

La aplicación estará disponible en `http://localhost:8100`.

> **Nota**: En el navegador, el plugin `@capacitor/camera` usará la cámara web mediante PWA Elements, ya configurado en `main.ts`.

### Android (Dispositivo / Emulador)

```bash
# 1. Build de la app web
npm run build

# 2. Sincronizar al proyecto Android
npx cap sync android

# 3. Abrir en Android Studio
npx cap open android
```

#### Live Reload en Android

```bash
ionic cap run android --livereload --external
```

---

## 🔑 Permisos Android

Declarados en `android/app/src/main/AndroidManifest.xml`:

| Permiso | Motivo |
|---|---|
| `INTERNET` | Comunicación web y carga de recursos |
| `CAMERA` | Captura de fotos con la cámara nativa |
| `READ_EXTERNAL_STORAGE` *(max API 32)* | Leer archivos en Android 12 e inferior |
| `WRITE_EXTERNAL_STORAGE` *(max API 28)* | Escribir archivos en Android 9 e inferior |
| `READ_MEDIA_IMAGES` | Leer imágenes en Android 13+ |
| `READ_MEDIA_VIDEO` | Leer videos en Android 13+ |
| `MANAGE_MEDIA` | Eliminar fotos de la galería en Android 11+ |

---

## 🧩 Descripción de Componentes

### `PhotoService`

**Archivo**: `src/app/services/photo.service.ts`

Servicio `Injectable` que centraliza toda la lógica de la galería.

#### Estado reactivo

```typescript
public photos = signal<UserPhoto[]>([]);
```

Utiliza **Angular Signals** para actualizar la vista automáticamente sin necesidad de RxJS.

#### Métodos Públicos

| Método | Descripción |
|---|---|
| `addNewToGallery()` | Abre la cámara, captura la foto, la guarda y actualiza el signal |
| `deletePicture(photo, position)` | Elimina la foto del signal, Preferences y filesystem |
| `loadSaved()` | Carga las fotos persistidas al iniciar la app |

#### Métodos Privados

| Método | Descripción |
|---|---|
| `savePicture(photo)` | Convierte la URI a base64 y escribe en `Directory.Data` |
| `base64FromPath(path)` | Obtiene el base64 de una imagen desde su webPath |

#### Interfaz de datos

```typescript
export interface UserPhoto {
  filepath: string;      // Nombre del archivo en Directory.Data
  webviewPath?: string;  // URI temporal o base64 para mostrar en la vista
}
```

---

### `Tab2Page` (Galería)

**Archivos**: `src/app/tab2/tab2.page.ts` · `tab2.page.html` · `tab2.page.scss`

Componente principal que muestra la galería.

#### Comportamiento

| Método | Descripción |
|---|---|
| `ngOnInit()` | Llama a `loadSaved()` para cargar las fotos al iniciar |
| `addPhotoToGallery()` | Delega en `PhotoService.addNewToGallery()` |
| `deletePhoto(photo, position)` | Delega en `PhotoService.deletePicture()` |

#### Estilos clave

```scss
.photo-container {
  position: relative;

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;    /* Recorte uniforme */
    border-radius: 8px;
  }

  .delete-btn {
    position: absolute;   /* Botón flotante sobre la imagen */
    top: 6px;
    right: 6px;
    --border-radius: 50%; /* Forma circular */
  }
}
```

---

## 🔄 Flujo de Datos

### Inicio de la App

```
ngOnInit → loadSaved()
    ├─ Preferences.get('photos') → lista JSON
    └─ Filesystem.readFile() × N → base64 data
              └─ photos.set([...]) → Renderiza grid
```

### Captura de Foto

```
FAB click → addNewToGallery()
    ├─ Camera.getPhoto() → { webPath }
    ├─ savePicture() → escribe archivo en Directory.Data
    ├─ photos.update() → inserta foto al inicio del signal
    └─ Preferences.set() → persiste lista como JSON
```

### Eliminación de Foto

```
Trash click → deletePhoto(photo, position)
    ├─ photos.update(filter) → elimina del signal
    ├─ Preferences.set() → persiste lista actualizada
    └─ Filesystem.deleteFile() → elimina archivo físico
```

---

## 📜 Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| `start` | `ng serve` | Servidor de desarrollo |
| `build` | `ng build` | Build de producción en `/www` |
| `watch` | `ng build --watch` | Build en modo watch |
| `test` | `ng test` | Pruebas unitarias con Vitest |
| `lint` | `ng lint` | Análisis estático con ESLint |

---

## 📝 Notas de Desarrollo

### Angular Signals vs RxJS

Este proyecto usa **Angular Signals** (`signal<T>`) en lugar de `BehaviorSubject`. Son más simples y la vista se actualiza automáticamente:

```typescript
// Lectura en el template (notación de llamada de función)
@for (photo of photoService.photos(); track photo.filepath)

// Escritura en el servicio
this.photos.update((photos) => [newPhoto, ...photos]);
```

### Persistencia en Dos Capas

| Capa | Tecnología | Almacena |
|---|---|---|
| Bytes de imagen | `@capacitor/filesystem` (Directory.Data) | Archivos JPEG privados |
| Lista de fotos | `@capacitor/preferences` | JSON con rutas y metadatos |

### Standalone Components

El proyecto usa la arquitectura moderna de Angular sin `NgModule`. Cada componente declara sus importaciones directamente:

```typescript
@Component({
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, ...],
})
```

---

## 📄 Licencia

Proyecto académico — Escuela Politécnica Nacional (EPN)  
Desarrollo de Aplicaciones Móviles · 5to Semestre · 2025

---

*Construido con ❤️ usando Ionic Framework + Angular + Capacitor*
