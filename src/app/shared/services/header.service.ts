import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private defaultLogo = environment.defaultAppLogo;
    private defaultTitle = environment.defaultAppName;

    private logoSource = new BehaviorSubject<string>(this.defaultLogo);
    private titleSource = new BehaviorSubject<string>(this.defaultTitle);

    logo$ = this.logoSource.asObservable();
    title$ = this.titleSource.asObservable();

    setLogo(url: string | null | undefined) {
        this.logoSource.next(url || this.defaultLogo);
    }

    setTitle(title: string | null | undefined) {
        this.titleSource.next(title || this.defaultTitle);
    }
}
