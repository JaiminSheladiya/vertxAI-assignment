import { BrowserRouter as Router } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import AppRoutes from "./routes/Routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => (
  <CookiesProvider>
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  </CookiesProvider>
);

export default App;
