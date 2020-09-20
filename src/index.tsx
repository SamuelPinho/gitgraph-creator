import React from "react";
import { render } from "react-dom";
import { ThemeProvider, CSSReset, theme } from "@chakra-ui/core";
import { GitProvider } from "./context/git";
import App from "./App";
import { Global, css } from "@emotion/core";

const rootElement = document.getElementById("root");

const globalStyles = css`
  * {
    font-family: "Roboto Mono", monospace;
  }

  circle {
    cursor: pointer;
  }

  body {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
  }

  #root {
    height: 100%;
    position: relative;
    width: 100%;
  }
`;

render(
  <ThemeProvider
    theme={{
      ...theme,
      fonts: {
        body: "Roboto Mono",
        heading: "Roboto Mono",
        mono: "Roboto Mono",
      },
    }}
  >
    <CSSReset />
    <Global styles={globalStyles} />
    <GitProvider>
      <App />
    </GitProvider>
  </ThemeProvider>,
  rootElement
);
