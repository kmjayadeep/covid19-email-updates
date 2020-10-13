import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="jumbotron">
        <h1 className="display-3">Covid19 Daily Updates</h1>
        <p className="lead">
          Receive Daily email updates of Covid19 cases in the countries you are
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
            <input
              type="text"
              id="country"
              className="fadeIn third"
              name="country"
              placeholder="Countries"
            />
            <input type="submit" className="fadeIn fourth" value="Sign Up" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
