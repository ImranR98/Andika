import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';
import { UserService } from './services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) { }

    private userService: UserService;

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem("id_token");

        if (idToken) {
            this.userService = this.injector.get(UserService);
            if (this.userService.isLoggedIn()) {
                const cloned = req.clone({
                    headers: req.headers.set("Authorization",
                        "Bearer " + idToken)
                });
                return next.handle(cloned);
            }
        }
        else {
            return next.handle(req);
        }
    }
}