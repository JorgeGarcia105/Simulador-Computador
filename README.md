Simulador de Computador con React + Vite
📌 Descripción del Proyecto
Este proyecto es un simulador visual e interactivo de un computador básico, diseñado para ayudar a entender los conceptos fundamentales de arquitectura de computadores. Implementa los componentes principales de un sistema computacional y muestra su funcionamiento interno.

🚀 Características Principales
⚙️ CPU Simulada
Registros visibles: PC, IR, ACC, MAR, MBR, FLAGS

ALU funcional: Operaciones aritméticas y lógicas básicas

Unidad de Control: Visualización del ciclo Fetch-Decode-Execute

🧠 Subsistema de Memoria
RAM editable: Permite modificar valores directamente

ROM de solo lectura: Muestra contenido predefinido

Visualización hexadecimal/decimal

🚌 Sistema de Buses
Bus de Datos: Muestra el flujo de información

Bus de Direcciones: Visualiza las direcciones accedidas

Bus de Control: Indica las señales activas

💾 Dispositivos de E/S
Teclado simulado: Entrada de datos interactiva

Pantalla de salida: Muestra resultados e interacciones

Unidad de disco: Simulación de almacenamiento secundario

🖥️ Interfaz de Usuario
Panel de control centralizado

Visualización paso a paso del flujo de datos

Animaciones para mejor comprensión

🛠️ Tecnologías Utilizadas
React + Vite (Entorno de desarrollo rápido)

CSS Modules (Para estilos componentizados)

Framer Motion (Animaciones fluidas)

React Icons (Conjunto de iconos visuales)

📦 Instalación y Uso
Clonar el repositorio

bash
git clone https://github.com/tu-usuario/simulador-computador.git
cd simulador-computador
Instalar dependencias

bash
npm install
Ejecutar en modo desarrollo

bash
npm run dev
Compilar para producción

bash
npm run build
npm run preview
🎮 Funcionalidades Interactivas
Ejecución de Programas
Carga de programas básicos

Ejecución paso a paso o automática

Visualización del contador de programa (PC)

Modificación en Tiempo Real
Edición directa de la RAM

Cambio de valores en registros

Interacción con dispositivos de E/S

Simulación de Instrucciones
assembly
LOAD 0x10    # Cargar dato de memoria a ACC
ADD 0x11     # Sumar valor de memoria al ACC
STORE 0x12   # Almacenar ACC en memoria
JMP 0x00     # Saltar a dirección
HLT          # Detener ejecución
📚 Conceptos de Arquitectura Cubiertos
Ciclo de instrucción (Fetch-Decode-Execute)

Organización de la memoria

Flujo de datos a través de buses

Operaciones de la ALU

Mapeo de memoria y E/S

Manejo de interrupciones

🎨 Diseño de la Interfaz
Diagrama de Interfaz

La interfaz está organizada en secciones lógicas:

Panel Superior: Controles de ejecución

Sección CPU: Registros y ALU

Área de Memoria: RAM y ROM

Buses: Visualización del flujo de datos

Dispositivos E/S: Consola interactiva

🤝 Contribución
Las contribuciones son bienvenidas. Por favor:

Haz un fork del proyecto

Crea una rama para tu feature (git checkout -b feature/AmazingFeature)

Haz commit de tus cambios (git commit -m 'Add some AmazingFeature')

Haz push a la rama (git push origin feature/AmazingFeature)

Abre un Pull Request

📄 Licencia
Distribuido bajo la licencia MIT. Consulta LICENSE para más información.