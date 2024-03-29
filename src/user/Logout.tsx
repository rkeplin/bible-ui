import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserService from './UserService';

class Logout extends React.Component<RouteComponentProps, never> {
    protected service: UserService;

    constructor(props: RouteComponentProps) {
        super(props);

        this.service = new UserService();
    }

    public componentDidMount(): void {
        this.service.logout().then(() => {
            this.props.history.push('/user/login');

            window.scrollTo(0, 0);
        });
    }

    public render(): JSX.Element {
        return (
            <div className="row">
                <div className="col-lg-12">Logging out, please wait...</div>
            </div>
        );
    }
}

export default withRouter(Logout);
