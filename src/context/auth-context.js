import React, {useState} from 'react';

export const AuthContext = React.createContext({ // context object
    isAuth: false,
    login: () => {}
});

const AuthContextProvider = props => { // provider component
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const loginHandler = () => {
        setIsAuthenticated(true)
    }
    return (
        <AuthContext.Provider value={{login: loginHandler, isAuth: isAuthenticated}}> {/*value here is distributed to all the components being wrapper, describes our context */}
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;