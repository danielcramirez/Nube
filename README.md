# 🌐 Mapa Mental: Servicios en la Nube

Aplicación web interactiva para explicar los diferentes modelos de servicios en la nube: **IaaS**, **PaaS**, **SaaS** y **CaaS**.

## 🎯 Características

- 🗺️ **Vista Mapa Mental**: Visualización interactiva con nodo central y servicios distribuidos
- 📊 **Vista Comparativa**: Tabla detallada con responsabilidades, ventajas y desventajas
- 🔍 **Búsqueda en tiempo real**: Resalta términos en todo el contenido
- 📱 **Diseño responsivo**: Optimizado para desktop, tablet y móvil
- 🎨 **Interfaz moderna**: Diseñado con Bootstrap 5 y animaciones suaves
- 🖨️ **Función de impresión**: Para uso en presentaciones

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework de interfaz de usuario
- **Framer Motion** - Animaciones fluidas
- **Bootstrap 5** - Framework CSS moderno
- **Lucide React** - Iconos vectoriales
- **Vite** - Bundler y servidor de desarrollo
- **TailwindCSS** - Utilidades CSS adicionales

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/danielcramirez/Nube.git
   cd Nube
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

### Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción

## 📚 Contenido Educativo

### Servicios Cubiertos

1. **IaaS (Infrastructure as a Service)**
   - Control máximo sobre infraestructura
   - Ejemplos: AWS EC2, Azure VMs, Google Compute Engine

2. **PaaS (Platform as a Service)**
   - Plataforma gestionada para desarrollo
   - Ejemplos: App Engine, Azure App Service, Heroku

3. **SaaS (Software as a Service)**
   - Aplicación completa lista para usar
   - Ejemplos: Google Workspace, Microsoft 365, Salesforce

4. **CaaS (Containers as a Service)**
   - Orquestación de contenedores
   - Ejemplos: GKE, EKS, AKS, OpenShift

### Analogías Pedagógicas

Cada servicio incluye analogías con **"la casa"** para facilitar la comprensión:
- **IaaS**: Contratas la infraestructura, gestionas todo lo demás
- **PaaS**: Casa amueblada, solo traes tu código
- **SaaS**: Casa completa con servicios incluidos
- **CaaS**: Casa lista, traes tus contenedores

## 🎓 Uso Educativo

### Sugerencias Didácticas

1. **Secuencia recomendada**: SaaS → PaaS/CaaS → IaaS
2. **Enfatizar**: Quién gestiona qué en cada modelo
3. **Usar**: Analogías de la casa para fijar conceptos
4. **Mostrar**: Tabla comparativa para pros y contras

### Funcionalidades para Clase

- Panel de detalles con información completa
- Búsqueda para destacar conceptos específicos
- Vista comparativa para análisis lado a lado
- Función de impresión para material de apoyo

## 🔧 Estructura del Proyecto

```
Nube/
├── src/
│   ├── Nube.jsx          # Componente principal
│   └── main.jsx          # Punto de entrada
├── index.html            # Template HTML
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
└── README.md            # Este archivo
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Daniel C. Ramirez** - [@danielcramirez](https://github.com/danielcramirez)

## 🙏 Reconocimientos

- Diseño inspirado en mapas mentales educativos
- Iconos por [Lucide](https://lucide.dev/)
- Framework CSS por [Bootstrap](https://getbootstrap.com/)
- Animaciones por [Framer Motion](https://www.framer.com/motion/)

---

⭐ **Si este proyecto te es útil, no olvides darle una estrella!**
