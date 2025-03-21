# Aplicación de Películas y Series - Frontend

## Descripción
Este es el frontend de una aplicación web para gestionar películas y series. Permite a los usuarios registrarse, iniciar sesión, y gestionar sus listas de películas y series favoritas, vistas y pendientes. La aplicación también muestra las películas y series más populares de la semana, del año y de todos los tiempos. Ver los detalles de cada pelicula o serie. Hacer comentarios y verlos en una feed. 

## Tecnologías Utilizadas
- **React**: Biblioteca para construir interfaces de usuario
- **React Router**: Navegación entre páginas
- **Axios**: Cliente HTTP para realizar peticiones a la API
- **Tailwind CSS**: Framework de CSS para el diseño
- **DaisyUI**: Componentes de UI basados en Tailwind
- **React Icons**: Iconos para la interfaz de usuario

## Estructura del Proyecto
```
final-project-frontend/
├── public/             # Archivos públicos
├── src/                # Código fuente
│   ├── api/            # Configuración de Axios y peticiones a la API
│   ├── components/     # Componentes reutilizables
│   ├── context/        # Contextos de React (autenticación, etc.)
│   ├── pages/          # Páginas de la aplicación
│   │   ├── top-pages/  # Páginas de tops (semana, año, histórico)
│   │   ├── DetailsPage.jsx    # Página de detalles
│   │   ├── FeedPage.jsx       # Feed principal
│   │   ├── HomePage.jsx       # Página de inicio
│   │   ├── LikesPage.jsx      # Página de favoritos
│   │   ├── LoginPage.jsx      # Página de inicio de sesión
│   │   ├── NotFoundPage.jsx   # Página 404
│   │   ├── PendingPage.jsx    # Página de pendientes
│   │   ├── ProfilePage.jsx    # Perfil de usuario
│   │   ├── SignupPage.jsx     # Página de registro
│   │   ├── UserSettingsPage.jsx # Configuración de usuario
│   │   └── ViewedPage.jsx     # Página de vistos
│   ├── services/       # Servicios (autenticación, etc.)
│   ├── App.css         # Estilos de la aplicación
│   ├── App.jsx         # Componente principal
│   ├── index.css       # Estilos globales
│   └── index.jsx       # Punto de entrada
├── .env                # Variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── package.json        # Dependencias del proyecto
├── README.md           # Documentación
└── tailwind.config.js  # Configuración de Tailwind CSS
```

## Funcionalidades

### Autenticación
- Registro de usuario
- Inicio de sesión
- Cierre de sesión
- Protección de rutas privadas

### Gestión de Películas y Series
- Ver detalles de películas y series
- Marcar como favorito
- Marcar como visto
- Añadir a pendientes
- Ver listas personalizadas (favoritos, vistos, pendientes)

### Exploración
- Feed principal con recomendaciones
- Top películas de la semana
- Top películas del año
- Top películas históricas
- Top series de la semana
- Top series del año
- Top series históricas

### Perfil de Usuario
- Ver y editar información del perfil
- Ver estadísticas de visualización
- Gestionar listas personalizadas

## Licencia
Este proyecto está bajo la Licencia MIT.
