class URLParser {
    private static BOOK_PAGE_REGEX = /\/book\/([a-z]{3,5})\/([\d]{1,3})\/([\d]{1,3})/;

    private static SEARCH_PAGE_REGEX = /\/search\/([a-z]{3,5})/;

    protected url: string;

    protected translation: string;

    protected bookId: number;

    protected chapterId: number;

    protected verseId: number;

    protected bookUrl: boolean;

    protected searchUrl: boolean;

    constructor(url: string, queryString: string) {
        this.url = url;
        this.bookUrl = false;
        this.searchUrl = false;
        this.translation = 'KJV';
        this.bookId = 1;
        this.chapterId = 1;
        this.verseId = 0;

        let matches = url.match(URLParser.BOOK_PAGE_REGEX);

        if (matches !== null && matches.length >= 4) {
            this.translation = matches[1].toUpperCase();
            this.bookId = parseInt(matches[2]);
            this.chapterId = parseInt(matches[3]);

            if (queryString.startsWith('?verseId=')) {
                this.verseId = parseInt(queryString.substr(9, queryString.length));
            }

            this.bookUrl = true;

            return;
        }

        matches = url.match(URLParser.SEARCH_PAGE_REGEX);

        if (matches !== null && matches.length >= 2) {
            this.translation = matches[1].toUpperCase();

            if (queryString.startsWith('?verseId=')) {
                this.verseId = parseInt(queryString.substr(9, queryString.length));
            }

            this.searchUrl = true;
        }
    }

    public isSearchURL() {
        return this.searchUrl;
    }

    public isBookURL() {
        return this.bookUrl;
    }

    public getTranslation() {
        return this.translation.toUpperCase();
    }

    public getBookId() {
        return this.bookId;
    }

    public getChapterId() {
        return this.chapterId;
    }

    public getVerseId() {
        return this.verseId;
    }
}

export default URLParser;
