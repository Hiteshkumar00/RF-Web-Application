import { Injectable, inject } from '@angular/core';
import { SystemConfigurationService } from '../../features/system-configuration/services/system-configuration.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalConfigService {
    private configService = inject(SystemConfigurationService);
    
    private _tableScrollHeight = new BehaviorSubject<string>('425px');
    private _enableDeleteAccount = new BehaviorSubject<boolean>(false);

    tableScrollHeight$ = this._tableScrollHeight.asObservable();
    enableDeleteAccount$ = this._enableDeleteAccount.asObservable();

    get tableScrollHeight(): string {
        return this._tableScrollHeight.value;
    }

    get enableDeleteAccount(): boolean {
        return this._enableDeleteAccount.value;
    }

    async init() {
        try {
            console.log('GlobalConfigService: Initializing...');
            const configs = await firstValueFrom(this.configService.getAll());
            console.log('GlobalConfigService: Received configs:', configs);
            if (configs) {
                const scrollConfig = configs.find(c => c.propertyName?.toLowerCase() === 'tablescrollheight');
                if (scrollConfig && scrollConfig.propertyValue) {
                    console.log('GlobalConfigService: Setting tableScrollHeight to', scrollConfig.propertyValue);
                    this._tableScrollHeight.next(scrollConfig.propertyValue);
                }

                const deleteConfig = configs.find(c => c.propertyName?.toLowerCase() === 'enabledeleteaccount');
                if (deleteConfig) {
                    const isEnabled = deleteConfig.propertyValue === 'true';
                    console.log('GlobalConfigService: Setting enableDeleteAccount to', isEnabled);
                    this._enableDeleteAccount.next(isEnabled);
                }
            }
        } catch (error) {
            console.error('GlobalConfigService: Error loading global configurations', error);
        }
    }
}
