import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import request from "../helpers/request";
import { useNavigate } from "react-router-dom";
import { RecipeIngredientProps } from "../pages/Recipes";

interface AddRecipeModalProps {
    isOpen: boolean,
    onClose: () => void,
}


const AddRecipeModal = ({isOpen, onClose}: AddRecipeModalProps) => {

    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [quantityValue, setQuantityValue] = useState('0');
    const [quantityType, setQuantityType] = useState('');

    const [ingredient1, setIngredient1] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})

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
                console.log('added new grocery');
                navigate(0);
            } else {
                throw new Error(data.message);
            }
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size='xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader><Heading size='lg'>Add new recipe</Heading></ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack gap='5'>
                        <Box>
                            <Heading size='md' mb='15px'>
                                Ingredient 1</Heading>
                            <Stack gap='5' ml='10px'>
                                <Box display='flex' gap='5'>
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Input value={ingredient1.name} onChange={(value) => {
                                            const newIngredient = {...ingredient1, name: value.currentTarget.value}
                                            setIngredient1(newIngredient)
                                        }} />
                                    </FormControl>
                                    <FormControl>
                                    <FormLabel>Quantity</FormLabel>
                                    <NumberInput
                                        onChange={(value) => {
                                            const newIngredient = {...ingredient1, quantity: parseInt(value)}
                                            setIngredient1(newIngredient)
                                        }}
                                        value={ingredient1.quantity}
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
                                </Box>
                                <FormControl as='fieldset'>
                                    <FormLabel>Quantity Type</FormLabel>
                                    <RadioGroup value={ingredient1.quantityType} onChange={(value: RecipeIngredientProps["quantityType"]) => {
                                        const newIngredient = { ...ingredient1, quantityType: value }
                                        setIngredient1(newIngredient)
                                    }}>
                                        <HStack spacing='24px'>
                                            <Radio value='pieces'>Pieces</Radio>
                                            <Radio value='grams'>Grams</Radio>
                                            <Radio value='milliliters'>Milliliters</Radio>
                                        </HStack>
                                    </RadioGroup>
                                </FormControl>
                                {isError &&
                                    <Text color='red'>
                                        *{errorMessage}
                                    </Text>}
                            </Stack>
                        </Box>
                        <Box w='100%' display='flex' justifyContent='center' gap='5px'>
                            <Button fontSize='sm' colorScheme="red">
                                Remove ingredient
                            </Button>
                            <Button fontSize='sm' colorScheme="green">
                                Add ingredient
                            </Button>
                        </Box>
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

export default AddRecipeModal;