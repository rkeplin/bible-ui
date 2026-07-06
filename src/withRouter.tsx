import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export interface History {
    push: (path: string) => void;
    replace: (path: string) => void;
}

export interface RouteComponentProps {
    history: History;
    location: {
        pathname: string;
        search: string;
    };
    match: {
        params: Record<string, string>;
    };
}

export function withRouter<P extends RouteComponentProps>(
    Component: React.ComponentType<P>,
): React.FC<Omit<P, keyof RouteComponentProps>> {
    return function WrappedComponent(props: Omit<P, keyof RouteComponentProps>) {
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams<Record<string, string>>();

        const history: History = {
            push: (path: string) => navigate(path),
            replace: (path: string) => navigate(path, { replace: true }),
        };

        return (
            <Component
                {...(props as unknown as P)}
                history={history}
                location={location}
                match={{ params: params as Record<string, string> }}
            />
        );
    };
}
