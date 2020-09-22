import * as React from "react";
import { Gitgraph } from "@gitgraph/react";
import {
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  Grid,
} from "@chakra-ui/core";
import { useGitContext } from "./context/git";
import { BottomNavbar } from "./components/BottomNavbar";
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
    <Grid
      templateColumns="1fr"
      templateRows="1fr 100px"
      gridTemplateAreas='"graph" "bottom-navbar"'
      minHeight="100%"
      height="100vh "
      width="100%"
    >
      <Grid area="graph" minH="0" width="100%" pos="relative">
        <Flex p={6} minH="0" height="100%" overflowY="auto">
          <Gitgraph graph={graph} />
        </Flex>
      </Grid>
      <Grid area="bottom-navbar" width="100%">
        <Flex
          height="100%"
          width="100%"
          bg="gray.100"
          borderTopWidth="1px"
          borderTopStyle="solid"
          borderTopColor="gray.200"
          shadow="rgba(0,0,0,0.1) 0px 0px 20px 1px, rgba(0,0,0,0.05) 0px 4px 8px 0px"
          alignItems="center"
          px="6"
          py="4"
        >
          <BottomNavbar onOpen={onOpen} setModalName={setModalName} />
        </Flex>
      </Grid>
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
    </Grid>
  );
}
