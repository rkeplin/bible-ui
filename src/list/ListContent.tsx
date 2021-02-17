import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserService from '../user/UserService';

class ListContent extends React.Component<RouteComponentProps, any> {
    protected userService: UserService;

    constructor(props: any) {
        super(props);

        this.userService = new UserService();
    }

    public componentDidMount() {
        // this.service.logout().then(() => {
        //     this.props.history.push('/user/login');
        //
        //     window.scrollTo(0, 0);
        // });
    }

    public render(): JSX.Element {
        return (
            <div className="row">
                <div className="col-lg-12">List asdf page.</div>
            </div>
        );
    }
}

export default withRouter(ListContent);
