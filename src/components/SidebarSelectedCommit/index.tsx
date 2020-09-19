import React from "react";
import { Stack, Flex, Text, Code, Button } from "@chakra-ui/core";
import { CommitType } from "../../context/git";

type SidebarSelectedCommitProps = {
  commit: CommitType;
  openAddCommitModal: () => void;
  openMergeBranchModal: () => void;
};

export const SidebarSelectedCommit = ({
  commit,
  openAddCommitModal,
  openMergeBranchModal,
}: SidebarSelectedCommitProps) => {
  const branch = commit.branches || [];

  const branchName = branch[0];

  return (
    <Stack flexDirection="column" spacing={3}>
      <Flex flexDirection="column">
        <Text color="gray.600" fontWeight="600">
          Selected Branch
        </Text>
        <Code variantColor="green" children={branchName} width="fit-content" />
      </Flex>
      <Flex flexDirection="column">
        <Text color="gray.600" fontWeight="600">
          Actions
        </Text>
        <Stack>
          <Button onClick={openAddCommitModal} size="sm" variantColor="gray">
            commit
          </Button>
          <Button onClick={openMergeBranchModal} size="sm" variantColor="gray">
            merge
          </Button>
        </Stack>
      </Flex>
    </Stack>
  );
};
