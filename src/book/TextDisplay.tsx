import React from 'react';
import VerseDisplay from './VerseDisplay';
import CrossReference from './CrossReference';
import BookService, { IBook, ITranslation, IVerse } from './BookService';

interface IProps {
    translation: ITranslation;
    bookId: number;
    chapterId: number;
    verseId: number;
    toggleCrossRefModal: (selectedVerse: IVerse | undefined, open: boolean) => void;
}

interface IState {
    displayCrossRefs: boolean;
    crossRefSide?: string;
    selectedVerse?: IVerse;
    versesLeft: IVerse[];
    versesRight: IVerse[];
    book: IBook;
}

class TextDisplay extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            displayCrossRefs: false,
            versesLeft: [],
            versesRight: [],
            book: {
                id: 1,
                name: 'Genesis',
                testament: 'Old Testament',
            },
        };
    }

    protected load(): void {
        const service = new BookService();

        service.getText(this.props.bookId, this.props.chapterId, this.props.translation.abbreviation).then(
            (result) => {
                const versesLeft: IVerse[] = [],
                    versesRight: IVerse[] = [];

                for (let i = 0; i < result.length; i++) {
                    result[i].highlight = false;

                    if (this.props.verseId === result[i].verseId) {
                        result[i].highlight = true;
                    }

                    if (i < result.length / 2) {
                        versesLeft.push(result[i]);

                        continue;
                    }

                    versesRight.push(result[i]);
                }

                this.setState({
                    versesLeft: versesLeft,
                    versesRight: versesRight,
                    book: result[0].book,
                });
            },
            (error) => {
                console.warn(error);
            },
        );
    }

    public componentDidUpdate(prevProps: Readonly<IProps>): void {
        let update = false;

        if (prevProps.verseId !== this.props.verseId) {
            update = true;
        }

        if (prevProps.chapterId !== this.props.chapterId) {
            update = true;
        }

        if (prevProps.bookId !== this.props.bookId) {
            update = true;
        }

        if (prevProps.translation.id !== this.props.translation.id) {
            update = true;
        }

        if (update) {
            this.load();
        }
    }

    public componentDidMount(): void {
        this.load();
    }

    protected onDisplayCrossRefs(verse: IVerse, side: string): void {
        this.setState({
            displayCrossRefs: true,
            crossRefSide: side,
            selectedVerse: verse,
        });
    }

    protected toggleCrossRefModal(open: boolean): void {
        this.setState({
            displayCrossRefs: open,
        });

        this.props.toggleCrossRefModal(this.state.selectedVerse, open);
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        {this.state.versesLeft.map((value: IVerse, index: number) => {
                            return (
                                <VerseDisplay
                                    onDisplayCrossRefs={(verse: IVerse) => this.onDisplayCrossRefs(verse, 'R')}
                                    key={index}
                                    verse={value}
                                />
                            );
                        })}
                    </div>
                    <div className="col-md-6">
                        {this.state.versesRight.map((value: IVerse, index: number) => {
                            return (
                                <VerseDisplay
                                    onDisplayCrossRefs={(verse: IVerse) => this.onDisplayCrossRefs(verse, 'L')}
                                    key={index}
                                    verse={value}
                                />
                            );
                        })}
                    </div>
                </div>

                <CrossReference
                    open={this.state.displayCrossRefs}
                    side={this.state.crossRefSide}
                    verse={this.state.selectedVerse}
                    translation={this.props.translation}
                    toggleModal={(open) => this.toggleCrossRefModal(open)}
                />
            </div>
        );
    }
}

export default TextDisplay;
