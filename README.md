Claro, aquí tienes una **documentación formal y profesional** para tu proyecto, ideal para README o documentación interna. Puedes adaptarla según tus necesidades.

---

# Simulador de Arquitectura de Computador

## Descripción General

El **Simulador de Arquitectura de Computador** es una herramienta interactiva desarrollada en React que permite visualizar, comprender y experimentar con los principales componentes de una computadora a nivel de hardware. El simulador está orientado a la docencia y la experimentación, facilitando la observación del ciclo de instrucción (Fetch-Decode-Execute), el flujo de datos y el funcionamiento de la memoria, la CPU y los buses.

---

## Tabla de Contenidos

- Estructura del Proyecto
- Componentes Principales
- Ciclo de Instrucción
- Set de Instrucciones
- Requisitos y Ejecución
- Ejemplo de Uso
- Detalles Técnicos
- Extensiones y Mejoras Futuras
- Licencia

---

## Estructura del Proyecto

```
simulador-computador/
├── public/
├── src/
│   ├── components/
│   │   ├── CPU/
│   │   ├── Memory/
│   │   ├── BusSystem/
│   │   ├── IO/
│   │   ├── Disk/
│   │   └── InstructionSet.jsx
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── styles/
│   ├── App.jsx
│   ├── main.jsx
├── package.json
├── vite.config.js
└── README.md
```

---

## Componentes Principales

| Componente         | Descripción                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **CPU**            | Incluye la ALU, registros y unidad de control.                              |
| **ALU**            | Realiza operaciones aritméticas y lógicas, mostrando los flags de estado.   |
| **Registers**      | Visualiza y permite modificar registros (PC, ACC, IR, MAR, MBR, FLAGS, etc) |
| **ControlUnit**    | Muestra el estado del ciclo de instrucción y micro-operaciones.             |
| **RAM**            | Memoria de acceso aleatorio editable, segmentada en datos y código.         |
| **ROM**            | Memoria de solo lectura, almacena el programa a ejecutar.                   |
| **BusSystem**      | Visualiza los buses de datos, direcciones y control.                        |
| **KeyboardInput**  | Permite ingresar instrucciones o programas en ensamblador.                  |
| **ScreenOutput**   | Muestra la salida del sistema, resultados y mensajes.                       |
| **DiskDrive**      | Simula un disco secundario (opcional).                                      |
| **InstructionSet** | Tabla visual del set de instrucciones soportadas.                           |

---

## Ciclo de Instrucción

El simulador implementa el ciclo clásico de una CPU:

1. **Fetch (Búsqueda):** MAR ← PC; MBR ← Memoria[MAR]; IR ← MBR; PC ← PC + 1
2. **Decode (Decodificación):** Decodifica la instrucción en IR, obtiene opcode y operandos.
3. **Execute (Ejecución):** Ejecuta la operación (ALU, memoria, salto, E/S, etc.).
4. **Interrupt/Halt:** Maneja interrupciones o detiene la CPU si corresponde.

Cada etapa se resalta visualmente y se muestran las micro-operaciones asociadas.

---

## Set de Instrucciones

| Opcode | Nombre   | Descripción                        | Formato Binario Ejemplo |
|--------|----------|------------------------------------|------------------------|
| 0000   | NOP      | No operation                       | 0000 0000             |
| 0001   | LOAD     | Carga memoria en ACC               | 0001 AAAA             |
| 0010   | STORE    | Guarda ACC en memoria              | 0010 AAAA             |
| 0011   | ADD      | Suma memoria a ACC                 | 0011 AAAA             |
| 0100   | SUB      | Resta memoria de ACC               | 0100 AAAA             |
| 0101   | JMP      | Salta a dirección                  | 0101 AAAA             |
| 0110   | JZ       | Salta si cero                      | 0110 AAAA             |
| 0111   | JC       | Salta si carry                     | 0111 AAAA             |
| 1000   | OUT      | Muestra ACC en salida              | 1000 0000             |
| 1001   | IN       | Lee entrada a ACC                  | 1001 0000             |
| 1010   | AND      | AND lógico con ACC                 | 1010 AAAA             |
| 1011   | OR       | OR lógico con ACC                  | 1011 AAAA             |
| 1100   | XOR      | XOR lógico con ACC                 | 1100 AAAA             |
| 1111   | HLT      | Detiene la CPU                     | 1111 0000             |

*Nota: AAAA representa la dirección u operando.*

---

## Requisitos y Ejecución

### Requisitos

- Node.js >= 14.x
- npm >= 6.x

### Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/simulador-computador.git
   cd simulador-computador
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el simulador:
   ```bash
   npm run dev
   ```
   El simulador estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

---

## Ejemplo de Uso

### Cargar un Programa

1. Ve al panel "Teclado del Computador".
2. Selecciona "Cargar Programa".
3. Escribe instrucciones en ensamblador, una por línea:
   ```
   LOAD 1
   ADD 2
   STORE 3
   HLT
   ```
4. Haz clic en "Enviar". El programa se carga en la ROM.

### Ejecutar el Programa

- Usa "Paso a Paso" para avanzar instrucción por instrucción y observar el ciclo.
- Usa "Ejecutar Auto" para correr el programa automáticamente.

### Visualizar Resultados

- Observa los cambios en los registros, memoria, buses y flags.
- La salida aparecerá en el panel "Salida del Sistema".

---

## Detalles Técnicos

### Arquitectura General

El simulador está construido con una arquitectura modular que refleja los componentes físicos de una computadora:

- **Frontend (React):** Renderiza la interfaz visual y maneja la interacción con el usuario.
- **Estado del Sistema:** Gestiona el estado central del computador en `initialState.js`.
- **Ciclo Principal:** Implementa el ciclo fetch-decode-execute en FetchDecodeExecuteCycle.js.
- **Componentes Físicos:** Cada componente de hardware tiene su propio módulo React.

### Representación de Datos

- **Sistema numérico:** Binario (base 2)
- **Tamaño de palabra:** 12 bits (configurable en binaryUtils.js)
- **Tamaño de dirección:** 12 bits (permite direccionar 4096 posiciones de memoria)
- **Representación de números negativos:** Complemento a 2
- **Flags:** Zero (Z), Sign (S), Carry (C), Overflow (O)

### Organización de Memoria

La memoria está dividida en los siguientes segmentos:

| Segmento       | Rango de Direcciones | Tamaño    | Uso                        |
|----------------|----------------------|-----------|----------------------------|
| Datos          | 0x000 - 0x7FF        | 2048 bytes| Variables, datos temporales|
| Código         | 0x800 - 0xFFF        | 2048 bytes| Instrucciones del programa |

Cada celda de memoria almacena un valor de 8 o 16 bits (configurable) representado como string binario.

### Sistema de Buses

La comunicación entre componentes sigue una arquitectura de bus:

- **Bus de Datos:** Transfiere datos entre componentes (12 bits)
- **Bus de Direcciones:** Indica la dirección de memoria a acceder (12 bits)
- **Bus de Control:** Señales de control que coordinan los componentes (READ, WRITE, etc.)

### Utilidades Binarias

El módulo binaryUtils.js implementa las siguientes operaciones:

```js
// Conversiones básicas
binaryToDec('101010', 12); // Convierte binario a decimal
decToBinary(42, 12); // Convierte decimal a binario de 12 bits
decToHex(42, 12); // Convierte decimal a hex con formato 0xXXX

// Operaciones binarias puras
binaryAdd('0101', '0011', 8); // Suma binaria con flags
binarySubtract('1000', '0011', 8); // Resta binaria
binaryAnd('1010', '1100', 8); // AND bit a bit
binaryOr('1010', '1100', 8); // OR bit a bit
binaryXor('1010', '1100', 8); // XOR bit a bit
binaryNot('1010', 8); // NOT bit a bit
```

---

## Extensiones y Mejoras Futuras

- Pipeline visual (simular Fetch, Decode, Execute en paralelo)
- Memoria caché (L1/L2)
- Interrupciones y manejo de errores
- Exportar/importar programas en JSON
- Estadísticas de ejecución y profiling
- Tutorial interactivo integrado

---

## Licencia

MIT License

---

¿Necesitas una sección más detallada sobre algún componente, arquitectura interna, o instrucciones para desarrolladores? ¡Dímelo!