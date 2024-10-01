import React from "react";
import { Stack, Flex, Text, Code, Button } from "@chakra-ui/core";
import { CommitType, useGitContext } from "../../context/git";

type SelectedCommitProps = {
  commit: CommitType;
  openAddCommitModal: () => void;
  openMergeBranchModal: () => void;
  openEditCommitModal: () => void;
};

export const SelectedCommit = ({
  commit,
  openAddCommitModal,
  openMergeBranchModal,
  openEditCommitModal,
}: SelectedCommitProps) => {
  const { deselectCommit, graph } = useGitContext();

  const hasJustOneBranch = graph.branches.size === 1;

  const branch = commit.branches || [];

  const branchName = branch[0];

  return (
    <Stack isInline spacing={6} alignItems="center" height="100%">
      <Stack spacing={0} height="100%" justifyContent="space-between">
        <Text
          color="gray.600"
          fontWeight="600"
          fontSize="sm"
          textDecor="underline"
        >
          Selected commit
        </Text>
        <Flex flexDir="column">
          <Code
            variantColor="green"
            children={branchName}
            width="fit-content"
          />
          <Text color="gray.400" fontSize="sm">
            {commit.subject}
          </Text>
        </Flex>
      </Stack>
      {/* <Text color="gray.600" fontWeight="600">
          Actions
        </Text> */}
      <Stack
        alignItems="flex-start"
        height="100%"
        spacing={2}
        justifyContent="space-between"
      >
        <Text
          color="gray.600"
          fontWeight="600"
          fontSize="sm"
          textDecor="underline"
        >
          Actions
        </Text>
        <Stack isInline spacing={2}>
          <Button onClick={openAddCommitModal} variantColor="blue" size="sm">
            add new commit
          </Button>
          {!hasJustOneBranch && (
            <Button
              onClick={openMergeBranchModal}
              variantColor="blue"
              size="sm"
            >
              merge
            </Button>
          )}
          <Button
            onClick={openEditCommitModal}
            variantColor="gray"
            variant="outline"
            color="gray.500"
            size="sm"
          >
            Edit
          </Button>
          <Button
            onClick={deselectCommit}
            variantColor="gray"
            variant="outline"
            color="gray.500"
            size="sm"
          >
            Deselect
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
