import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  GitgraphCore,
  GitgraphUserApi,
  Orientation,
  templateExtend,
  TemplateName,
  Commit,
} from "@gitgraph/core";

type ReactSvgElement = React.ReactElement<SVGElement>;

export type CreateBranchModalData = {
  branchName: string;
  baseBranch: string;
  firstCommitMessage: string;
};

type GitState = {
  graph: GitgraphCore<ReactSvgElement>;
  graphAPI: GitgraphUserApi<ReactSvgElement>;

  createBranch: (attrs: CreateBranchModalData) => void;
};

const GitContext = createContext<GitState | undefined>(undefined);

type GitProviderProps = {
  children: ReactNode;
};

const graphTemplate = templateExtend(TemplateName.Metro, {
  commit: {
    message: {
      displayAuthor: false,
      displayHash: false,
    },
  },
});

const GitProvider = ({ children }: GitProviderProps) => {
  const graph = new GitgraphCore<ReactSvgElement>({
    branchLabelOnEveryCommit: true,
    author: "Samuel",
    orientation: Orientation.VerticalReverse,
    template: graphTemplate,
  });
  const graphAPI = graph.getUserApi();
  const [selectedCommit, setSelectedCommit] = useState<
    Commit<ReactSvgElement> | undefined
  >();

  const createBranch = ({
    baseBranch,
    branchName,
    firstCommitMessage,
  }: CreateBranchModalData) => {
    if (!branchName || !firstCommitMessage) return;

    if (baseBranch) {
      graphAPI.branch(baseBranch).branch(branchName).commit({
        subject: firstCommitMessage,
        onClick: setSelectedCommit,
      });
    } else {
      graphAPI.branch(branchName).commit({
        subject: firstCommitMessage,
        onClick: setSelectedCommit,
      });
    }
  };

  return (
    <GitContext.Provider value={{ graph, graphAPI, createBranch }}>
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
