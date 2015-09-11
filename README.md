# modern-router

Separation concerns router, based on susanin and location bar.

## Router - isomorphic side

config.json:

```json
{
    "routes": {
        "ProductsIndex": {
            "pattern": "/products(/<category>(/<id>))(/)",
            "data": {
                "method": "GET",
                "page": "ProductPage"
            }
        },
        "/": "WelcomePage"
        "/user/<id>": "UserPage"
    },
    "sitePrefix": "/site1"
}
```

index.js:

```js
import Router from 'modern-router/Router'
import config from './config.json'

const router = new Router(config)

const data1 = router.resolve('/site1/?q=1')
/*
    {
       data: {
           page: 'WelcomePage'
       },
       query: {q: '1'}
    }
*/


const data2 = router.resolve('/site1/products/123/4?q=2')
/*
    {
       data: {
           page: 'ProductsIndex',
           method: 'GET'
       },
       query: {
           q: '2',
           category: '123',
           id: '4'
       }
    }
*/

const url = router.build('ProductsIndex', {
    id: 1,
    category: 321
})
/*
    /site1/products/321/1
*/

```

## Location bar - client side

```js
import Router from 'modern-router/Router'
import Location from 'modern-router/Location'
import config from './config.json'


class MyLocation extends Location {
    _select(page, query) {
        // state-driven logic place here, ex: Emitter.trigger('routeChanged', {page, query})
        console.log(page, query)
    }
}

const router = new Router(config)
const location = new MyLocation({
    pushState: true,
    router
})

location.start()

```
