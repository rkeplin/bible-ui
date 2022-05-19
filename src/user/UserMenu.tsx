import React from 'react';
import { RouteComponentProps, withRouter, Link } from 'react-router-dom';

interface IProps extends RouteComponentProps {
    loggedIn: boolean;
}

class UserMenu extends React.Component<IProps, never> {
    constructor(props: IProps) {
        super(props);
    }

    private onLoginClick(event: React.MouseEvent): void {
        event.preventDefault();

        this.props.history.push('/user/login');
    }

    public render(): JSX.Element {
        return (
            <div style={{ display: 'inline-block' }}>
                <div style={{ display: this.props.loggedIn ? 'none' : 'inline-block' }}>
                    <a
                        href=""
                        onClick={(event: React.MouseEvent) => this.onLoginClick(event)}
                        className="btn btn-primary ml-2 btn-sm"
                    >
                        Log in
                    </a>
                </div>
                <div style={{ display: this.props.loggedIn ? 'inline-block' : 'none' }}>
                    <button
                        type="button"
                        className="btn btn-primary ml-2 btn-sm dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        My Account
                    </button>
                    <div className="dropdown-menu">
                        <Link className="dropdown-item" to="/list">
                            Manage Lists
                        </Link>
                        <Link className="dropdown-item" to="/user/logout">
                            Logout
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(UserMenu);
