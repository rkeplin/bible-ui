import React from 'react';
import Config from '../Config';
import ITranslation from './ITranslation';

interface IProps {
    onChange: (translation: ITranslation) => void;
}

interface IState {
    isLoading: boolean;
    selected: ITranslation;
    translations: [];
}

class TranslationSelector extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            selected: {
                id: 4,
                abbreviation: 'KJV',
                version: 'King James Version',
            },
            isLoading: true,
            translations: [],
        };
    }

    public componentDidMount() {
        this.setState({
            isLoading: true,
        });

        fetch(`${Config.API}/translations`)
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

    private update(e: React.MouseEvent, selectedTranslation: ITranslation): void {
        e.preventDefault();

        this.setState({
            selected: selectedTranslation,
        });

        this.props.onChange(selectedTranslation);
    }

    public render(): JSX.Element {
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
