import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserService, { IUser } from '../user/UserService';
import ListService, { IList } from './ListService';

interface IState {
    isLoading: boolean;
    lists: IList[];
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
            lists: [],
        };
    }

    public componentDidMount() {
        this.userService
            .me()
            .then((user: IUser) => {
                console.log(user);

                this.listService.getAll().then((lists) => {
                    this.setState({
                        isLoading: false,
                        lists: lists,
                    });
                });
            })
            .catch(() => {
                this.props.history.push('/user/login');

                window.scrollTo(0, 0);
            });
    }

    public render(): JSX.Element {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            Lists
                            <button className="btn btn-secondary btn-sm pull pull-right" ng-click="vm.showAddForm()">
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
                                <a href="" ng-hide="vm.toggleAddForm" ng-click="vm.showAddForm()">
                                    Add a list.
                                </a>
                            </div>

                            {this.state.lists.map((list: IList, index: number) => {
                                return (
                                    <div key={index} className="well bg-gray mb20 p15">
                                        <button
                                            type="button"
                                            className="pull pull-right btn btn-success btn-sm dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            Action
                                        </button>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item" href="" ng-click="vm.showUpdateForm(list)">
                                                Rename
                                            </a>
                                            <a className="dropdown-item" href="" ng-click="vm.showDeleteForm(list)">
                                                Delete
                                            </a>
                                        </div>

                                        <p>
                                            <b>Updated</b> - <i>{list.dateAdded}</i>
                                        </p>

                                        <p>
                                            <a
                                                href=""
                                                onClick={(event: React.MouseEvent) => {
                                                    event.preventDefault();

                                                    this.props.history.push('/list/' + list.id + '/verses');
                                                }}
                                            >
                                                {list.name}
                                            </a>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/*<div ng-show="vm.toggleAddForm" className="overlay">*/}
                    {/*    <div className="dialog">*/}
                    {/*        <div className="alert alert-danger mb-3" ng-show="vm.error">*/}
                    {/*            <p ng-show="vm.error.description"><b>{{vm.error.description}}</b></p>*/}
                    {/*            <ul ng-show="vm.error.errors">*/}
                    {/*                <li ng-repeat="error in vm.error.errors">{{error}}</li>*/}
                    {/*            </ul>*/}
                    {/*        </div>*/}

                    {/*        <div className="card">*/}
                    {/*            <div className="card-header">*/}
                    {/*                Create List*/}
                    {/*            </div>*/}
                    {/*            <div className="card-body">*/}
                    {/*                <input name="name"*/}
                    {/*                       className="form-control"*/}
                    {/*                       ng-model="vm.list.name"*/}
                    {/*                       type="text"*/}
                    {/*                       placeholder="Enter list name..."*/}
                    {/*                       ng-keypress="vm.onKeyPress($event)"/>*/}
                    {/*            </div>*/}
                    {/*            <div className="card-footer text-right">*/}
                    {/*                <button className="btn btn-default" ng-click="vm.toggleAddForm = false">Cancel*/}
                    {/*                </button>*/}
                    {/*                <button className="btn btn-primary" ng-disabled="vm.isLoading"*/}
                    {/*                        ng-click="vm.add(vm.list)">Add*/}
                    {/*                </button>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div ng-show="vm.toggleUpdateForm" className="overlay">*/}
                    {/*    <div className="dialog">*/}
                    {/*        <div className="alert alert-danger mb-3" ng-show="vm.error">*/}
                    {/*            <p ng-show="vm.error.description"><b>{{vm.error.description}}</b></p>*/}
                    {/*            <ul ng-show="vm.error.errors">*/}
                    {/*                <li ng-repeat="error in vm.error.errors">{{error}}</li>*/}
                    {/*            </ul>*/}
                    {/*        </div>*/}

                    {/*        <div className="card">*/}
                    {/*            <div className="card-header">*/}
                    {/*                Rename List*/}
                    {/*            </div>*/}
                    {/*            <div className="card-body">*/}
                    {/*                <input name="name"*/}
                    {/*                       className="form-control"*/}
                    {/*                       ng-model="vm.list.name"*/}
                    {/*                       type="text"*/}
                    {/*                       placeholder="Enter list name..."*/}
                    {/*                       ng-keypress="vm.onKeyPress($event)"/>*/}
                    {/*            </div>*/}
                    {/*            <div className="card-footer text-right">*/}
                    {/*                <button className="btn btn-default"*/}
                    {/*                        ng-click="vm.toggleUpdateForm = false; vm.list.selected = false;">Cancel*/}
                    {/*                </button>*/}
                    {/*                <button className="btn btn-primary" ng-disabled="vm.isLoading"*/}
                    {/*                        ng-click="vm.update(vm.list)">Save*/}
                    {/*                </button>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*<div ng-show="vm.toggleDeleteForm" className="overlay">*/}
                    {/*    <div className="dialog">*/}
                    {/*        <div className="alert alert-danger mb-3" ng-show="vm.error">*/}
                    {/*            <p ng-show="vm.error.description"><b>{{vm.error.description}}</b></p>*/}
                    {/*            <ul ng-show="vm.error.errors">*/}
                    {/*                <li ng-repeat="error in vm.error.errors">{{error}}</li>*/}
                    {/*            </ul>*/}
                    {/*        </div>*/}

                    {/*        <div className="card">*/}
                    {/*            <div className="card-header">*/}
                    {/*                Delete List*/}
                    {/*            </div>*/}
                    {/*            <div className="card-body">*/}
                    {/*                <p>Are you sure that you want to remove <b>{{vm.list.name}}</b>?</p>*/}
                    {/*            </div>*/}
                    {/*            <div className="card-footer text-right">*/}
                    {/*                <button className="btn btn-default" ng-click="vm.toggleDeleteForm = false;">No*/}
                    {/*                </button>*/}
                    {/*                <button className="btn btn-primary" ng-disabled="vm.isLoading"*/}
                    {/*                        ng-click="vm.remove(vm.list)">Yes*/}
                    {/*                </button>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export default withRouter(ManageLists);
