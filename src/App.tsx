import * as React from "react";
import { Gitgraph } from "@gitgraph/react";
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
import { useGitContext, CreateBranchModalData } from "./context/git";
import { useForm } from "react-hook-form";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { graph } = useGitContext();

  const initialRef = React.useRef<HTMLInputElement>();
  const finalRef = React.useRef<HTMLInputElement>(null);

  return (
    <Flex m="20px">
      <Flex>
        <Button onClick={onOpen} variantColor="green">
          Criar branch
        </Button>
      </Flex>
      <Gitgraph graph={graph} />
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

function CreateBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLInputElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { graph, createBranch } = useGitContext();
  const { handleSubmit, register, reset } = useForm<CreateBranchModalData>();

  const onSubmit = handleSubmit(
    async ({ branchName, baseBranch, firstCommitMessage }) => {
      createBranch({ branchName, baseBranch, firstCommitMessage });

      reset();
    }
  );

  return (
    <>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={onSubmit}>
          <ModalHeader>Create a branch</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
            <FormControl>
              <FormLabel htmlFor="firstCommitMessage">
                First Commit Message
              </FormLabel>
              <Input
                name="firstCommitMessage"
                id="firstCommitMessage"
                defaultValue="feature/first commit message"
                ref={register}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onSubmit} type="submit">
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  );
}
