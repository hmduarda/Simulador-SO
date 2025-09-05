class EscalonadorFCFS {
    constructor() {
        this.queue = [];
    }

    addProcess(process) {
        this.queue.push(process);
    }

    schedule() {
        const scheduledProcesses = [];
        while (this.queue.length > 0) {
            const process = this.queue.shift();
            scheduledProcesses.push(process);
        }
        return scheduledProcesses;
    }
}

export default EscalonadorFCFS;