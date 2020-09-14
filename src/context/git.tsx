import React, { createContext, ReactNode, useContext } from "react";
import { GitgraphCore, GitgraphUserApi, Orientation } from "@gitgraph/core";

type ReactSvgElement = React.ReactElement<SVGElement>;

type GitState = {
  graph: GitgraphCore<ReactSvgElement>;
  graphAPI: GitgraphUserApi<ReactSvgElement>;
};

const GitContext = createContext<GitState | undefined>(undefined);

type GitProviderProps = {
  children: ReactNode;
};

const GitProvider = ({ children }: GitProviderProps) => {
  const graph = new GitgraphCore<ReactSvgElement>({
    branchLabelOnEveryCommit: true,
    author: "Samuel",
    orientation: Orientation.VerticalReverse,
  });
  const graphAPI = graph.getUserApi();

  return (
    <GitContext.Provider value={{ graph, graphAPI }}>
      {children}
    </GitContext.Provider>
  );
};

const useGitContext = () => {
  const context = useContext(GitContext);

  if (context === undefined) {
    throw new Error("useGitContext must be used within a GitProvider");
  }

  return context;
};

export { GitProvider, useGitContext };
