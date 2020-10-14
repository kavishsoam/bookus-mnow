import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from './translation'; // import our opaque token

@Injectable()
export class TranslateService {
    
    private _currentLang: string;

    public get currentLang() {
        this._currentLang = localStorage.getItem('language')
        return this._currentLang;
    }

    // inject our translations
    constructor(@Inject(TRANSLATIONS) private _translations: any) {
    }

    public use(lang: string): void {
        let value = localStorage.getItem('language')
        // set current language
        this._currentLang = value;
    }

    private translate(key: string): string {
        // private perform translation
        let translation = key;

        if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
            return this._translations[this.currentLang][key];
        }

        return translation;
    }

    public instant(key: string) {
        // call translation
        return this.translate(key); 
    }
}