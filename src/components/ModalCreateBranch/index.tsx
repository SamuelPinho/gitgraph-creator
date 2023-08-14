import React from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  RadioButtonGroup,
  Stack,
} from "@chakra-ui/core";
import { UseDisclosureReturn } from "@chakra-ui/core/dist/useDisclosure";
import { useForm } from "react-hook-form";
import {
  CommitType,
  CreateBranchModalData,
  useGitContext,
} from "../../context/git";
import { CustomRadio } from "../CustomRadio";

export function CreateBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { graph, createBranch, selectedCommit } = useGitContext();

  const branchesArray = Array.from(graph.branches.keys());
  // const defaultBaseBranch = branchesArray[branchesArray.length - 1];

  const getDefaultBaseBranch = (commit: CommitType) => {
    const branch = commit.branches || "main";

    return branch[0];
  };

  const defaultBranch = !selectedCommit
    ? branchesArray[branchesArray.length - 1]
    : getDefaultBaseBranch(selectedCommit);

  const { handleSubmit, register, reset, errors, setError, setValue } = useForm<
    CreateBranchModalData
  >({
    defaultValues: {
      baseBranch: defaultBranch,
    },
  });

  const onSubmit = handleSubmit(
    ({ baseBranch, branchName, firstCommitMessage }) => {
      const alreadyExistBranch = branchesArray.some(
        (branch) => branch === branchName
      );

      if (branchName === baseBranch) {
        setError("branchName", {
          message: "branch name cannot be equal to base branch",
        });
        setError("baseBranch", {
          message: "branch name cannot be equal to base branch",
        });

        return;
      }

      if (alreadyExistBranch) {
        setError("branchName", {
          type: "validate",
          message: "a branch with that name already exist",
        });

        return;
      }

      createBranch({ baseBranch, branchName, firstCommitMessage });

      reset();
    }
  );

  React.useEffect(() => {
    setValue("baseBranch", defaultBranch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBranch]);

  return (
    <>
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>Create a branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={2}>
              <FormControl isInvalid={!!errors.branchName}>
                <FormLabel htmlFor="branchName">Branch Name</FormLabel>
                <Input
                  name="branchName"
                  id="branchName"
                  ref={(e: HTMLInputElement) => {
                    register({
                      required: {
                        value: true,
                        message: "required",
                      },
                    })(e);
                    initialRef.current = e;
                  }}
                />
                <FormErrorMessage>
                  {errors.branchName?.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="baseBranch">Create from branch</FormLabel>
                <Input
                  ref={register}
                  name="baseBranch"
                  id="baseBranch"
                  display="none"
                />
                <RadioButtonGroup
                  defaultValue={defaultBranch}
                  onChange={(val) => setValue("baseBranch", val as any)}
                  isInline
                  spacing={2}
                  key={branchesArray.length}
                >
                  {branchesArray.map((branchName) => (
                    <CustomRadio value={branchName} key={branchName}>
                      {branchName}
                    </CustomRadio>
                  ))}
                </RadioButtonGroup>
              </FormControl>
              <FormControl isInvalid={!!errors.firstCommitMessage}>
                <FormLabel htmlFor="firstCommitMessage">
                  First Commit Message
                </FormLabel>
                <Input
                  name="firstCommitMessage"
                  id="firstCommitMessage"
                  defaultValue="create new branch"
                  ref={register({
                    required: {
                      value: true,
                      message: "required",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.firstCommitMessage?.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onSubmit} type="submit">
              Create
            </Button>
            <Button onClick={onClose} type="button">
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  );
}
