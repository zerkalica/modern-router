/* @flow */

import Err from 'es6-error'

export default class PageNotFoundError extends Err {
    pageName: ?string;

    constructor(
        pageName?: ?string,
        message: string = 'Page not found'
    ) {
        super(message + (pageName ? (' ' + pageName) : ''))
        this.pageName = pageName
    }
}
