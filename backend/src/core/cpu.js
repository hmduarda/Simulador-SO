class CPU {
    constructor() {
        this.currentProcess = null;
        this.isIdle = true;
    }

    execute(process) {
        if (process) {
            this.currentProcess = process;
            this.isIdle = false;
            console.log(`Executando processo ${process.id}`);
            setTimeout(() => {
                this.finishProcess();
            }, process.burstTime * 1000); // Se burstTime estiver em segundos
        }
    }

    finishProcess() {
        console.log(`Processo ${this.currentProcess.id} terminou sua execução`);
        this.currentProcess = null;
        this.isIdle = true;
    }

    getCurrentProcess() {
        return this.currentProcess;
    }

    isCpuIdle() {
        return this.isIdle;
    }
}

export default CPU;