export function createScheduler(algorithmType) {
    switch (algorithmType) {
        case 'FCFS':
            return new (require('./escalonadorFCFS')).default();
        case 'RoundRobin':
            return new (require('./escalonadorRoundRobin')).default();
        case 'SJF':
            return new (require('./escalonadorSJF')).default();
        default:
            throw new Error('Unknown algorithm type: ' + algorithmType);
    }
}