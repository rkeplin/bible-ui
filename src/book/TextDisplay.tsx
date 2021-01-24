import React from 'react';
import Config from '../Config';
import VerseDisplay from './VerseDisplay';

interface IVerse {
    book: IBook;
    chapterId: number;
    id: number;
    verse: string;
    verseId: number;
    highlight: boolean;
}

interface IBook {
    id: number;
    name: string;
    testament: string;
}

interface IState {
    versesLeft: IVerse[];
    versesRight: IVerse[];
    book: IBook;
}

class TextDisplay extends React.Component<any, IState> {
    constructor(props: any) {
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

    public componentDidMount() {
        fetch(`${Config.API}/books/1/chapters/1`)
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
