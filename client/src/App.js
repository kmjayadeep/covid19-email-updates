import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import "./App.css";

const BASE_URL = "/api";

const animatedComponents = makeAnimated();

const customStyles = {
  container: () => ({
    width: "85%",
    margin: "auto",
    padding: "20px 0",
  }),
  menu: (provided) => ({
    ...provided,
    top: "55%",
    width: "85%",
  }),
};

function AnimatedMulti({ onChange }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/country`)
      .then((res) => res.json())
      .then((data) => {
        setOptions(data);
      })
      .catch(console.log);
  }, []);

  return (
    <Select
      closeMenuOnSelect={false}
      components={animatedComponents}
      // defaultValue={[colourOptions[4], colourOptions[5]]}
      isMulti
      styles={customStyles}
      options={options}
      placeholder="Countries"
      onChange={onChange}
    />
  );
}

function App() {
  const [email, setEmail] = useState([]);
  const [countries, setCountries] = useState([]);
  const [includeGlobal, setIncludeGlobal] = useState(true);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${BASE_URL}/register`;
    const countryCodes = countries.map((c) => c.value);
    const data = {
      email,
      countries: countryCodes,
      includeGlobal,
    };
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => r.json());
    console.log(response);
    setRegistered(true);
  };

  return (
    <div className="App">
      <div className="jumbotron">
        <h1 className="display-3">Covid19 Daily Updates</h1>
        <p className="lead">
          Receive Daily email updates of Covid19 cases for the countries you are
          interested in
        </p>
      </div>

      {registered ? (
        <div class="alert fadeIn alert-register alert-dismissible alert-info">
          <button
            type="button"
            class="close"
            onClick={() => setRegistered(false)}
          >
            &times;
          </button>
          <strong>Registration Success!</strong>
        </div>
      ) : (
        ""
      )}

      <div className="wrapper fadeInDown">
        <div id="formContent">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              required
              className="fadeIn second"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AnimatedMulti onChange={(e) => setCountries(e)} />

            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={includeGlobal}
                onChange={(e) => setIncludeGlobal(e.target.checked)}
              />
              <span className="checkmark"></span>
              Include Global Stats
            </label>

            <input
              type="submit"
              className="fadeIn fourth button"
              value="Sign Up"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
