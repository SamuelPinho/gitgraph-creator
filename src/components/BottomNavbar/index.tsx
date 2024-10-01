import React from "react";
import { Flex, Button, Divider, Text } from "@chakra-ui/core";
import { useGitContext } from "../../context/git";
import { SelectedCommit } from "../SelectedCommit";

type BottomNavbarProps = {
  setModalName: React.Dispatch<
    React.SetStateAction<
      "createBranch" | "addCommit" | "mergeBranch" | "editCommit" | undefined
    >
  >;
  onOpen: () => void;
};

export const BottomNavbar = ({ setModalName, onOpen }: BottomNavbarProps) => {
  const { selectedCommit } = useGitContext();

  return (
    <>
      <Flex mr="3">
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

      <Divider borderColor="gray.300" orientation="vertical" height="60%" />

      <Flex height="100%" ml="3" alignItems="center">
        {selectedCommit ? (
          <SelectedCommit
            commit={selectedCommit}
            openAddCommitModal={() => {
              setModalName("addCommit");
              onOpen();
            }}
            openMergeBranchModal={() => {
              setModalName("mergeBranch");
              onOpen();
            }}
            openEditCommitModal={() => {
              setModalName("editCommit");
              onOpen();
            }}
          />
        ) : (
          <Text color="gray.500">↑ click on a commit ~ dot to edit it</Text>
        )}
      </Flex>
    </>
  );
};
