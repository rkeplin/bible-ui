import React from 'react';
import BookService, { ITranslation, IVerse } from './BookService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProps {
    open: boolean;
    side?: string;
    verse?: IVerse;
    translation?: ITranslation;
    toggleModal: (open: boolean) => void;
}

interface IStyle {
    display: string;
    left?: string;
    right?: string;
}

interface IState {
    isLoading: boolean;
    relatedVerses: IVerse[][];
    style: IStyle;
}

class CrossReference extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isLoading: true,
            relatedVerses: [],
            style: {
                display: 'none',
            },
        };
    }

    protected onClose(event: React.MouseEvent): void {
        event.preventDefault();

        this.close();
    }

    protected close(): void {
        this.setState({
            style: {
                display: 'none',
            },
        });

        this.props.toggleModal(false);
    }

    protected load(): void {
        this.setState({
            isLoading: true,
            relatedVerses: [],
        });

        const service = new BookService();

        service.getCrossReferences(this.props.verse?.id, this.props.translation?.abbreviation).then((result) => {
            this.setState({
                isLoading: false,
                relatedVerses: result,
            });
        });

        if (this.props.side == 'R') {
            this.setState({
                style: {
                    display: 'block',
                    right: '0px',
                },
            });
        } else {
            this.setState({
                style: {
                    display: 'block',
                    left: '0px',
                },
            });
        }

        this.props.toggleModal(true);
    }

    protected handleKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Escape':
                this.close();
                break;
        }
    }

    public componentWillUnmount(): void {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    public componentDidMount(): void {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    public componentDidUpdate(prevProps: Readonly<IProps>): void {
        if (!this.props.open) {
            return;
        }

        if (prevProps.open !== this.props.open) {
            this.load();

            return;
        }

        if (prevProps.verse?.id !== this.props.verse?.id) {
            this.load();

            return;
        }

        if (prevProps.translation?.id !== this.props.translation?.id) {
            this.load();

            return;
        }
    }

    public render(): JSX.Element {
        return (
            <div id="crossReferenceModal" style={this.state.style}>
                <p>
                    <i style={{ display: this.state.isLoading ? 'inline-block' : 'none' }}>
                        Finding Cross References...
                    </i>
                    <i style={{ display: !this.state.isLoading ? 'inline-block' : 'none' }}>
                        Found {this.state.relatedVerses.length} Cross References
                    </i>
                    <span className="pull-right">
                        <button
                            className="btn btn-primary btn-sm"
                            title="Close"
                            onClick={(event: React.MouseEvent) => this.onClose(event)}
                        >
                            <FontAwesomeIcon icon="minus-circle" /> Close
                        </button>
                    </span>
                </p>

                <div style={{ display: this.state.isLoading ? 'block' : 'none' }}>Loading...</div>

                <div className="overflow clear">
                    {this.state.relatedVerses.map((item: IVerse[], index: number) => {
                        return (
                            <div key={index} className="well mb20 p15 bg-gray">
                                {item.map((verse: IVerse, index: number) => {
                                    return (
                                        <div key={index}>
                                            <p style={{ display: index === 0 ? 'block' : 'none' }}>
                                                <b>{verse.book.name}</b> - <i>{verse.book.testament}</i>
                                            </p>
                                            <p>
                                                <b>
                                                    {verse.chapterId}:{verse.verseId}
                                                </b>
                                                &nbsp;{verse.verse}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default CrossReference;
