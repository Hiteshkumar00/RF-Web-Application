import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private defaultLogo = 'https://image2url.com/r2/default/images/1773590180920-3a186391-6a15-4289-8b28-223340a67f83.jpg';
    private defaultTitle = 'RF Application';

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
