import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import PrototypesPage from "./pages/PrototypesPage";

import NavBar from "./components/Navbar";
const App = () => {
  return (
    // navbar
    <>
      <NavBar />
      <Router>
        <Switch>
          <Route exact path='/' component={PrototypesPage} />
        </Switch>
      </Router>
    </>
  );
};

export default App;
