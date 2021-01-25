import React from 'react';
import IVerse from './IVerse';

interface IProps {
    open: boolean;
    side?: string;
    verse?: IVerse;
    toggleModal: (open: boolean) => void;
}

interface IStyle {
    display: string;
    left?: string;
    right?: string;
}

interface IState {
    style: IStyle;
}

class CrossReference extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
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
        alert('firing off');

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

    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<any>, snapshot?: any) {
        if (!this.props.open) {
            return;
        }

        if (typeof this.props.verse === 'undefined') {
            return;
        }

        if (typeof prevProps.verse === 'undefined') {
            this.load();

            return;
        }

        if (prevProps.open !== this.props.open) {
            this.load();

            return;
        }
    }

    public render(): JSX.Element {
        return (
            <div id="crossReferenceModal" style={this.state.style}>
                <p>
                    <i ng-show="vm.isLoading">Finding Cross References...</i>
                    <i ng-show="!vm.isLoading">Found XYZ Cross References</i>
                    <span className="pull-right">
                        <a href="#" onClick={() => this.close()}>
                            [x] close
                        </a>
                    </span>
                </p>

                <div>Loading...</div>

                <div className="overflow clear">
                    <div className="well mb20 p15 bg-gray" ng-repeat="items in vm.relatedVerses">
                        <div ng-repeat="relatedVerse in items">
                            <p ng-show="$first">
                                <b>Genesis</b> - <i>Old Testament</i>
                            </p>
                            <p>
                                <b>1:2</b> Something something something
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CrossReference;
