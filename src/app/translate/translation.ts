// app/translate/translation.ts

import { InjectionToken } from '@angular/core';

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_ZH_NAME, LANG_ZH_TRANS } from './lang-zh';
import { LANG_ZH_HANS_NAME, LANG_ZH_HANS_TRANS } from './lang-zh-hans';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// all translations
export const dictionary = {
    [LANG_EN_NAME]: LANG_EN_TRANS,
    [LANG_ZH_NAME]: LANG_ZH_TRANS,
    [LANG_ZH_HANS_NAME]: LANG_ZH_HANS_TRANS,
};

// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];