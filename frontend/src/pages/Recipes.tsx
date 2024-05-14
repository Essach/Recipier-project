import { Box, Button, Fade, Flex, Heading, Input, Stack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useReducer, useState } from "react";
import { StoreContext } from "../StoreProvider";
import RecipeItem from "../components/RecipeItem";
import AddRecipeModal from "../components/AddRecipeModal";


export interface RecipePropsImage {
    url: string,
    filePath: string,
}
export interface RecipeIngredientProps {
    name: string,
    quantity: number,
    quantityType: 'piece' | 'gram' | 'milliliter' 
}
export interface RecipeProps {
    id: string,
    image: RecipePropsImage,
    name: string,
    ingredients: Array<RecipeIngredientProps>
}

interface RecipeChange {
    id?: string,
}

export interface RecipeAction {
    type: 'ADD' | 'DELETE' | 'CLEAR',
    payload: RecipeChange,
}

const Recipes = () => {

    const { recipes } = useContext(StoreContext);

    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()

    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()
    
    const changesLogReducer = (changesLog: Array<RecipeChange>, action: RecipeAction) => {
        const { type, payload } = action;
        switch (type) {
            case 'ADD': 
                return changesLog
            case 'DELETE':
                return changesLog.filter(recipe => recipe.id !== payload.id)
            case 'CLEAR':
                return [];
            default:
                return changesLog;
        }
    }
    const [changesLog, dispatch] = useReducer(changesLogReducer, [])

    const [seed, setSeed] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [recipeItems, setRecipeItems] = useState<React.ReactElement[]>();

    const handleDiscardChanges = () => {
        dispatch({ type: 'CLEAR', payload: {} })
        setSeed(Math.random())
    }

    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
    }

    useEffect(() => {
        if (changesLog.length > 0) {
            onOpenAlert()
        } else if (changesLog.length === 0) {
            onCloseAlert()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changesLog])
    
    useEffect(() => {
        console.log(recipes)
        const recipesToShow = recipes.filter((keyword) => {
            return keyword.name.toLowerCase().includes(searchValue.toLowerCase());
        })

        setRecipeItems(recipesToShow.map((recipe: RecipeProps) => (
            <RecipeItem key={recipe.id}
                {...recipe}
                dispatch={dispatch}
            />)))
    },[searchValue, recipes])

    return (
        <>
            <Stack width='100%' gap='30px'>
                <Heading size='4xl'>Recipes</Heading>
                <Flex gap='30px'>
                    <Input
                        placeholder='Search for a recipe...'
                        size='md'
                        w='350px'
                        variant='outline'
                        value={searchValue}
                        onChange={handleChangeSearch}
                    />
                    <Button variant='solid' colorScheme='teal' onClick={onOpenModal}>
                        Add new recipe
                    </Button>
                    <AddRecipeModal
                        isOpen={isOpenModal}
                        onClose={onCloseModal}
                    />
                </Flex>
                <Stack key={seed}>
                    {recipeItems}
                </Stack>
            </Stack>
            <Fade in={isOpenAlert}>
                <Box position='fixed' bottom='15px' left='calc(50% - 250px)' w='500px' zIndex='5' backgroundColor='white' p='15px' rounded='md' shadow='lg'>
                    <Heading size='lg' mb='20px'>Save changes?</Heading>
                    <Box w='100%' display='flex' justifyContent='flex-end' gap='15px'>
                        <Button colorScheme="green">Save</Button>
                        <Button colorScheme="red" onClick={handleDiscardChanges}>Discard changes</Button>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default Recipes;