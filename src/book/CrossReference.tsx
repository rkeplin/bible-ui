import React from 'react';
import IVerse from './IVerse';
import Config from '../Config';
import ITranslation from './ITranslation';
import BookService from './BookService';

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
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            relatedVerses: [],
            style: {
                display: 'none',
            },
        };
    }

    close() {
        this.setState({
            style: {
                display: 'none',
            },
        });

        this.props.toggleModal(false);
    }

    private load() {
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

    private handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                this.close();
                break;
        }
    }

    public componentWillUnmount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    public componentDidMount() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<any>, snapshot?: any) {
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
                        <a href="#" onClick={() => this.close()}>
                            [x] close
                        </a>
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
