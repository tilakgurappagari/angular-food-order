import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

let orders = JSON.parse(localStorage.getItem('orders')) || [];
const feedItems =[{
    "feedId": 1,
    "restaurant": "reddys biriyani zone",
    "dishName": "roasted chicken biriyani",
    "description": "Indian Restaurant",
    "rating": 4.0,
    "cost": 190,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 2,
    "restaurant": "kabablo",
    "dishName": "Cajun spiced chicken",
    "description": "Indian Restaurant",
    "rating": 4.1,
    "cost": 230,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 3,
    "restaurant": "main land china",
    "dishName": "Veg Momos",
    "description": "Chineese Restaurant",
    "rating": 3.9,
    "cost": 250,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 4,
    "restaurant": "beijing bites",
    "dishName": "cripy fried chicken momos",
    "description": "Chineese Restaurant",
    "rating": 4.2,
    "cost": 180,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
},
{
    "feedId": 5,
    "restaurant": "mcdonald's",
    "dishName": "American cheese burger",
    "description": "American Restaurant",
    "rating": 3.9,
    "cost": 260,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 6,
    "restaurant": "KFC",
    "dishName": "KFC chicken bucket",
    "description": "American Restaurant",
    "rating": 4.1,
    "cost": 599,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 7,
    "restaurant": "home kitchen services",
    "dishName": "mix non veg noodles",
    "description": "Chineese Restaurant",
    "rating": 3.9,
    "cost": 100,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
},
{
    "feedId": 8,
    "restaurant": "hotel shalimar",
    "dishName": "chicken fried rice",
    "description": "chineese Restaurant",
    "rating": 4.4,
    "cost": 190,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 9,
    "restaurant": "al arabia",
    "dishName": "Chicken shawarma",
    "description": "Lebaneese style Restaurant",
    "rating": 4.2,
    "cost": 120,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 10,
    "restaurant": "al bek",
    "dishName": "Alfaham Chicken",
    "description": "Lebaneese style Restaurant",
    "rating": 4.1,
    "cost": 230,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
},{
    "feedId": 8,
    "restaurant": "hotel shalimar",
    "dishName": "chicken fried rice",
    "description": "chineese Restaurant",
    "rating": 4.4,
    "cost": 190,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 9,
    "restaurant": "al arabia",
    "dishName": "Chicken shawarma",
    "description": "Lebaneese style Restaurant",
    "rating": 4.2,
    "cost": 120,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}, {
    "feedId": 10,
    "restaurant": "al bek",
    "dishName": "Alfaham Chicken",
    "description": "Lebaneese style Restaurant",
    "rating": 4.1,
    "cost": 230,
    "imageUrl": "http://dummyimage.com/128x100.png/ff4444/ffffff"
}]
let feeds = localStorage.setItem('feed',JSON.stringify(feedItems));

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/feed') && method === 'GET':
                     return getAllFoodItems();
                case url.endsWith('/users/validateEmail') && method === 'POST':
                    return validateEmail();
                case url.endsWith('/cart/orders') && method === 'GET':
                    return getAllOrders();
                case url.endsWith('/cart/placeOrder') && method === 'POST':
                    return placeOrder();
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                case url.endsWith('/users') && method === 'GET':
                    return getUsers();
                case url.match(/\/users\/\d+$/) && method === 'DELETE':
                    return deleteUser();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) return error('Email or password is incorrect. Register if you are First Time user');
            return ok({
                id: user.id,
                fullname: user.fullname,
                phone: user.phone,
                email: user.email,
                token: 'fake-jwt-token'
            })
        }

        function validateEmail() {
            const { email } = body;
            const user = users.find(x => x.email === email);
            if (!user) return error('Email id not Registered');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: 'fake-jwt-token'
            })
        }

        function register() {
            const user = body

            if (users.find(x => x.email === user.email)) {
                return error('User with the email "' + user.email + '"  already exists')
            }

            user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));

            return ok();
        }

        function placeOrder() {
            orders.push({ id: Math.random(), placedOrder:body});
            localStorage.setItem('orders', JSON.stringify(orders));
            return ok();
        }
        

        function getUsers() {
            if (!isLoggedIn()) return unauthorized();
            return ok(users);
        }

        function deleteUser() {
            if (!isLoggedIn()) return unauthorized();

            users = users.filter(x => x.id !== idFromUrl());
            localStorage.setItem('users', JSON.stringify(users));
            return ok();
        }

        function getAllFoodItems() {
            if (!isLoggedIn()) return unauthorized();
            return ok(JSON.parse(localStorage.getItem('feed')) || []);
        }
        function getAllOrders() {
            if (!isLoggedIn()) return unauthorized();
            return ok(JSON.parse(localStorage.getItem('orders')) || []);
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorized' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};