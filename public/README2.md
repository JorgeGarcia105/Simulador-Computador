Estructura Mejorada (Basada en tus necesidades)
plaintext
Copiar
Editar
computador-simulador/
├── public/
├── src/
│   ├── components/
│   │   ├── CPU/
│   │   │   ├── CPU.jsx
│   │   │   ├── ALU.jsx
│   │   │   ├── Registers.jsx
│   │   │   ├── ControlUnit.jsx
│   │   │   └── Multiplexer.jsx  # Nuevo
│   │   ├── Memory/
│   │   │   ├── RAM.jsx
│   │   │   ├── ROM.jsx
│   │   │   └── Cache.jsx  # Opcional si quieres simular memoria caché
│   │   ├── BusSystem/
│   │   │   ├── DataBus.jsx
│   │   │   ├── AddressBus.jsx
│   │   │   ├── ControlBus.jsx
│   │   │   └── InterruptHandler.jsx # Nuevo
│   │   ├── IO/
│   │   │   ├── KeyboardInput.jsx
│   │   │   ├── ScreenOutput.jsx
│   │   │   └── PrinterOutput.jsx  # Opcional
│   │   ├── Disk/
│   │   │   └── DiskDrive.jsx
│   │   └── InstructionSet.jsx
│   ├── services/
│   │   ├── FetchDecodeExecuteCycle.js # Nuevo
│   ├── hooks/
│   │   ├── useMemory.js
│   │   ├── useCPU.js
│   ├── utils/
│   │   ├── binaryUtils.js
│   │   ├── instructionParser.js
│   ├── App.jsx
│   ├── main.jsx
│   └── styles/
│       └── global.css
├── vite.config.js
├── package.json
└── README.md
🛠️ Extras Opcionales (avanzados)
Pipeline visual (simula las etapas Fetch, Decode, Execute como en arquitectura moderna).

Simulación de fallos (errores de memoria, interrupciones por fallo de disco).

Manual interactivo/tutorial en el simulador (tipo guía paso a paso).

🚀 Fase 1: Mínimo Producto Viable (MVP)
Objetivo: Tener una simulación básica funcionando.

Tareas:

Simular CPU Básica

Registers.jsx → implementar registros (PC, IR, ACC, etc.).

ALU.jsx → suma, resta (operaciones básicas).

ControlUnit.jsx → lógica de control muy sencilla (fetch → decode → execute).

Simular Memoria

RAM.jsx → una tabla visual de direcciones/memoria editable.

ROM.jsx → solo lectura, almacena instrucciones precargadas.

Simular Bus del Sistema

DataBus.jsx, AddressBus.jsx, ControlBus.jsx → solo visualizar el flujo de datos, direcciones y control entre CPU y Memoria.

Simular Entrada/Salida

KeyboardInput.jsx → entrada de datos manual.

ScreenOutput.jsx → salida simple de resultados.

InstructionSet.jsx

Definir un pequeño set de instrucciones tipo:

LOAD, STORE, ADD, SUB, JMP, NOP.

Ciclo Básico de Instrucción

services/FetchDecodeExecuteCycle.js

Fetch → traer instrucción de memoria.

Decode → interpretar la instrucción.

Execute → ejecutarla (en ALU, RAM, etc.).

Visualización General en App.jsx

Mostrar CPU, Memoria, IO, y Buses en un solo dashboard.

🛠️ Fase 2: Mejoras Funcionales
Objetivo: Aumentar realismo y robustez.

Tareas:

Implementar banderas de la ALU (Zero, Carry, Overflow, etc.).

Agregar Disco Secundario (DiskDrive.jsx).

Implementar Sistema de Interrupciones (keyboard, fallos de memoria).

Agregar Multiplexores (MUX) para controlar flujos de buses.

Mostrar el estado de los buses en tiempo real (valor transportado).

🌟 Fase 3: Avanzado (Arquitectura Moderna)
Objetivo: Simular características de computadoras más reales.

Tareas:

Pipeline (Fetch → Decode → Execute en paralelo).

Memoria Cache (simular caché L1, L2 opcional).

Planificación de tareas (pequeño scheduler de procesos).

Microinstrucciones (control unit basada en microcódigo).

Testing Unitario (Vitest, Jest).

📚 Extras muy Pro
Tutoriales integrados para el usuario.

Exportar/Importar programas en formato JSON.

Reportes de ejecución (estadísticas de instrucciones, tiempos).

✅ Paso inmediato ahora:
Si quieres arrancar ya, yo te recomiendo que empecemos hoy mismo con:

1. Definir los registros del CPU (Registers.jsx)
2. Definir un primer Instruction Set (InstructionSet.jsx)

Así ya tendrás el corazón de la máquina listo. ❤️‍🔥