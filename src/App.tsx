import * as React from "react";
import { Gitgraph, Orientation } from "@gitgraph/react";
import { GitgraphUserApi } from "@gitgraph/core";
import {
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Select,
} from "@chakra-ui/core";
import { UseDisclosureReturn } from "@chakra-ui/core/dist/useDisclosure";
import { useGitContext } from "./context/git";
import { useForm } from "react-hook-form";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { graph } = useGitContext();

  const initialRef = React.useRef<HTMLInputElement>();
  const finalRef = React.useRef<HTMLInputElement>(null);

  // const getGraph = (
  //   gitgraph: GitgraphUserApi<React.ReactElement<SVGElement>>
  // ) => {
  //   branches.forEach((branch) => {
  //     const createdBranch = gitgraph.branch(branch);

  //     const branchCommits = commits[branch];

  //     if (!branchCommits) {
  //       createdBranch.commit("feature: first commit");
  //       return;
  //     }

  //     branchCommits.forEach((commitMessages) =>
  //       createdBranch.commit(commitMessages)
  //     );
  //   });

  //   return gitgraph;
  // };

  return (
    <Flex m="20px">
      <Flex>
        <Button onClick={onOpen} variantColor="green">
          Criar branch
        </Button>
      </Flex>
      <Gitgraph key={0} graph={graph} />
      {isOpen && (
        <Modal
          initialFocusRef={initialRef as React.RefObject<HTMLInputElement>}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
        >
          <CreateBranchModal onClose={onClose} initialRef={initialRef} />
        </Modal>
      )}
    </Flex>
  );
}

type CreateBranchModalData = {
  branchName: string;
  baseBranch: string;
};

function CreateBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLInputElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { graphAPI, graph } = useGitContext();
  const { handleSubmit, register } = useForm<CreateBranchModalData>();

  const onSubmit = handleSubmit(async ({ branchName, baseBranch }) => {
    if (!branchName) return;

    if (baseBranch) {
      graphAPI
        .branch(baseBranch)
        .branch(branchName)
        .commit("feature/first commit!");
    } else {
      graphAPI.branch(branchName).commit("feature/first commit!");
    }

    onClose();
  });

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a branch</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={onSubmit}>
            <FormControl>
              <FormLabel htmlFor="branchName">Branch Name</FormLabel>
              <Input
                name="branchName"
                id="branchName"
                ref={(e: HTMLInputElement) => {
                  register({ required: true })(e);
                  initialRef.current = e;
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="baseBranch">Base Branch</FormLabel>
              <Select
                name="baseBranch"
                id="baseBranch"
                placeholder="Choose a base branch"
                ref={register}
              >
                {Array.from(graph.branches.keys()).map((branchName, index) => (
                  <option key={branchName} value={branchName}>
                    {branchName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variantColor="blue" mr={3} type="submit" onClick={onSubmit}>
            Create
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </>
  );
}
