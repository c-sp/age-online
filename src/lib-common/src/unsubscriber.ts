import {SubscriptionLike} from 'rxjs';


class CallOnce implements SubscriptionLike {

    private isClosed = false;

    constructor(private readonly fn: () => unknown) {
    }

    get closed(): boolean {
        return this.isClosed;
    }

    unsubscribe(): void {
        if (!this.closed) {
            this.fn();
            this.isClosed = true;
        }
    }
}


export class Unsubscriber {

    private subscriptions = new Array<SubscriptionLike>();

    get subscriptionsLength(): number {
        return this.subscriptions.length;
    }

    callOnCleanup(...functions: ReadonlyArray<() => unknown>): this {
        return this.trackSubscriptions(...functions.map((fn) => new CallOnce(fn)));
    }

    trackSubscriptions(...subscriptions: ReadonlyArray<SubscriptionLike>): this {
        this.subscriptions = this.subscriptions.concat(...subscriptions);
        return this;
    }

    cleanup(): this {
        this.subscriptions
            .filter((subscription) => !subscription.closed)
            .forEach((subscription) => subscription.unsubscribe());

        this.subscriptions = new Array<SubscriptionLike>();
        return this;
    }
}
