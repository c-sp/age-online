import {Unsubscriber} from '@age-online/lib-common';
import {PureComponent} from 'react';
import {SubscriptionLike} from 'rxjs';


export class TidyPureComponent<P = {}, S = {}> extends PureComponent<P, S> {

    private readonly unsubscriber = new Unsubscriber();

    componentWillUnmount(): void {
        this.unsubscriber.cleanup();
    }

    callOnUnmount(...functions: ReadonlyArray<() => unknown>): this {
        this.unsubscriber.callOnCleanup(...functions);
        return this;
    }

    unsubscribeOnUnmount(...subscriptions: ReadonlyArray<SubscriptionLike>): this {
        this.unsubscriber.trackSubscriptions(...subscriptions);
        return this;
    }
}
