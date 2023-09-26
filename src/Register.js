import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from './api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;   //Must start with upper or lower case letter 
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';    // End point for registration in back end API 

const Register = () => {

    # User input. Also allows us to set focus on user input when component loads
    const userRef = useRef();

    # Error reference. If we get an error, we need to put focus on it so it can be announced to a screen reader
    const errRef = useRef();

    # User state
    const [user, setUser] = useState('');

    // Boolean. Does the name validate or not? 
    const [validName, setValidName] = useState(false);

    // Boolean. Do we have focus on the input field or not?
    const [userFocus, setUserFocus] = useState(false);

    # Set Password States
    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    # Confirm Password States
    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    // State if submission fails 
    const [errMsg, setErrMsg] = useState('');

    // State if submission succeeds
    const [success, setSuccess] = useState(false);

    // Sets focus when component loads. There's nothing in the dependency array, so this will only happen when the 
    // component loads. It will set focus on the username input; to do so, we'll have to reference the user input 
    
    useEffect(() => {
        userRef.current.focus();
    }, [])

    // We validate the username here. Notice the user state in the dependency array; any time it changes, it will check the validation
    // of that field. 

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    // We validate the password here and keep track of pwd and matchPwd states
    
    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);     # Returns a boolean
    }, [pwd, matchPwd])

    // Error message use effect. Any time user changes one of three states, we clear out the error message
    
    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;     // We don't submit anything to database
        }
        try {
            const response = await axios.post(REGISTER_URL,   //Endpoint URL 
                JSON.stringify({ user, pwd }),   // Payload, data we're sending. We destructure 2 properties. Our backend expects a property name user and pwd  
                {                               //Object
                    headers: { 'Content-Type': 'application/json' }
                    withCredentials: true
                }
            );

        //With Axios, and unlike fetch, you don't have to manually change the response to JSON - it already happens 
        // We'll await access token
        
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            setUser('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {    // Standard error messages 
            if (!err?.response) {     // If no error response. Maybe we lost internet connection 
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {     // User name we've tried to submit is taken
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();    // Set focus on error message 
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <section>
                
                // Displays error message if exists. Paragraph displayed at top of form. We've got our errorRef created with useref.
                // If the error message exists, errMsg is the error message state and we apply the class "errmsg", otherwise applies the class "offscreen".
                // When we set focus on element, it will be announced with screen reader. The errMsg will display inside
                
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            
                    <h1>Register</h1>

                    // Function that submits form
    
                    <form onSubmit={handleSubmit}>

                    //ID for username input
                        <label htmlFor="username">
                            Username:

                    // If valid username, apply class valid, otherwise, we'll hide icon

                            <span className={validName ? "valid" : "hide"}>
                                <FontAwesomeIcon icon={faCheck}/>

                    // Red X icon. If we have validName and user field is empty, hide red x. 

                            <span className={validName || !user ? "hide" : "invalid"}>
                                <FontAwesomeIcon icon={faTimes}/>
            
                        </label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}      //Sets focus on input
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}   //Provides event then sets user state
                            value={user}
                            required      // INput is required
                            aria-invalid={validName ? "false" : "true"}    //If valid username, set to false
                            aria-describedby="uidnote"       // Provide element that describes input field
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}    // When we leave input field
                        />

                        // If user focus is true and user state exists (not empty) and there is not valid user name, display instructions. Otherwise, 
                        // directions are taken offscreen
                                
                        <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>

                        // || is OR operator, && And

                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"       //Will not support autocomplete setting
                            id="password"        // No useref, do not want to set focus on field when page loads
                            onChange={(e) => setPwd(e.target.value)}    //Set password state 
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote" 
                            onFocus={() => setPwdFocus(true)}   //On focus and on blur tell us if we are in field 
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>


                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        // Submit button. Since there's only 1 button, we don't need to provide type submit

                        <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p>
                        Already registered?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register
