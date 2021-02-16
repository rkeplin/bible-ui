import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

class UserMenu extends React.Component<RouteComponentProps, any> {
    constructor(props: RouteComponentProps) {
        super(props);
    }

    private onLoginClick(event: React.MouseEvent) {
        event.preventDefault();

        this.props.history.push('/user/login');
    }

    public render(): JSX.Element {
        return (
            <div style={{ display: 'inline-block' }}>
                <div style={{ display: 'inline-block' }}>
                    <a
                        href=""
                        onClick={(event: React.MouseEvent) => this.onLoginClick(event)}
                        className="btn btn-primary ml-2 btn-sm"
                    >
                        Log in
                    </a>
                </div>
                {/*<div style={{ display: 'inline-block' }}>*/}
                {/*    <button*/}
                {/*        type="button"*/}
                {/*        className="btn btn-primary ml-2 btn-sm dropdown-toggle"*/}
                {/*        data-toggle="dropdown"*/}
                {/*        aria-haspopup="true"*/}
                {/*        aria-expanded="false"*/}
                {/*    >*/}
                {/*        My Account*/}
                {/*    </button>*/}
                {/*    <div className="dropdown-menu">*/}
                {/*        <a className="dropdown-item" href="">*/}
                {/*            Manage Lists*/}
                {/*        </a>*/}
                {/*        <a className="dropdown-item" href="">*/}
                {/*            Logout*/}
                {/*        </a>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default withRouter(UserMenu);
