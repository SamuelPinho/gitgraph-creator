import * as React from "react";
import { Gitgraph } from "@gitgraph/react";
import { Flex, useDisclosure, Modal, ModalOverlay, Box } from "@chakra-ui/core";
import { useGitContext } from "./context/git";
import { Sidebar } from "./components/Sidebar";
import { CreateBranchModal } from "./components/ModalCreateBranch";
import { AddCommitToBranchModal } from "./components/ModalAddCommitToBranch";
import { MergeBranchModal } from "./components/ModalMergeBranch";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { graph } = useGitContext();
  const [modalName, setModalName] = React.useState<
    "createBranch" | "addCommit" | "mergeBranch"
  >();

  const initialRef = React.useRef<HTMLElement>();
  const finalRef = React.useRef<HTMLInputElement>(null);

  return (
    <Flex width="100%" m="20px" p="10px">
      <Sidebar onOpen={onOpen} setModalName={setModalName} />
      <Box shadow="sm" borderRadius="md" p={2} bg="gray.200">
        <Gitgraph graph={graph} />
      </Box>
      {isOpen && (
        <Modal
          initialFocusRef={initialRef as React.RefObject<HTMLInputElement>}
          finalFocusRef={finalRef}
          isOpen={isOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />

          {modalName === "createBranch" && (
            <CreateBranchModal onClose={onClose} initialRef={initialRef} />
          )}
          {modalName === "addCommit" && (
            <AddCommitToBranchModal onClose={onClose} initialRef={initialRef} />
          )}
          {modalName === "mergeBranch" && (
            <MergeBranchModal onClose={onClose} initialRef={initialRef} />
          )}
        </Modal>
      )}
    </Flex>
  );
}
