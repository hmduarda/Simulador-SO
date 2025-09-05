class Processo {
    constructor(id, burstTime) {
        this.id = id;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.state = 'novo'; 
    }

    start() {
        this.state = 'executando';
    }

    wait() {
        this.state = 'esperando';
    }

    terminate() {
        this.state = 'terminado';
    }

    reset() {
        this.remainingTime = this.burstTime;
        this.state = 'novo';
    }
}

export default Processo;