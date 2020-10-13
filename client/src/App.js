import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import "./App.css";

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

function AnimatedMulti() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/country")
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
    />
  );
}

function App() {
  return (
    <div className="App">
      <div className="jumbotron">
        <h1 className="display-3">Covid19 Daily Updates</h1>
        <p className="lead">
          Receive Daily email updates of Covid19 cases for the countries you are
          interested in
        </p>
      </div>

      <div className="wrapper fadeInDown">
        <div id="formContent">
          <form>
            <input
              type="text"
              id="email"
              className="fadeIn second"
              name="email"
              placeholder="Email Address"
            />

            <AnimatedMulti />

            <label className="checkbox-container">
              <input type="checkbox" />
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
