class EscalonadorRoundRobin {
    constructor(quantum) {
        this.quantum = quantum;
        this.processQueue = [];
    }

    addProcess(process) {
        this.processQueue.push(process);
    }

    schedule() {
        while (this.processQueue.length > 0) {
            const currentProcess = this.processQueue.shift();
            const executionTime = Math.min(currentProcess.burstTime, this.quantum);
            currentProcess.burstTime -= executionTime;

            console.log(`Executing process ${currentProcess.id} for ${executionTime}ms`);

            if (currentProcess.burstTime > 0) {
                this.processQueue.push(currentProcess);
            } else {
                console.log(`Process ${currentProcess.id} completed`);
            }
        }
    }
}

export default EscalonadorRoundRobin;