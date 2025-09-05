class EscalonadorSJF {
    constructor() {
        this.processos = [];
    }

    adicionarProcesso(processo) {
        this.processos.push(processo);
    }

    escalonar() {
        // Ordena os processos pelo tempo de burst (menor primeiro)
        this.processos.sort((a, b) => a.burstTime - b.burstTime);
        return this.processos;
    }
}

export default EscalonadorSJF;