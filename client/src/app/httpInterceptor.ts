import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injector } from '@angular/core';
import { UserService } from './services/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector, private userService: UserService) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {
        const jwtToken = localStorage.getItem("jwt_token");
        this.userService = this.injector.get(UserService);

        if (jwtToken) {
            this.userService.ifLoggedIn(true);
        }        

        if (this.userService.ifLoggedIn()) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + jwtToken)
            });
            return next.handle(cloned);
        }
        return next.handle(req);
    }
}