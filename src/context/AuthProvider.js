import { createContext, useState } from "react";

const AuthContext = createContext({});

# Destructure the children, the children represents the components nested inside AuthProvider

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

#The children are the components nested within AuthProvider. The AuthContext will provide
    context for index.js .
    
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
