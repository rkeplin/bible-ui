import React from 'react';

interface IProp {
    hasError: boolean;
    errorDescription: string;
    errors: string[];
}

export type IFormError = IProp;

class FormError extends React.Component<IProp, any> {
    public render(): JSX.Element {
        return (
            <div className="alert alert-danger" style={{ display: this.props.hasError ? 'block' : 'none' }}>
                <p className={this.props.errors.length == 0 ? 'mb-0' : ''}>
                    <b>{this.props.errorDescription}</b>
                </p>
                <ul style={{ display: this.props.errors.length > 0 ? 'block' : 'none' }}>
                    {this.props.errors.map((error: string, index: number) => {
                        return <li key={index}>{error}</li>;
                    })}
                </ul>
            </div>
        );
    }
}

export default FormError;
