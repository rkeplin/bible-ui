import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import UserService from './UserService';
import { AxiosError } from 'axios';

interface IProps extends RouteComponentProps {
    onLogin: () => void;
}

interface IState {
    isLoading: boolean;
    email: string;
    password: string;
    hasError: boolean;
    errorDescription: string;
    errors: string[];
}

class LoginForm extends React.Component<IProps, IState> {
    protected service: UserService;

    constructor(props: IProps) {
        super(props);

        this.service = new UserService();

        this.state = {
            email: '',
            password: '',
            isLoading: false,
            hasError: false,
            errorDescription: '',
            errors: [],
        };
    }

    private onLoginClick() {
        this.setState({
            isLoading: true,
        });

        this.service
            .login(this.state.email, this.state.password)
            .then((response) => {
                this.props.onLogin();
                this.props.history.push('/list');

                return response;
            })
            .catch((error: AxiosError) => {
                this.setState({
                    hasError: true,
                    errorDescription: error.response?.data?.description ? error.response?.data?.description : 'Error',
                    errors: error.response?.data?.errors ? error.response?.data?.errors : [],
                    isLoading: false,
                });

                return error;
            })
            .finally(() => {
                window.scrollTo(0, 0);
            });
    }

    protected handleKeyPress(event: any /* React.KeyboardEvent<HTMLInputElement> */) {
        if (event.key.toUpperCase() !== 'ENTER') {
            return;
        }

        this.onLoginClick();
    }

    private onRegisterClick(event: React.MouseEvent) {
        event.preventDefault();

        this.props.history.push('/user/register');
    }

    public render(): JSX.Element {
        const errors = this.state.errors.map((error: string, index: number) => <li key={index}>{error}</li>);

        return (
            <div className="row">
                <div className="col-lg-8 offset-lg-2">
                    <div className="alert alert-danger" style={{ display: this.state.hasError ? 'block' : 'none' }}>
                        <p>
                            <b>{this.state.errorDescription}</b>
                        </p>
                        <ul style={{ display: this.state.errors.length > 0 ? 'block' : 'none' }}>{errors}</ul>
                    </div>

                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label htmlFor="email">Email address</label>
                                    <input
                                        name="email"
                                        id="email"
                                        type="email"
                                        value={this.state.email}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({ email: event.target.value })
                                        }
                                        placeholder="Enter email..."
                                        className="form-control"
                                    />

                                    <small className="form-text text-muted">
                                        Don&apos;t have an account?{' '}
                                        <a href="" onClick={(event: React.MouseEvent) => this.onRegisterClick(event)}>
                                            Register
                                        </a>
                                    </small>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        name="password"
                                        className="form-control"
                                        id="password"
                                        type="password"
                                        value={this.state.password}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({ password: event.target.value })
                                        }
                                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                            this.handleKeyPress(event)
                                        }
                                        placeholder="Enter password..."
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-muted">
                            <button
                                disabled={this.state.isLoading}
                                onClick={() => this.onLoginClick()}
                                className="btn btn-primary"
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(LoginForm);
