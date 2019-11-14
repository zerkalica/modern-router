import {
    LocationLike
} from './RouterInterfaces';
import { toPromise } from './toPromise';

export interface RouteOptions<Context> {
    readonly context: Context;
    update?(nextUrl: string, replace?: boolean): void;
}

export type RouteConstructor<Output, Context, Defaults> =
    new (router: RouteOptions<Context>) => Route<Output, Context, Defaults>;

export type PartialDefaults<Params, Defaults> = Omit<Params, keyof Defaults> & Partial<Pick<Params, keyof Params & keyof Defaults>>;

export abstract class Route<Output, Context, Defaults extends Partial<Output>> {
    protected options: RouteOptions<Context>;

    constructor(
        options: RouteOptions<Context>
    ) {
        this.options = options;
    }

    protected get context(): Context {
        return this.options.context;
    }

    /**
     * Построить url из параметров роута
     *
     * @throws Error если параметры не соотвествуют типу в схеме
     * @throws Promise если требуется загрузка данных для построения урла, внешний вызов должен быть обернут тогда в toPromise
     */
    abstract url(params: PartialDefaults<Output, Defaults>): string;

    /**
     * @throws Error если параметры не соотвествуют текущему урлу
     * @throws Promise если требуется загрузка данных для построения урла, внешний вызов должен быть обернут тогда в toPromise
     */
    abstract params(location: LocationLike): Output;

    protected update(url: string, replace = false) {
        if (this.options.update) {
            this.options.update(url, replace)
        }
    }

    push(params: PartialDefaults<Output, Defaults>) {
        // Обработать ситуацию, если будут еще вызовы push до резолва промиса
        return toPromise(() => this.url(params)).then(url =>
            this.update(url)
        );
    }

    replace(params: PartialDefaults<Output, Defaults>) {
        return toPromise(() => this.url(params)).then(url =>
            this.update(url, true)
        );
    }
}
