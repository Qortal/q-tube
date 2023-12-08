type QueueItem = {
    request: () => Promise<any>;
    resolve: (value: any | PromiseLike<any>) => void;
    reject: (reason?: any) => void;
};

export class RequestQueue {
    private queue: QueueItem[];
    private maxConcurrent: number;
    private currentConcurrent: number;

    constructor(maxConcurrent = 5) {
        this.queue = [];
        this.maxConcurrent = maxConcurrent;
        this.currentConcurrent = 0;
    }

    async push(request: () => Promise<any>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.queue.push({
                request,
                resolve,
                reject,
            });
            this.checkQueue();
        });
    }

    private checkQueue(): void {
        if (this.queue.length === 0 || this.currentConcurrent >= this.maxConcurrent) return;

        const { request, resolve, reject } = this.queue.shift() as QueueItem;
        this.currentConcurrent++;

        request()
            .then(resolve)
            .catch(reject)
            .finally(() => {
                this.currentConcurrent--;
                this.checkQueue();
            });
    }
}
