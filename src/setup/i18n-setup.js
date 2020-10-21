/* eslint-disable */
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enLang from '@/lang/en.json';

Vue.use(VueI18n);

const messages = {
	en: enLang,
};

export const i18n = new VueI18n({
	locale: 'en', // set locale
	fallbackLocale: 'en',
	messages, // set locale messages
	silentTranslationWarn: true,
});

const loadedLanguages = ['en']; // our default language that is preloaded

function setI18nLanguage(lang) {
	i18n.locale = lang;
	document.querySelector('html').setAttribute('lang', lang);
	return lang;
}

export function loadLanguageAsync(lang) {
	if (i18n.locale !== lang) {
		if (!loadedLanguages.includes(lang)) {
			return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then((msgs) => {
				i18n.setLocaleMessage(lang, msgs.default);
				loadedLanguages.push(lang);
				return setI18nLanguage(lang);
			});
		}
		return Promise.resolve(setI18nLanguage(lang));
	}
	return Promise.resolve(lang);
}
