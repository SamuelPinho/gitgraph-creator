import * as React from "react";
import { Gitgraph } from "@gitgraph/react";
import { Commit } from "@gitgraph/core";
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
  Divider,
  Text,
  Code,
  Stack,
  FormErrorMessage,
  Box,
  RadioButtonGroup,
  ButtonProps,
} from "@chakra-ui/core";
import { UseDisclosureReturn } from "@chakra-ui/core/dist/useDisclosure";
import {
  useGitContext,
  CreateBranchModalData,
  ReactSvgElement,
  AddComitToBranchModalData,
  MergeBranchModalData,
} from "./context/git";
import { useForm } from "react-hook-form";
import { Sidebar } from "./components/Sidebar";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { graph, selectedCommit } = useGitContext();
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

const CustomRadio = React.forwardRef<
  ButtonProps,
  ButtonProps & {
    isChecked?: boolean;
    value?: string;
    children: React.ReactNode;
  }
>((props, ref) => {
  const { isChecked, isDisabled, value, children, ...rest } = props;
  return (
    <>
      <Button
        variantColor={isChecked ? "blue" : "gray"}
        size="sm"
        aria-checked={isChecked}
        role="radio"
        isDisabled={isDisabled}
        ref={ref}
        mb={2}
        {...rest}
      >
        {children}
      </Button>
    </>
  );
});

function CreateBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { graph, createBranch, selectedCommit } = useGitContext();

  const branchesArray = Array.from(graph.branches.keys());
  // const defaultBaseBranch = branchesArray[branchesArray.length - 1];
  const getDefaultBaseBranch = React.useCallback(() => {
    const defaultBranch = branchesArray[branchesArray.length - 1];

    if (!selectedCommit) return defaultBranch;

    const branch = selectedCommit.branches || defaultBranch;

    return branch[0];
  }, [branchesArray, selectedCommit]);

  const { handleSubmit, register, reset, errors, setError, setValue } = useForm<
    CreateBranchModalData
  >({
    defaultValues: {
      baseBranch: getDefaultBaseBranch(),
    },
  });

  const onSubmit = handleSubmit(
    ({ baseBranch, branchName, firstCommitMessage }) => {
      console.log(baseBranch);

      if (!baseBranch) {
        setError("baseBranch", {
          message: "baseBranch cannot be null",
        });
      }

      if (branchName === baseBranch) {
        setError("branchName", {
          message: "branch name cannot be equal to base branch",
        });
        setError("baseBranch", {
          message: "branch name cannot be equal to base branch",
        });
        return;
      }

      createBranch({ baseBranch, branchName, firstCommitMessage });

      reset();
    }
  );

  React.useEffect(() => {
    if (!setValue) return;
    setValue("baseBranch", getDefaultBaseBranch());
  }, [getDefaultBaseBranch, setValue]);

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
                  defaultValue={getDefaultBaseBranch()}
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

function MergeBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { graph, mergeBranch, selectedCommit } = useGitContext();

  const branchesArray = Array.from(graph.branches.keys());

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

  const originBranch = selectedCommit?.branches || "";
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
                defaultValue="master"
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

function AddCommitToBranchModal({
  onClose,
  initialRef,
}: {
  initialRef: React.MutableRefObject<HTMLElement | undefined>;
} & Pick<UseDisclosureReturn, "onClose">) {
  const { createCommit, selectedCommit } = useGitContext();
  const { handleSubmit, register, reset } = useForm<
    AddComitToBranchModalData
  >();

  const branchName = selectedCommit?.branches || "";

  const onSubmit = handleSubmit(async ({ commitMessage }) => {
    if (!commitMessage) return;

    createCommit({ commitMessage });

    reset();
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
            Add commit to branch&nbsp;
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
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variantColor="blue" mr={3} onClick={onSubmit} type="submit">
              Create commit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </>
  );
}
