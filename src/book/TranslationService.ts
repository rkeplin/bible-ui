import Config from '../Config';
import HttpService from '../core/HttpService';
import { ITranslation } from './BookService';

class TranslationService extends HttpService {
    protected translationCache: ITranslation;

    constructor() {
        super(Config.API);

        this.translationCache = this.getDefaultTranslation();
    }

    public async getAll(): Promise<ITranslation[]> {
        return this.httpClient.get('translations').then((response) => {
            const collection: ITranslation[] = [];

            if (response.status !== 200) {
                return collection;
            }

            for (let i = 0; i < response.data.length; i++) {
                collection.push({
                    id: response.data[i].id,
                    abbreviation: response.data[i].abbreviation,
                    version: response.data[i].version,
                });
            }

            return collection;
        });
    }

    public async get(translationAbbr: string): Promise<ITranslation> {
        if (this.translationCache.abbreviation == translationAbbr) {
            return this.translationCache;
        }

        const translation: ITranslation = this.getDefaultTranslation();

        return this.httpClient.get('translations').then((response) => {
            if (response.status !== 200) {
                return translation;
            }

            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].abbreviation === translationAbbr) {
                    translation.id = response.data[i].id;
                    translation.abbreviation = response.data[i].abbreviation;
                    translation.version = response.data[i].version;

                    break;
                }
            }

            this.translationCache = translation;

            return translation;
        });
    }

    public getDefaultTranslation(): ITranslation {
        return {
            id: 4,
            abbreviation: 'KJV',
            version: 'King James Version',
        };
    }
}

export default TranslationService;
