/// <reference path="./susanin.d.ts" />
import Susanin, { RouteConditions, SusaninRouteBase } from 'susanin';

import { Route, PartialDefaults } from '../Route';
import { LocationLike, Tokens } from '../RouterInterfaces';
import { TokenMetadata, getTokens } from './getTokens';
import { SchemaTypeError } from '../schema/index';

export abstract class SusaninRoute<Input, Output, Context = any, Defaults extends Partial<Output> = {}> extends Route<
    Output,
    Context,
    Defaults
> {
    protected abstract metadata: TokenMetadata;
    protected abstract pattern(p: Tokens<Input>): string;
    protected toQuery?(p: Output): Input;
    protected fromQuery?(p: Input): Output;
    protected conditions?(): RouteConditions<Input>;

    protected compiledRoute:
        | SusaninRouteBase<Output, Defaults, string, undefined>
        | undefined = undefined;

    protected get susaninRoute() {
        if (this.compiledRoute) return this.compiledRoute;
        const pattern = this.pattern(getTokens(this.metadata));

        this.compiledRoute = new Susanin.Route({
            postMatch: this.fromQuery ? this.fromQuery.bind(this) : undefined,
            preBuild: this.toQuery ? this.toQuery.bind(this) : undefined,
            // defaults: this.defaults ? this.defaults() : undefined,
            data: undefined,
            conditions: this.conditions ? this.conditions() : undefined,
            pattern,
            name: pattern
        });

        return this.compiledRoute;
    }

    protected defaults?(): Defaults;

    toString() {
        return `${this.constructor.name} ${this.susaninRoute.getName()}`;
    }

    url(params: PartialDefaults<Output, Defaults>): string {
        return this.susaninRoute.build(this.defaults ? { ...this.defaults(), ...params } : params);
    }

    params(location: LocationLike): Output {
        const url = location.pathname + location.search;
        const params = this.susaninRoute.match(url);

        if (! params) {
            throw new SchemaTypeError(`not matched`);
        }

        return this.defaults ? { ...this.defaults(), ...params } : params;
    }
}
