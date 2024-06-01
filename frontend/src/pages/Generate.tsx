import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Center, Divider, Heading, Image as ChakraImage, Modal, ModalContent, ModalOverlay, Spinner, UnorderedList, useDisclosure } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { StoreContext } from "../StoreProvider";
import { RecipeIngredientProps, RecipeProps } from "./Recipes";
import '../styles/generatedRecipe.css';
import GeneratedRecipeIngredient from "../components/GeneratedRecipeIngredient";
import request from "../helpers/request";

const Generate = () => {
    const {recipes, groceries, setGroceries} = useContext(StoreContext)

    const [currentScene, setCurrentScene] = useState<'button' | 'spinner' | 'recipe' | 'error'>('button')
    
    const [errorText, setErrorText] = useState('');

    const [generatedRecipe, setGeneratedRecipe] = useState<RecipeProps>()

    const [cardKey, setCardKey] = useState(0)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const fetchGroceriesData = async () => {
        const { data, status } = await request.get('/groceries');

        if (status === 200) {
            console.log(data.groceries)
            setGroceries(data.groceries)
        }
    }

    const generateRecipe = () => {
        const possibleRecipes: Array<RecipeProps> = [];
        recipes.forEach((recipe) => {
            let isPossible = true;
            recipe.ingredients.forEach((ingredient) => {
                const grocery = groceries.find(grocery => grocery.name.toLowerCase() === ingredient.name.toLowerCase())
                if (grocery === undefined) {
                    isPossible = false;
                    return
                } else if (grocery.quantityType !== ingredient.quantityType || grocery.quantity < ingredient.quantity) {
                    isPossible = false;
                    return;
                }
            })
            if (isPossible) {
                possibleRecipes.push(recipe);
            }
        })
        
        if (possibleRecipes.length === 0) {
            return undefined
        }
        const generatedRecipe = possibleRecipes[Math.floor(Math.random() * possibleRecipes.length)]

        return generatedRecipe;
    }

    const handleOnClickGenerate = () => {
        if (recipes.length === 0) {
            setErrorText('Currently you have no recipes')
            setCurrentScene('error')
            return
        }

        setCurrentScene('spinner')
        const generatedRecipe = generateRecipe();

        if (generatedRecipe === undefined) {
            setErrorText('Currently none of the recipes can be made. Buy some groceries')
            setCurrentScene('error')
            return
        }

        const img = new Image();
        img.onload = function () {
            setCardKey(Math.random())
            setGeneratedRecipe(generatedRecipe)
            setCurrentScene('recipe')
        }

        img.src = generatedRecipe.image.url
        
    }

    const handleOnClickChoose = async () => {
        onOpen()
        if (generatedRecipe !== undefined) {
            let isAllGood = true;

            for (const ingredient of generatedRecipe.ingredients) {
                const grocery = groceries.find(g => g.name === ingredient.name);
                if (grocery) {
                    const newQuantity = grocery.quantity - ingredient.quantity;

                    const { data, status } = await request.patch('/groceries/quantity', { groceryId: grocery.id, updatedQuantity: newQuantity })
                
                    console.log(ingredient.name, status)

                    if (status !== 200) {
                        isAllGood = false;
                        throw new Error(data.message);
                    }
                }
            }

            if (isAllGood) {
                console.log('here')
                onClose();
                fetchGroceriesData()
            }
        }
    }


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} closeOnEsc={false} closeOnOverlayClick={false} isCentered={true}>
                <ModalOverlay/>
                <ModalContent bg='transparent' boxShadow='none' display='flex' justifyContent='center' alignItems='center'>
                    <Spinner color='blue.500' thickness='10px' speed='0.65s' h='14rem' w='14rem' />
                </ModalContent>
            </Modal>
            <Center h='100vh'>
                {currentScene === 'button' && <Button height='200px' width='500px' colorScheme='teal' _active={{transform: 'scale(0.90,0.92)', transition: 'transform 0.2s ease'}} onClick={() =>setTimeout(handleOnClickGenerate, 50)}>
                    <Heading size='4xl'>Generate</Heading>
                </Button>
                }
                {currentScene === 'spinner' &&
                    <Spinner thickness='10px' speed='0.65s' color='blue.500' h='200px' w='200px' />
                }
                {currentScene === 'error' && <Heading textAlign='center'>
                    {errorText}
                </Heading>}   
                {(currentScene === 'recipe' && generatedRecipe !== undefined) &&
                <Card className="generated-recipe" key={cardKey}>
                    <CardHeader pb='0'>
                        <Heading>
                            {generatedRecipe.name}
                        </Heading>
                    </CardHeader>
                    <CardBody display='flex' justifyContent='center' flexDirection='column'>
                        <ChakraImage src={generatedRecipe.image.url}/>
                        <Box>
                            <UnorderedList display='grid' gridAutoFlow='column'
                            gridTemplateColumns='repeat(2, 1fr)'
                            pt='1.25rem'>
                                    {generatedRecipe.ingredients.map((ingredient: RecipeIngredientProps) => <GeneratedRecipeIngredient key={Math.random()} {...ingredient} />)}
                            </UnorderedList>
                        </Box>
                        </CardBody>
                        <Divider/>
                        <CardFooter>
                            <ButtonGroup spacing='2' display='flex' justifyContent='right' w='100%'>
                                <Button variant='ghost' colorScheme="teal" onClick={handleOnClickGenerate}>
                                    Generate again
                                </Button>
                                <Button variant='solid' colorScheme="teal" onClick={handleOnClickChoose}>
                                    Use this recipe
                                </Button>
                            </ButtonGroup>
                        </CardFooter>
                </Card>}
            </Center>
        </>
    )
}

export default Generate;