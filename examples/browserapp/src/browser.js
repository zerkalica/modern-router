// @flow
/* eslint-env browser */
/* eslint-disable no-console */

import {SusaninRouter, RouterManager} from 'modern-router/index'
import {BrowserLocation} from 'modern-router/browser'
import type {IRoute} from 'modern-router/index'
import type {IRouterConfig} from 'modern-router/interfaces'

const location = new BrowserLocation(window)
const config: IRouterConfig = {
    isFull: false,
    routes: {
        index: {
            pattern: '/'
        },
        'main.simple': {
            pattern: '/page1'
        },
        'main.full': {
            isFull: true,
            pattern: '/page2'
        },
        'main.index.complex': {
            pattern: '/(<controller>(/<action>(/<id>)))',
            method: 'GET',
            conditions: {
                controller: ['index', 'crud'],
                action: ['build', 'some'],
                id: '\\d{3,4}'
            },
            defaults: {
                controller: 'index',
                action: 'build'
            }
        },
        'some.external': {
            pattern: '/(<controller>)',
            hostname: 'example.com',
            port: '88',
            protocol: 'https:'
        }
    }
}

const rm = new RouterManager(
    location,
    new SusaninRouter(config, location.getParams())
)

const params = {
    'main.index.complex': {
        controller: 'crud',
        action: 'some',
        id: '123'
    }
}

function createLink(key, prms?: Object): HTMLElement {
    const a = document.createElement('a')
    a.setAttribute('href', rm.build(key, prms))

    a.onclick = function onClick(e: Event) {
        e.stopPropagation()
        e.preventDefault()

        rm.update(key, prms)
    }

    a.textContent = key

    return a
}

const routes = config.routes || {}
const nav = document.getElementById('navigation')
const keys: string[] = Object.keys(routes || {})
for (let i = 0; i < keys.length; i++) {
    const key: string = keys[i]
    const a = createLink(key, params[key])
    const li = document.createElement('li')
    li.appendChild(a)
    nav.appendChild(li)
}

const routeInfo = document.getElementById('routeInfo')
const routeConfig = document.getElementById('routeConfig')
rm.onChange((route: IRoute) => {
    routeConfig.textContent = JSON.stringify(routes[route.page || ''] || null, null, '  ')
    routeInfo.textContent = JSON.stringify(route, null, '  ')
})
