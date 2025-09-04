// src/main.js

import { GeradorDeProcessos } from './core/geradorDeProcessos.js';
import { EscalonadorFactory } from './scheduler/escalonadorFactory.js';

const main = () => {
    const gerador = new GeradorDeProcessos();
    const processos = gerador.gerarProcessos(10); // Gerar entre 10 e 50 processos
    const escalonador = EscalonadorFactory.create('FCFS');
    escalonador.agregarProcessos(processos);
    escalonador.executar();
};

main();