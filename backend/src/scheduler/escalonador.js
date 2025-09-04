class Escalonador {
    constructor(algoritmo) {
        this.algoritmo = algoritmo;
        this.processos = [];
    }

    adicionarProcesso(processo) {
        this.processos.push(processo);
    }

    escalar() {
        if (this.processos.length === 0) {
            console.log("Nenhum processo para escalar.");
            return;
        }
        const processoEscalado = this.algoritmo.escalar(this.processos);
        console.log(`Processo escalado: ${processoEscalado.id}`);
    }
}

export default Escalonador;