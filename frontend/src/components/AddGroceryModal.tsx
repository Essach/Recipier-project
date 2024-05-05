import { AddIcon } from "@chakra-ui/icons";
import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import request from "../helpers/request";

interface AddGroceryModalProps {
    isOpen: boolean,
    onClose: () => void,
}

const AddGroceryModal = ({isOpen, onClose}: AddGroceryModalProps) => {

    const [name, setName] = useState('')
    const [quantityValue, setQuantityValue] = useState('0');
    const [quantityType, setQuantityType] = useState('')

    const [image, setImage] = useState<File>()
    const [fileErrorMessage, setFileErrorMessage] = useState('')
    const [isErrorFile, setIsErrorFile] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChangeName = (e: React.FormEvent<HTMLInputElement>) => {
        setName(e.currentTarget.value)
    }

    const handleFileInputClick = (e: React.FormEvent<HTMLInputElement>) => {
        e.currentTarget.value = ''
    }

    const handleChangeImage = (e: React.FormEvent<HTMLInputElement>) => {
        if (e.currentTarget.files === null) return
        const imgSrc = e.currentTarget.files[0];
        if (imgSrc.size > 500000) {
            setFileErrorMessage('Files should not exceed 500KB size')
            setIsErrorFile(true);
            return
        } else {
            setIsErrorFile(false);
        }
        setImage(imgSrc);
    }

    const validateForm = () => {
        if (name === '' || quantityType === '' || image === undefined) {
            setErrorMessage('Fill in all fields')
            setIsError(true);
            return false
        } 
        setIsError(false)
        setErrorMessage('')
        return true
    }

    const handleAddGrocery = async () => {
        const valid = validateForm();
        console.log(image)
        if (valid && image !== undefined) {
            const formData = new FormData();
            formData.append('image', image)
            formData.append('name', name);
            formData.append('quantityType', quantityType);
            formData.append('quantity', quantityValue);
            
            const { data, status } = await request.post('/groceries', formData)
            
            if (status === 200) {
                console.log('essa')
            } else {
                console.log(data.message)
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add new grocery</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack gap='5'>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input value={name} onChange={handleChangeName} />
                        </FormControl>
                        <FormControl as='fieldset'>
                            <FormLabel>Quantity Type</FormLabel>
                            <RadioGroup value={quantityType} onChange={setQuantityType}>
                                <HStack spacing='24px'>
                                    <Radio value='pieces'>Pieces</Radio>
                                    <Radio value='grams'>Grams</Radio>
                                    <Radio value='milliliters'>Milliliters</Radio>
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Quantity</FormLabel>
                            <NumberInput
                                onChange={(valueString) => setQuantityValue(valueString)}
                                value={quantityValue}
                                max={50000}
                                min={0}
                                defaultValue={0}
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper/>
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Image</FormLabel>
                            <FormLabel htmlFor='file-upload'>
                                {image === undefined ? <AddIcon boxSize={10}
                                    bg='gray.100'
                                    p='7px'
                                    rounded='sm'
                                    transition='0.2s ease'
                                    _hover={{bg: 'gray.200', cursor: 'pointer'}}
                                /> :
                                    <Image src={URL.createObjectURL(image)}_hover={{cursor: 'pointer'}}/>}
                            </FormLabel>
                            <Input id="file-upload" type='file' display='none' onClick={handleFileInputClick} onChange={handleChangeImage}/>
                            {isErrorFile && <FormErrorMessage>{fileErrorMessage}</FormErrorMessage>}
                        </FormControl>
                        {isError &&
                            <Text color='red'>
                                *{errorMessage}
                            </Text>}
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='gray' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme='teal' onClick={handleAddGrocery}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddGroceryModal;