import React from "react";
import {
  ModalContent,
  ModalHeader,
  Code,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  Stack,
  ModalFooter,
  Button,
  Text,
} from "@chakra-ui/core";
import { UseDisclosureReturn } from "@chakra-ui/core/dist/useDisclosure";
import { useForm } from "react-hook-form";
import { MergeBranchModalData, useGitContext } from "../../context/git";

export function MergeBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { graph, mergeBranch, selectedCommit } = useGitContext();

  const originBranch = selectedCommit?.branches || "";

  const branchesArray = Array.from(graph.branches.keys()).filter(
    (branchName) => branchName !== originBranch[0]
  );

  const { handleSubmit, register, reset, watch } = useForm<
    MergeBranchModalData
  >({
    defaultValues: {
      branchToMergeName: branchesArray[0],
    },
  });

  const onSubmit = handleSubmit(async ({ branchToMergeName }) => {
    mergeBranch({ branchToMergeName });

    reset();
  });

  const hasSelectedBranch = watch().branchToMergeName !== undefined;

  return (
    <>
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader
            flexDirection="row"
            alignItems="cente"
            justifyContent="center"
          >
            Merge branch&nbsp;
            <Code
              variantColor="green"
              children={originBranch[0]}
              verticalAlign="middle"
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel htmlFor="branchToMergeName">Destiny Branch</FormLabel>
              <Select
                name="branchToMergeName"
                id="branchToMergeName"
                placeholder="Choose a destiny branch"
                ref={(e: HTMLSelectElement) => {
                  register({ required: true })(e);
                  initialRef.current = e;
                }}
                defaultValue="main"
              >
                {branchesArray.map((branchName) => (
                  <option key={branchName} value={branchName}>
                    {branchName}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Stack
              spacing={1}
              isInline
              mt="20px"
              width="100%"
              alignItems="center"
            >
              <Text fontWeight="600" color="gray.600">
                Will merge
              </Text>
              <Code variantColor="green" children={originBranch[0]} />
              <Text fontWeight="600" color="gray.600">
                to
              </Text>
              {hasSelectedBranch && (
                <Code
                  variantColor="blue"
                  children={watch().branchToMergeName}
                />
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onSubmit} type="submit">
              Merge
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  );
}
