import { render } from "react-dom";

import App from "./App";
import StoreProivder from "./redux/StoreProvider";

const rootElement = document.getElementById("root");
render(
  <StoreProivder>
    <App />
  </StoreProivder>,
  rootElement
);
