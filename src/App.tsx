import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from "./Routes/Home";
import TV from "./Routes/TV";
import Detail from "./Routes/Detail"
import Search from "./Routes/Search";
import Header from "./Components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <TV />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/detail">
          <Detail />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;