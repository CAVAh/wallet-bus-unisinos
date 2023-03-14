import React, { useEffect, useState } from "react";
import moment from 'moment';
import 'moment/locale/pt-br';
import api from './api';
import defaultAvatar from './default-avatar.jpg';

import "./App.css";

function App() {
  // React States
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(!!localStorage.getItem('user'));
  const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const initWeek = 9;
  const endWeek = 26;

  const errors = {
    uname: "Usuário inválido",
    // pass: "Senha inválida",
  };

  // React Functions
  useEffect(() => {
    moment.locale('pt-br');
    setCurrentWeek(moment().isoWeek());

    if (window.navigator.onLine && user) {
      // Find user login info
      const userInfo = api.getLocalUserByDocument(user.document);

      if (userInfo) {
        console.log('data updated!');
        setUser(userInfo);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (event) => {
    //Prevent page reload
    event.preventDefault();

    var { uname/*, pass*/ } = document.forms[0];

    // Find user login info
    try {
      const userData = await api.getLocalUserByDocument(uname.value);

      // Compare user info
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        /*if (userData.password !== pass.value) {
          // Invalid password
          setErrorMessages({ name: "pass", message: errors.pass });
        } else {*/
        setIsSubmitted(true);
        /*}*/
      } else {
        // Invalid user
        setErrorMessages({ name: "uname", message: errors.uname });
      }
    } catch (err) {
      setErrorMessages({ name: "uname", message: errors.uname });
    }
  };

  const handleLogout = () => {
    setIsSubmitted(false);
  }

  // Generate JSX code for error message
  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  // JSX code for login form
  const renderForm = (
    <>
      <div className="title">Login</div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>RG </label>
            <input type="text" name="uname" required />
            {renderErrorMessage("uname")}
          </div>
          {/* <div className="input-container">
            <label>Senha </label>
            <input type="password" name="pass" required />
            {renderErrorMessage("pass")}
          </div> */}
          <div className="button-container">
            <input type="submit" value="Entrar" />
          </div>
        </form>
      </div>
    </>
  );

  const hasTrip = (currentWeek) => {
    if (initWeek <= currentWeek && currentWeek <= endWeek) {
      if (user.trips.length > 1) {
        return user.trips[currentWeek]
      }

      if (user.trips.length === 1) {
        return user.trips[0]
      }
    }

    return null;
  }

  const tryRequireImage = (document) => {
    try {
      return require(`./images/${document}.jpeg`);
    } catch (err) {
      return null;
    }
  };

  return (
    <div className="app">
      <div className="login-form">
        {isSubmitted ?
          <>
            <div className="float-right" onClick={handleLogout}>
              <span className="times">×</span>
            </div>
            <div>
              <table className="wallet-info">
                <tbody>
                  <tr>
                    <td rowSpan="3">
                      <img
                        src={tryRequireImage(user.document) ?? defaultAvatar}
                        className="avatar"
                        alt="avatar"
                      />
                    </td>
                    <td><strong>Nome</strong><br />{user.name}</td>
                  </tr>
                  <tr>
                    <td><strong>Curso</strong><br />{user.course}</td>
                  </tr>
                  <tr>
                    <td><strong>Semana</strong><br />{moment().isoWeek() - initWeek + 1}</td>
                  </tr>
                </tbody>
              </table>

              <table className="wallet" border="1" cellSpacing="0" cellPadding="7">
                <thead>
                  <tr>
                    <td>Viagens</td>
                    <th>Seg</th>
                    <th>Ter</th>
                    <th>Qua</th>
                    <th>Qui</th>
                    <th>Sex</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ida</td>
                    <th>{hasTrip(currentWeek)?.monday.in ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.tuesday.in ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.wednesday.in ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.thurday.in ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.friday.in ? 'x' : ''}</th>
                  </tr>
                  <tr>
                    <td>Volta</td>
                    <th>{hasTrip(currentWeek)?.monday.out ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.tuesday.out ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.wednesday.out ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.thurday.out ? 'x' : ''}</th>
                    <th>{hasTrip(currentWeek)?.friday.out ? 'x' : ''}</th>
                  </tr>
                </tbody>
              </table>
              <small>v2.0</small>
            </div>
          </>
          : renderForm
        }
      </div>
    </div>
  );
}

export default App;
