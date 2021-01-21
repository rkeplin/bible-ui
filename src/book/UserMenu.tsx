import React from 'react';

class UserMenu extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render(): JSX.Element {
        return (
            <div style={{ display: 'inline-block' }}>
                <div style={{ display: 'inline-block' }}>
                    <a href="" className="btn btn-primary ml-2 btn-sm">
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

export default UserMenu;
