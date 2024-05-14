import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import request from "../helpers/request";
import { useNavigate } from "react-router-dom";
import { RecipeIngredientProps } from "../pages/Recipes";
import AddRecipeIngredient from "./AddRecipeIngredient";
import { AddIcon } from "@chakra-ui/icons";

interface AddRecipeModalProps {
    isOpen: boolean,
    onClose: () => void,
}


const AddRecipeModal = ({isOpen, onClose}: AddRecipeModalProps) => {

    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [image, setImage] = useState<File>()
    const [fileErrorMessage, setFileErrorMessage] = useState('')
    const [isErrorFile, setIsErrorFile] = useState(false);
    
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
        const ingredients = [ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6, ingredient7, ingredient8, ingredient9];

        if (name === '' || image === undefined) {
            setErrorMessage('Fill in all fields')
            setIsError(true);
            return false
        } 

        let isErrorForLoop = false;
        ingredients.forEach((ingredient, i) => {
            if ((ingredientsNum >= i+1) && (ingredient.name === '' || ingredient.quantity === 0)) {
                setErrorMessage('Fill in all fields')
                setIsError(true);
                isErrorForLoop = true;
                return false
            }
        })
        if (isErrorForLoop) return false

        setIsError(false)
        setErrorMessage('')
        return true
    }

    const handleAddRecipe = async () => {
        const valid = validateForm();
        if (valid && image !== undefined) {
            const allIngredients = [ingredient1, ingredient2, ingredient3, ingredient4, ingredient5, ingredient6, ingredient7, ingredient8, ingredient9];

            const formData = new FormData();
            formData.append('image', image);
            formData.append('name', name);
            const ingredients: Array<RecipeIngredientProps> = []
            allIngredients.forEach((ingredient, i) => {
                if (i < ingredientsNum) ingredients.push(ingredient)
            })
            formData.append('ingredients', JSON.stringify(ingredients));

            const { data, status } = await request.post('/recipes', formData);

            if (status === 200) {
                navigate(0)
            } else {
                throw new Error(data.message)
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
                    <Box mb='15px'>
                        <FormControl>
                            <FormLabel>Recipe name</FormLabel>
                            <Input value={name} onChange={handleChangeName} />
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
                            <Input id="file-upload" type='file' display='none' onClick={handleFileInputClick} onChange={handleChangeImage}
                            accept="image/jpeg, image/png, image/jpg"
                            />
                            {isErrorFile && <FormErrorMessage>{fileErrorMessage}</FormErrorMessage>}
                        </FormControl>
                    </Box>
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
                        {isError &&
                        <Text color='red'>
                            *{errorMessage}
                        </Text>}
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