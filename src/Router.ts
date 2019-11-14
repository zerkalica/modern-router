import { RouteOptions, Route, RouteConstructor } from './Route';
import { HistoryLike, LocationLike } from './RouterInterfaces';
import { failHidden, SchemaTypeError, SchemaVariantError } from './schema';

export interface LocationStoreOptions {
    location?: LocationLike;
    refresh?: () => void;
    history?: HistoryLike;
    target?: Window;
}

export interface RouterOptions<Context> extends LocationStoreOptions {
    context: Context;
}

const defaultLocation: LocationLike = {
    search: '',
    origin: '',
    pathname: '',
    port: '80',
    hostname: '',
    hash: '',
    protocol: 'http'
};

export type RouteMatch<Output, Context, Defaults> = {
    route: Route<Output, Context, Defaults>;
    RouteClass: RouteConstructor<Output, Context, Defaults>;
    params: Output;
};

export class Router<Context = unknown> implements RouteOptions<Context> {
    protected location: Readonly<LocationLike>;
    protected refresh: () => void;
    protected history?: HistoryLike;
    protected target?: Window;

    readonly context: Context;

    constructor({
        location = defaultLocation,
        refresh = empty,
        history,
        target,
        context
    }: RouterOptions<Context>) {
        this.location = location;
        this.refresh = refresh;
        this.history = history;
        this.target = target;
        this.context = context;
        if (target) {
            target.addEventListener('popstate', this.onPopState);
        }
    }

    toString() {
        return `${this.constructor.name} [ ${this.currentUrl} ]`
    }

    destructor() {
        if (this.target) {
            this.target.removeEventListener('popstate', this.onPopState);
        }
    }

    private onPopState = () => {
        if (! this.target) return;
        this.setLocation(this.target.location);
    };

    private routes = new Map<
        RouteConstructor<unknown, Context, unknown>,
        Route<unknown, Context, any>
    >();

    route<Output, Defaults>(
        RouteClass: RouteConstructor<Output, Context, Defaults>
    ): Route<Output, Context, Defaults> {
        let route = this.routes.get(RouteClass) as Route<Output, Context, Defaults>;

        if (route) return route;

        route = new RouteClass(this);
        this.routes.set(RouteClass, route);

        return route;
    }

    params<Output, Defaults>(RouteClass: RouteConstructor<Output, Context, Defaults>): Output {
        return this.route(RouteClass).params(this.location);
    }

    /**
     * @throws SchemaVariantError if 404
     * @throws Promise for React.Suspense
     */
    resolve(
        routeClasses: readonly RouteConstructor<unknown, Context, unknown>[]
    ): RouteMatch<unknown, Context, unknown> {
        const errors: SchemaTypeError[] = [];

        for (const RouteClass of routeClasses) {
            const route = this.route(RouteClass);
            try {

                return {
                    route,
                    RouteClass,
                    params: route.params(this.location)
                } as RouteMatch<unknown, Context, unknown>;
            } catch (error) {
                if (error instanceof Error) {
                    error.message = `${route}, url "${this.currentUrl}": ${error.message}`
                }

                if ( ! (error instanceof SchemaTypeError)) return failHidden(error);
                errors.push(error);
            }
        }

        throw new SchemaVariantError(errors);
    }

    protected setLocation(location: LocationLike) {
        if (location !== this.location && Router.key(location) === Router.key(this.location)) return;
        this.location = location;
        this.refresh();
    }

    get currentUrl(): string {
        return this.location.pathname + this.location.search;
    }

    update(nextUrl: string, replace: boolean = false) {
        if (this.history) {
            if (replace) this.history.replaceState(null, '', nextUrl);
            else this.history.pushState(null, '', nextUrl);
        }
        this.refresh();
    }

    static key(location: LocationLike) {
        return (Object.keys(defaultLocation) as (keyof LocationLike & string)[])
            .map(key => location[key])
            .join('.');
    }
}

function empty() {}
