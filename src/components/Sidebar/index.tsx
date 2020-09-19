import React from "react";
import { Flex, Button, Divider } from "@chakra-ui/core";
import { useGitContext } from "../../context/git";
import { SidebarSelectedCommit } from "../SidebarSelectedCommit";

type SidebarProps = {
  setModalName: React.Dispatch<
    React.SetStateAction<
      "createBranch" | "addCommit" | "mergeBranch" | undefined
    >
  >;
  onOpen: () => void;
};

export const Sidebar = ({ setModalName, onOpen }: SidebarProps) => {
  const { selectedCommit } = useGitContext();

  return (
    <Flex
      width="100%"
      flexDirection="column"
      height="100%"
      maxWidth="200px"
      mr="3"
    >
      <Flex>
        <Button
          onClick={() => {
            setModalName("createBranch");
            onOpen();
          }}
          variantColor="green"
        >
          Create Branch
        </Button>
      </Flex>
      {selectedCommit && (
        <>
          <Divider />
          <Flex>
            <SidebarSelectedCommit
              commit={selectedCommit}
              openAddCommitModal={() => {
                setModalName("addCommit");
                onOpen();
              }}
              openMergeBranchModal={() => {
                setModalName("mergeBranch");
                onOpen();
              }}
            />
          </Flex>
        </>
      )}
    </Flex>
  );
};
