class URLParser {
    private static REGEX = /\/book\/([a-z]{3,5})\/([\d]{1,3})\/([\d]{1,3})/;

    protected url: string;

    protected translation: string;

    protected bookId: number;

    protected chapterId: number;

    protected bookUrl: boolean;

    constructor(url: string) {
        this.url = url;
        this.bookUrl = false;
        this.translation = 'KJV';
        this.bookId = 1;
        this.chapterId = 1;

        const matches = url.match(URLParser.REGEX);

        if (matches !== null && matches.length >= 4) {
            this.translation = matches[1].toUpperCase();
            this.bookId = parseInt(matches[2]);
            this.chapterId = parseInt(matches[3]);

            this.bookUrl = true;
        }
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
}

export default URLParser;
