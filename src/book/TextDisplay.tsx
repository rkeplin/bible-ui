import React from 'react';
import Config from '../Config';
import VerseDisplay from './VerseDisplay';
import IBook from './IBook';
import ITranslation from './ITranslation';

interface IVerse {
    book: IBook;
    chapterId: number;
    id: number;
    verse: string;
    verseId: number;
    highlight: boolean;
}

interface IProps {
    translation: ITranslation;
    bookId: number;
    chapterId: number;
}

interface IState {
    versesLeft: IVerse[];
    versesRight: IVerse[];
    book: IBook;
}

class TextDisplay extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            versesLeft: [],
            versesRight: [],
            book: {
                id: 1,
                name: 'Genesis',
                testament: 'Old Testament',
            },
        };
    }

    private load() {
        fetch(
            `${Config.API}/books/${this.props.bookId}/chapters/${
                this.props.chapterId
            }?translation=${this.props.translation.abbreviation.toLowerCase()}`,
        )
            .then((res) => res.json())
            .then(
                (result) => {
                    const versesLeft: IVerse[] = [],
                        versesRight: IVerse[] = [];

                    for (let i = 0; i < result.length; i++) {
                        result[i].highlight = false;

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

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        let update = false;

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

    public componentDidMount() {
        this.load();
    }

    public render(): JSX.Element {
        return (
            <div>
                <div className="row">
                    <div className="col-md-6">
                        {this.state.versesLeft.map((value: IVerse, index: number) => {
                            return <VerseDisplay key={index} verse={value} />;
                        })}
                    </div>
                    <div className="col-md-6">
                        {this.state.versesRight.map((value: IVerse, index: number) => {
                            return <VerseDisplay key={index} verse={value} />;
                        })}
                    </div>
                </div>
                {/*<cross-reference-modal></cross-reference-modal>*/}
            </div>
        );
    }
}

export default TextDisplay;
