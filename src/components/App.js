import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./styling/Theme";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Scopes from "./pages/Scopes";
import { isSignedIn } from "../api/func/auth";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/signin">
            <SignIn></SignIn>
          </Route>
          <Route path="/signup">
            <SignUp></SignUp>
          </Route>
          <Route path="/scopes">
            <Scopes></Scopes>
          </Route>
          <Route exact path="/">
            {!isSignedIn() ? (
              <Redirect to="/signin" />
            ) : (
              <Redirect to="/scopes" />
            )}
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
