import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';
import initializeAuthentication from "./firebase/firebase.init";
initializeAuthentication();

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const auth = getAuth();

  const handleRegistration = e => {
    e.preventDefault();

    console.log(email, password);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError("Password must be contain 2 upper case")
      return;
    }

    if (isLogin) {
      processLogin(email, password)
    }
    else {
      registerNewUser(email, password)
    }

  }
  const toggelLogin = e => {
    setIsLogin(e.target.checked)

  }
  const handelNameChange = e => {
    setName(e.target.value)
  }

  const hadnleEmailChange = e => {
    setEmail(e.target.value)
  }

  const hadnlePasswordChange = e => {
    setPassword(e.target.value)
  }
  const setUesrName = () => {
    updateProfile(auth.currentUser,{displayName: name})
      .then(result => { })
  }
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('')
      })
      .catch(error => {
        setError(error.message)
      })
  }
  const handleResatPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => { })

  }

  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user
        console.log(user);
        setError('')
        verifyEmail();
        setUesrName();
      })
      .catch(error => {
        setError(error.message);
      })
    const verifyEmail = () => {
      sendEmailVerification(auth.currentUser)
        .then(result => {
          console.log(result);
        })
    }
  }

  return (
    <div className="App container mt-5">
      <form onSubmit={handleRegistration}>
        <h3 className="text-primary">Please {isLogin ? 'Login' : 'Registar'}</h3>


        {!isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handelNameChange} type="text" className="form-control" id="inputName" />
          </div>
        </div>}

        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={hadnleEmailChange} type="email" className="form-control" id="inputEmail3" required />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={hadnlePasswordChange} type="password" className="form-control" id="inputPassword3" required />
          </div>
        </div>

        <div className="col-sm-10 offset-sm-2">
          <div className="form-check">
            <input onChange={toggelLogin} className="form-check-input" type="checkbox" id="gridCheck1" />

            <label className="form-check-label" htmlFor="gridCheck1">
              Alredy Registar?
            </label>
          </div>


        </div>
        <div className="row mb-3 text-danger">{error} </div>

        <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Registar'}</button>
        <button onClick={handleResatPassword} type="button" className="btn btn-secondary btn-sm">Small button</button>

      </form>
    </div>
  );
}

export default App;
