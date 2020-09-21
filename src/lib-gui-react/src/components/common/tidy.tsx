import {Unsubscriber} from '@age-online/lib-common';
import {Component} from 'react';
import {SubscriptionLike} from 'rxjs';


export class TidyComponent<P = object, S = object> extends Component<P, S> {

    private readonly unsubscriber = new Unsubscriber();

    componentWillUnmount(): void {
        this.unsubscriber.cleanup();
    }

    callOnUnmount(...functions: readonly (() => unknown)[]): this {
        this.unsubscriber.callOnCleanup(...functions);
        return this;
    }

    unsubscribeOnUnmount(...subscriptions: readonly SubscriptionLike[]): this {
        this.unsubscriber.trackSubscriptions(...subscriptions);
        return this;
    }
}
