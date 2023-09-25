
# Import hooks 
import { useRef, useState, useEffect, useContext } from 'react';


import AuthContext from "./context/AuthProvider";

import axios from './api/axios';
const LOGIN_URL = '/auth';

const Login = () => {
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
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
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
