class BaseEscalonador {
    constructor() {
        this.processos = [];
    }

    adicionarProcesso(processo) {
        this.processos.push(processo);
    }

    removerProcesso(processoId) {
        this.processos = this.processos.filter(processo => processo.id !== processoId);
    }

    obterProcessos() {
        return this.processos;
    }

    agendar() {
        throw new Error("Método 'agendar' deve ser implementado por subclasses.");
    }
}

export default BaseEscalonador;