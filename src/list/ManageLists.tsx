import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserService, { IUser } from '../user/UserService';
import ListService, { IList } from './ListService';
import FormError, { IFormError } from '../core/FormError';
import { AxiosError } from 'axios';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IState {
    isLoading: boolean;
    isSaving: boolean;
    lists: IList[];
    list: IList;
    addError: IFormError;
    updateError: IFormError;
    deleteError: IFormError;
    displayAddDialog: boolean;
    displayUpdateDialog: boolean;
    displayDeleteDialog: boolean;
}

class ManageLists extends React.Component<RouteComponentProps, IState> {
    protected userService: UserService;
    protected listService: ListService;

    constructor(props: any) {
        super(props);

        this.userService = new UserService();
        this.listService = new ListService();

        this.state = {
            isLoading: true,
            isSaving: false,
            lists: [],
            list: {
                id: '',
                name: '',
                dateAdded: '',
            },
            addError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            updateError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            deleteError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            displayAddDialog: false,
            displayUpdateDialog: false,
            displayDeleteDialog: false,
        };
    }

    protected onWindowKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                this.clearDialogs();
                break;
        }
    }

    protected handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>, callback: () => void) {
        switch (event.key) {
            case 'Enter':
                callback();
                break;
        }
    }

    protected clearDialogs() {
        this.setState({
            list: {
                id: '',
                name: '',
                dateAdded: '',
            },
            addError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            updateError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            deleteError: {
                hasError: false,
                errorDescription: '',
                errors: [],
            },
            displayAddDialog: false,
            displayUpdateDialog: false,
            displayDeleteDialog: false,
        });
    }

    protected load() {
        this.listService.getAll().then((lists) => {
            this.setState({
                isLoading: false,
                lists: lists,
            });
        });
    }

    public componentDidMount() {
        this.userService
            .me()
            .then((user: IUser) => {
                this.load();
            })
            .catch(() => {
                this.props.history.push('/user/login');

                window.scrollTo(0, 0);
            });

        window.addEventListener('keydown', (event: KeyboardEvent) => this.onWindowKeyDown(event), false);
    }

    public componentWillUnmount() {
        window.removeEventListener('keydown', (event: KeyboardEvent) => this.onWindowKeyDown(event), false);
    }

    protected onAddListClick(event: React.MouseEvent) {
        event.preventDefault();

        this.setState({
            displayAddDialog: true,
        });
    }

    protected onUpdateListClick(event: React.MouseEvent, list: IList) {
        event.preventDefault();

        this.setState({
            list: list,
            displayUpdateDialog: true,
        });
    }

    protected onDeleteListClick(event: React.MouseEvent, list: IList) {
        event.preventDefault();

        this.setState({
            list: list,
            displayDeleteDialog: true,
        });
    }

    protected async create(list: IList) {
        this.setState({
            isSaving: true,
        });

        this.listService
            .add(list)
            .then(() => {
                this.load();
                this.clearDialogs();
            })
            .catch((error: AxiosError) => {
                this.setState({
                    addError: {
                        hasError: true,
                        errorDescription: error.response?.data?.description
                            ? error.response?.data?.description
                            : 'Error',
                        errors: error.response?.data?.errors ? error.response?.data?.errors : [],
                    },
                });
            })
            .finally(() => {
                this.setState({
                    isSaving: false,
                });
            });
    }

    protected async update(list: IList) {
        this.setState({
            isSaving: true,
        });

        this.listService
            .update(list.id, list)
            .then(() => {
                this.load();
                this.clearDialogs();
            })
            .catch((error: AxiosError) => {
                this.setState({
                    addError: {
                        hasError: true,
                        errorDescription: error.response?.data?.description
                            ? error.response?.data?.description
                            : 'Error',
                        errors: error.response?.data?.errors ? error.response?.data?.errors : [],
                    },
                });
            })
            .finally(() => {
                this.setState({
                    isSaving: false,
                });
            });
    }

    protected async remove(list: IList) {
        this.setState({
            isSaving: true,
        });

        this.listService
            .remove(list.id)
            .then(() => {
                this.load();
                this.clearDialogs();
            })
            .catch((error: AxiosError) => {
                this.setState({
                    addError: {
                        hasError: true,
                        errorDescription: error.response?.data?.description
                            ? error.response?.data?.description
                            : 'Error',
                        errors: error.response?.data?.errors ? error.response?.data?.errors : [],
                    },
                });
            })
            .finally(() => {
                this.setState({
                    isSaving: false,
                });
            });
    }

    public render(): JSX.Element {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            Lists
                            <button
                                className="btn btn-secondary btn-sm pull pull-right"
                                disabled={this.state.isLoading}
                                onClick={(event: React.MouseEvent) => this.onAddListClick(event)}
                            >
                                Add List
                            </button>
                        </div>
                        <div className="card-body">
                            <div style={{ display: this.state.isLoading ? 'block' : 'none' }}>Loading...</div>

                            <div
                                style={{
                                    display: this.state.lists.length == 0 && !this.state.isLoading ? 'block' : 'none',
                                }}
                            >
                                You don&apos;t have a list yet.{' '}
                                <a
                                    href=""
                                    style={{ display: this.state.lists.length < 50 ? 'inline-block' : 'none' }}
                                    onClick={(event: React.MouseEvent) => this.onAddListClick(event)}
                                >
                                    Add a list.
                                </a>
                            </div>

                            {this.state.lists.map((list: IList, index: number) => {
                                return (
                                    <div key={index} className="well bg-gray mb20 p15">
                                        <div className="pull pull-right">
                                            <button
                                                className="btn btn-primary btn-sm mr-1"
                                                title="Manage Verses"
                                                onClick={(event: React.MouseEvent) => {
                                                    event.preventDefault();

                                                    this.props.history.push('/list/' + list.id + '/verses');
                                                }}
                                            >
                                                <FontAwesomeIcon icon="list" />
                                            </button>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                title="Remove List"
                                                onClick={(event: React.MouseEvent) =>
                                                    this.onDeleteListClick(event, list)
                                                }
                                            >
                                                <FontAwesomeIcon icon="minus-circle" />
                                            </button>
                                        </div>

                                        <p className="text-secondary">
                                            <b>{moment(list.dateUpdated).format('MMM Do, YYYY')}</b> -{' '}
                                            <i>Last Updated</i>
                                        </p>

                                        <h3 className="mr-2" style={{ display: 'inline-block' }}>
                                            <a
                                                href=""
                                                title="Rename"
                                                onClick={(event: React.MouseEvent) =>
                                                    this.onUpdateListClick(event, list)
                                                }
                                            >
                                                {list.name}
                                            </a>
                                        </h3>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ display: this.state.displayAddDialog ? 'block' : 'none' }} className="overlay">
                        <div className="dialog">
                            <FormError
                                hasError={this.state.addError.hasError}
                                errorDescription={this.state.addError.errorDescription}
                                errors={this.state.addError.errors}
                            />

                            <div className="card">
                                <div className="card-header">Create List</div>
                                <div className="card-body">
                                    <input
                                        id="input_add"
                                        name="name"
                                        className="form-control"
                                        value={this.state.list.name}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({
                                                list: {
                                                    id: this.state.list.id,
                                                    name: event.target.value,
                                                    dateAdded: this.state.list.dateAdded,
                                                },
                                            })
                                        }
                                        type="text"
                                        placeholder="Enter list name..."
                                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                            this.handleKeyPress(event, () => this.create(this.state.list))
                                        }
                                    />
                                </div>
                                <div className="card-footer text-right">
                                    <button className="btn btn-default mr-2" onClick={() => this.clearDialogs()}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        disabled={this.state.isSaving}
                                        onClick={() => this.create(this.state.list)}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: this.state.displayUpdateDialog ? 'block' : 'none' }} className="overlay">
                        <div className="dialog">
                            <FormError
                                hasError={this.state.updateError.hasError}
                                errorDescription={this.state.updateError.errorDescription}
                                errors={this.state.updateError.errors}
                            />

                            <div className="card">
                                <div className="card-header">Rename List</div>
                                <div className="card-body">
                                    <input
                                        id="input_rename"
                                        name="name"
                                        className="form-control"
                                        value={this.state.list.name}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({
                                                list: {
                                                    id: this.state.list.id,
                                                    name: event.target.value,
                                                    dateAdded: this.state.list.dateAdded,
                                                },
                                            })
                                        }
                                        type="text"
                                        placeholder="Enter list name..."
                                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                            this.handleKeyPress(event, () => this.update(this.state.list))
                                        }
                                    />
                                </div>
                                <div className="card-footer text-right">
                                    <button className="btn btn-default mr-2" onClick={() => this.clearDialogs()}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        disabled={this.state.isSaving}
                                        onClick={() => this.update(this.state.list)}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: this.state.displayDeleteDialog ? 'block' : 'none' }} className="overlay">
                        <div className="dialog">
                            <FormError
                                hasError={this.state.deleteError.hasError}
                                errorDescription={this.state.deleteError.errorDescription}
                                errors={this.state.deleteError.errors}
                            />

                            <div className="card">
                                <div className="card-header">Delete List</div>
                                <div className="card-body">
                                    <p>
                                        Are you sure that you want to remove <b>{this.state.list.name}</b>?
                                    </p>
                                </div>
                                <div className="card-footer text-right">
                                    <button className="btn btn-default mr-2" onClick={() => this.clearDialogs()}>
                                        No
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        disabled={this.state.isSaving}
                                        onClick={() => this.remove(this.state.list)}
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ManageLists);
