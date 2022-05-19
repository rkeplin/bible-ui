import React from 'react';
import { IVerse } from './BookService';

interface IProps {
    onDisplayCrossRefs: (verse: IVerse) => void;
    verse: IVerse;
}

interface IState {
    highlight: boolean;
}

class VerseDisplay extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            highlight: props.verse.highlight,
        };
    }

    protected onDisplayCrossRefs(event: React.MouseEvent): void {
        event.preventDefault();

        this.props.onDisplayCrossRefs(this.props.verse);
    }

    public render(): JSX.Element {
        return (
            <p key={this.props.verse.verseId} className={`${this.props.verse.highlight ? 'lightyellow' : ''}`}>
                <a
                    title="View Cross References"
                    href="#"
                    onClick={(event: React.MouseEvent) => this.onDisplayCrossRefs(event)}
                >
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
