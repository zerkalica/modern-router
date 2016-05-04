/* @flow */

import http from 'http'

declare class http$ServerResponse extends http.IncomingMessage {
    writeHeader(code: number, headers?: Object): void;
    end(chunk?: string): void;
}
