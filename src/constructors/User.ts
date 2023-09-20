import { IRequest } from '../interfaces';
import { maxRequests, interval, haltTime } from '../constants';


// User Constructor with build in methods to validate each User's data from inside.
export class User {
    userId: string;
    requestsStack: IRequest[];
    private _onHold = false;
    constructor(userId: string, requestsStack: IRequest[]) {
        this.userId = userId;
        this.requestsStack = requestsStack;
    }

    isLimitExceeded(): boolean {
        // Wait until 100 (maxRequests) request;
        if (this.requestsStack.length >= maxRequests) {
            console.log('requestsStack', this.requestsStack.length);

            // Check the diff between last request's receive time and request's receive time 100 before;
            const getRequestTimeAt = (n: number): number => this.requestsStack.at(n).receiveTime;
            const delta: number = (getRequestTimeAt(-1) - getRequestTimeAt(-maxRequests)) / 1000; // Check 101 theory

            console.log(`>>> First ${maxRequests} request for ${this.userId} User takes ${delta} seconds.`,
                `Need ${interval} seconds.`,
                delta <= interval ? '<ON HOLD>' : '<GOOD>');
            return delta <= interval; // IF delta is less than interval, so it means that requests are too frequent
        }
        return false;
    }
    pushNewRequest(userRequest: IRequest): boolean {
        this.requestsStack.push(userRequest);
        if (this.isLimitExceeded()) {
            console.log('POP', this.requestsStack.length)
            this.requestsStack.unshift();
            console.log('POP', this.requestsStack.length)
            this.onHold = true;

            setTimeout(() => {
                this.onHold = false;
            }, haltTime * 1000)

            return false;
        }
        return true;
    }

    get onHold(): boolean {
        return this._onHold;
    }
    set onHold(value: boolean) {
        this._onHold = value;
    }
}
