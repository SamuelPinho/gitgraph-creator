import React from "react";
import { render } from "react-dom";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";

import App from "./App";
import { GitProvider } from "./context/git";

const rootElement = document.getElementById("root");
render(
  <ThemeProvider>
    <CSSReset />
    <GitProvider>
      <App />
    </GitProvider>
  </ThemeProvider>,
  rootElement
);
