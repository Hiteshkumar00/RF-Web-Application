import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeaderService {
    private logoSource = new BehaviorSubject<string>('https://image2url.com/r2/default/images/1773590180920-3a186391-6a15-4289-8b28-223340a67f83.jpg');
    private titleSource = new BehaviorSubject<string>('RF Application');

    logo$ = this.logoSource.asObservable();
    title$ = this.titleSource.asObservable();

    setLogo(url: string) {
        this.logoSource.next(url);
    }

    setTitle(title: string) {
        this.titleSource.next(title);
    }
}
