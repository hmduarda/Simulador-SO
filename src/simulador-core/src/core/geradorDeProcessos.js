export default class GeradorDeProcessos {
    constructor() {
        this.processos = [];
    }

    gerarProcesso(id, burstTime) {
        const processo = {
            id: id,
            burstTime: burstTime,
            estado: 'pronto'
        };
        this.processos.push(processo);
        return processo;
    }

    gerarProcessosAleatorios(numProcessos) {
        for (let i = 0; i < numProcessos; i++) {
            const burstTime = Math.floor(Math.random() * 50) + 1; 
            this.gerarProcesso(i + 1, burstTime);
        }
        return this.processos;
    }

    getProcessos() {
        return this.processos;
    }
}