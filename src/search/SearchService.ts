import Config from '../Config';
import HttpService from '../core/HttpService';
import ISearchResult from './ISearchResult';

class SearchService extends HttpService {
    constructor() {
        super(Config.API);
    }

    public async getAll(query: string, translation: string, offset: number, limit: number): Promise<ISearchResult> {
        return this.httpClient
            .get('search', {
                params: {
                    query: query,
                    translation: translation,
                    offset: offset,
                    limit: limit,
                },
            })
            .then((response) => {
                const result: ISearchResult = {
                    items: [],
                    total: 0,
                };

                if (response.status !== 200) {
                    return result;
                }

                if (response.data.items === null) {
                    return result;
                }

                result.total = response.data.total;

                for (let i = 0; i < response.data.items.length; i++) {
                    result.items.push({
                        book: {
                            id: response.data.items[i].book.id,
                            testament: response.data.items[i].book.testament,
                            name: response.data.items[i].book.name,
                        },
                        chapterId: response.data.items[i].chapterId,
                        id: response.data.items[i].id,
                        verse: response.data.items[i].verse,
                        verseId: response.data.items[i].verseId,
                        highlight: false,
                    });
                }

                return result;
            });
    }
}

export default SearchService;
