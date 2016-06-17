/* @flow */

import type {IncomingMessage} from 'http'

export interface ServerResponse extends IncomingMessage {
    writeHead(code: number, headers?: {[id: string]: string}): void;
    end(chunk?: string): void;
}
