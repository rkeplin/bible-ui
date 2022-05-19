import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { AxiosError } from 'axios';
import UserService from './UserService';

interface IState {
    isLoading: boolean;
    email: string;
    password: string;
    passwordConfirmation: string;
    hasError: boolean;
    errorDescription: string;
    errors: string[];
}

class RegistrationForm extends React.Component<RouteComponentProps, IState> {
    protected service: UserService;

    constructor(props: RouteComponentProps) {
        super(props);

        this.service = new UserService();

        this.state = {
            email: '',
            password: '',
            passwordConfirmation: '',
            isLoading: false,
            hasError: false,
            errorDescription: '',
            errors: [],
        };
    }

    protected onRegisterClick(): void {
        this.service
            .register(this.state.email, this.state.password, this.state.passwordConfirmation)
            .then((response) => {
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

    protected handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>): void {
        if (event.key.toUpperCase() !== 'ENTER') {
            return;
        }

        this.onRegisterClick();
    }

    protected onCancelClick(event: React.MouseEvent): void {
        event.preventDefault();

        this.props.history.push('/user/login');
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
                        <div className="card-header">Register</div>
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
                                        Your email address will never be published.
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
                                        placeholder="Enter password..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="passwordConf">Confirm Password</label>
                                    <input
                                        name="passwordConf"
                                        className="form-control"
                                        id="passwordConf"
                                        type="password"
                                        value={this.state.passwordConfirmation}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                            this.setState({ passwordConfirmation: event.target.value })
                                        }
                                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) =>
                                            this.handleKeyPress(event)
                                        }
                                        placeholder="Enter password confirmation..."
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="card-footer text-muted">
                            <button
                                disabled={this.state.isLoading}
                                onClick={() => this.onRegisterClick()}
                                className="btn btn-primary"
                            >
                                Register
                            </button>
                            <a
                                href=""
                                onClick={(event: React.MouseEvent) => this.onCancelClick(event)}
                                className="btn btn-secondary ml-2"
                            >
                                Cancel
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(RegistrationForm);
