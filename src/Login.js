
# Import hooks 
import { useRef, useState, useEffect, useContext } from 'react';

# Note this is not the same as the AuthProvider we put in index.js

import AuthContext from "./context/AuthProvider";

import axios from './api/axios';
const LOGIN_URL = '/auth';

const Login = () => {

    # If we successfully authenticate, we will store setAuth in the global context
    
    const { setAuth } = useContext(AuthContext);

    # Set focus on first input when component loads
    const userRef = useRef();

    /* Set focus on error if error occurs 
    const errRef = useRef();

    # States
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    # Set focus on first input when component loads. Since there is nothing in the 
    # dependency array, this will only run when the component loads
    
    useEffect(() => {
        userRef.current.focus();         
    }, [])

    # Empty out any error message if the user changes any of these inputs

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])

    # Will receive event and use it to prevent default behavior of form (reload page) 
    # We don't have to pass the event to the handleSubmit function. It receives it by default. 
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

        // This is what the REST API expects from us. Axios will automatically throw an error for us, so no error handling is needed 
        // Axios will also automatically convert the response to JSON for us
        
            const response = await axios.post(LOGIN_URL,    # 1st parameter
                JSON.stringify({ user, pwd }),              # 2nd parameter 
                {
                    headers: { 'Content-Type': 'application/json' },  #3rd parameter 
                    withCredentials: true
                }
            );

            console.log(JSON.stringify(response?.data));     # Inside data property of response
            //console.log(JSON.stringify(response));

            # The optional chaining (?.) operator access an object's properties or calls a function. If undefined or 
            # null, the expression short circuits and evaluates to undefined instead of throwing an error
            # Undefined is returned if the given function does not exist.

            # With chained operators, JS makes sure response is not null or undefined before attempting to access the next
            # objet. If response is null or undefined, the expression automatically short circuits, returning undefined
            
            const accessToken = response?.data?.accessToken;     # ? shortens if else shatement to 1 line of code. Takes 3 operands: a condition, a value that is true and a value that is false
            const roles = response?.data?.roles;            # Roles are an array of roles we're sending back, numbers assigned to different roles
            setAuth({ user, pwd, roles, accessToken });       
            setUser('');
            setPwd('');
            setSuccess(true);

        # Error handling, if no response but have an error
        # ! is the logical NOT operator 
        
        } catch (err) {

            if (!err?.response) {
                setErrMsg('No Server Response');

                # Information expected was not received
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');

                # Unauthorized 
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (

    # Start fragment and check success state. If successful, will show the below
    
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>

        # If success is FALSE, then show the form
            ) : (
                <section>

                # Displays any error message. Aria-live assertive will set focus. 
                
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>

                        # Every label should have an input. 
                        
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"     # Needs to match htmlFor attribute 
                            ref={userRef}     # Set focus on input
                            autoComplete="off"     # Prefer not to fill with past entries
                            onChange={(e) => setUser(e.target.value)}    # Anonymous function tied to user state
                            value={user}     # User state is now a controlled input. Important for when we want to clear form
                            required       # Both username and password will be required in value
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />

                        # Because this is the only button, we don't need an onClick event
                        
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">

                            {/* The Sign Up Link Should Lead Back to the Registration Form */}
                            {/*put router link here*/}
                            <a href="#">Sign Up</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login
