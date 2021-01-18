import React from 'react';

interface IState {
    isLoading: boolean;
    selected: ITranslation;
    translations: [];
}

interface ITranslation {
    abbreviation: string;
    id: number;
    version: string;
}

class TranslationSelector extends React.Component<any, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selected: {
                abbreviation: 'KJV',
                id: 4,
                version: 'King James Version',
            },
            isLoading: true,
            translations: [],
        };
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
        });

        fetch('http://bible-go-api.rkeplin.local/v1/translations')
            .then((res) => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoading: false,
                        translations: result,
                    });
                },
                (error) => {
                    console.warn(error);

                    this.setState({
                        isLoading: false,
                        translations: [],
                    });
                },
            );
    }

    update(e: React.MouseEvent, selectedTranslation: ITranslation): void {
        e.preventDefault();

        this.setState({
            selected: selectedTranslation,
        });
    }

    render(): JSX.Element {
        return (
            <div style={{ display: 'inline-block' }}>
                <button
                    type="button"
                    className={`btn btn-primary btn-sm dropdown-toggle ${this.state.isLoading ? 'disabled' : ''}`}
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                >
                    {this.state.selected.abbreviation}
                </button>
                <div className="dropdown-menu">
                    {this.state.translations.map((value: ITranslation, index: number) => {
                        return (
                            <a
                                key={index}
                                href=""
                                className={`dropdown-item ${
                                    this.state.selected.id === value.id ? 'bg-brown text-white' : ''
                                }`}
                                onClick={(e) => this.update(e, value)}
                            >
                                {value.abbreviation}
                            </a>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TranslationSelector;
