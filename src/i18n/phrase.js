import Polyglot from 'node-polyglot'
import en from './phrase-en'
import ko from './phrase-ko'

const PHRASES = { en, ko }

export default class Phrase {
    constructor(locale) {
        if (PHRASES[locale]) {
            this.locale = locale
        } else {
            this.locale = 'en'
        }
        this.polyglot = new Polyglot({
            phrases: PHRASES[this.locale],
            locale: this.locale,
        })
    }
    load() {
        return (key, options = {}) => {
            return this.polyglot.t(key, {
                smartCount: options.smart_count,
                ...options,
            })
        }
    }
}