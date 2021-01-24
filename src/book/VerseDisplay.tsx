import React from 'react';

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

interface IProps {
    verse: IVerse;
}

class VerseDisplay extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            highlight: props.verse.highlight,
        };
    }

    public render(): JSX.Element {
        return (
            <p key={this.props.verse.verseId} className={`${this.props.verse.highlight ? 'lightyellow' : ''}`}>
                <a title="View Cross References" href="#">
                    <b>
                        {this.props.verse.chapterId}:{this.props.verse.verseId}
                    </b>
                </a>
                &nbsp;{this.props.verse.verse}
            </p>
        );
    }
}

export default VerseDisplay;
