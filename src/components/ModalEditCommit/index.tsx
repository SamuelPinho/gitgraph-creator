import React from "react";
import { UseDisclosureReturn } from "@chakra-ui/core/dist/useDisclosure";
import { useForm } from "react-hook-form";
import { AddComitToBranchModalData, useGitContext } from "../../context/git";
import {
  ModalContent,
  ModalHeader,
  Code,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
} from "@chakra-ui/core";

export function ModalEditCommit({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { editCommit, selectedCommit } = useGitContext();
  const { handleSubmit, register } = useForm<AddComitToBranchModalData>();

  const branchName = selectedCommit?.branches || "";

  const onSubmit = handleSubmit(async ({ commitMessage }) => {
    if (!commitMessage) return;

    editCommit({
      commitMessage,
      selectedCommit,
    });

    onClose();
  });

  return (
    <>
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader
            flexDirection="row"
            alignItems="cente"
            justifyContent="center"
          >
            Edit commit to branch&nbsp;
            <Code
              variantColor="green"
              children={branchName[0]}
              verticalAlign="middle"
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor="commitMessage">Commit Message</FormLabel>
              <Input
                name="commitMessage"
                id="commitMessage"
                ref={(e: HTMLInputElement) => {
                  register({ required: true })(e);
                  initialRef.current = e;
                }}
                defaultValue={selectedCommit?.subject}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onSubmit} type="submit">
              Edit commit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  );
}
