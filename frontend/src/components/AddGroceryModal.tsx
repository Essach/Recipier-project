import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { useState } from "react";

interface AddGroceryModalProps {
    isOpen: boolean,
    onClose: () => void,
}

const AddGroceryModal = ({isOpen, onClose}: AddGroceryModalProps) => {

    const [name, setName] = useState('')

    const handleChangeName = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add new grocery</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack gap='5'>
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input value={name} onChange={handleChangeName} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Image</FormLabel>
                            <Input type="file" accept="image/png, image/jpeg, image/jpg"/>
                        </FormControl>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button></Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddGroceryModal;