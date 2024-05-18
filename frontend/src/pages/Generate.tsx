import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Center, Divider, Heading, Image, Spinner, UnorderedList } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { StoreContext } from "../StoreProvider";
import { RecipeIngredientProps, RecipeProps } from "./Recipes";
import '../styles/generatedRecipe.css';
import GeneratedRecipeIngredient from "../components/GeneratedRecipeIngredient";

const Generate = () => {
    const {recipes, groceries} = useContext(StoreContext)

    const [currentScene, setCurrentScene] = useState<'button' | 'spinner' | 'recipe' | 'error'>('button')
    
    const [errorText, setErrorText] = useState('');

    const [generatedRecipe, setGeneratedRecipe] = useState<RecipeProps>()

    const [cardKey, setCardKey] = useState(0)

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

        setCardKey(Math.random())
        setGeneratedRecipe(generatedRecipe)
        setCurrentScene('recipe')
        
    }


    return (
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
                    <Image src={generatedRecipe.image.url}/>
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
                            <Button variant='solid' colorScheme="teal">
                                Choose this recipe
                            </Button>
                        </ButtonGroup>
                    </CardFooter>
            </Card>}
        </Center>
    )
}

export default Generate;