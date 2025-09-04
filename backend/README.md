# Escalonador JS

## Description
This project is a JavaScript implementation of a process scheduling simulator. It provides various scheduling algorithms, including First-Come, First-Served (FCFS), Round Robin, and Shortest Job First (SJF). The application simulates the behavior of a CPU managing processes based on the selected scheduling algorithm.

## Project Structure
```
escalonador-js
├── src
│   ├── main.js
│   ├── config
│   │   └── config.js
│   ├── core
│   │   ├── algoritmo.js
│   │   ├── cpu.js
│   │   ├── geradorDeProcessos.js
│   │   └── processo.js
│   └── scheduler
│       ├── baseEscalonador.js
│       ├── escalonador.js
│       ├── escalonadorFactory.js
│       ├── escalonadorFCFS.js
│       ├── escalonadorRoundRobin.js
│       └── escalonadorSJF.js
├── package.json
└── README.md
```

## Installation
To install the necessary dependencies, run the following command in the project directory:

```
npm install
```

## Usage
To run the application, use the following command:

```
node src/main.js
```

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.