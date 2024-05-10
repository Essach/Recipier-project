import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import request from "../helpers/request";
import { useNavigate } from "react-router-dom";
import { RecipeIngredientProps } from "../pages/Recipes";
import AddRecipeIngredient from "./AddRecipeIngredient";

interface AddRecipeModalProps {
    isOpen: boolean,
    onClose: () => void,
}


const AddRecipeModal = ({isOpen, onClose}: AddRecipeModalProps) => {

    const navigate = useNavigate();

    const [ingredient1, setIngredient1] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient2, setIngredient2] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient3, setIngredient3] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient4, setIngredient4] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient5, setIngredient5] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient6, setIngredient6] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient7, setIngredient7] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient8, setIngredient8] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})
    const [ingredient9, setIngredient9] = useState<RecipeIngredientProps>({name: '', quantity: 0, quantityType: 'piece'})

    const [ingredientsNum, setIngredientsNum] = useState(1);

    // const [errorMessage, setErrorMessage] = useState('');
    // const [isError, setIsError] = useState(false);

    const handleAddIngredient = () => {
        setIngredientsNum(prev => prev+1)
    }

    const handleRemoveIngredient = () => {
        setIngredientsNum(prev => prev - 1)
        if (ingredientsNum === 2) {
            setIngredient2({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 3) {
            setIngredient3({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 4) {
            setIngredient4({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 5) {
            setIngredient5({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 6) {
            setIngredient6({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 7) {
            setIngredient7({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 8) {
            setIngredient8({name: '', quantity: 0, quantityType: 'piece'})
        }
        if (ingredientsNum === 9) {
            setIngredient9({name: '', quantity: 0, quantityType: 'piece'})
        }
    }

    const validateForm = () => {
        // if (name === '' || quantityType === '' || image === undefined) {
        //     setErrorMessage('Fill in all fields')
        //     setIsError(true);
        //     return false
        // } 
        // setIsError(false)
        // setErrorMessage('')
        // return true
    }

    const handleAddRecipe = async () => {
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
                        <AddRecipeIngredient
                            ingredient={ingredient1}
                            setIngredient={setIngredient1}
                            num={1}
                            isDisplayed={ingredientsNum>=1}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient2}
                            setIngredient={setIngredient2}
                            num={2}
                            isDisplayed={ingredientsNum>=2}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient3}
                            setIngredient={setIngredient3}
                            num={3}
                            isDisplayed={ingredientsNum>=3}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient4}
                            setIngredient={setIngredient4}
                            num={4}
                            isDisplayed={ingredientsNum>=4}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient5}
                            setIngredient={setIngredient5}
                            num={5}
                            isDisplayed={ingredientsNum>=5}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient6}
                            setIngredient={setIngredient6}
                            num={6}
                            isDisplayed={ingredientsNum>=6}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient7}
                            setIngredient={setIngredient7}
                            num={7}
                            isDisplayed={ingredientsNum>=7}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient8}
                            setIngredient={setIngredient8}
                            num={8}
                            isDisplayed={ingredientsNum>=8}
                        />
                        <AddRecipeIngredient
                            ingredient={ingredient9}
                            setIngredient={setIngredient9}
                            num={9}
                            isDisplayed={ingredientsNum>=9}
                        />
                        
                        <Box w='100%' display='flex' justifyContent='center' gap='5px'>
                            {ingredientsNum > 1 && 
                            <Button fontSize='sm' colorScheme="red"
                            onClick={handleRemoveIngredient}
                            >
                                Remove ingredient
                            </Button>}
                            {ingredientsNum < 9 &&
                            <Button fontSize='sm' colorScheme="green"
                            onClick={handleAddIngredient}
                            >
                                Add ingredient
                            </Button>}
                        </Box>
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='gray' mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button colorScheme='teal' onClick={handleAddRecipe}>
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default AddRecipeModal;