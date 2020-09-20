import React from "react";
import { render } from "react-dom";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
import { GitProvider } from "./context/git";
import App from "./App";
import { Global, css } from "@emotion/core";

const rootElement = document.getElementById("root");

const globalStyles = css`
  circle {
    cursor: pointer;
  }
`;

render(
  <ThemeProvider>
    <CSSReset />
    <Global styles={globalStyles} />
    <GitProvider>
      <App />
    </GitProvider>
  </ThemeProvider>,
  rootElement
);
