import { Button, Flex, Heading, Input, Stack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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

    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()

    const [searchValue, setSearchValue] = useState('');
    const [recipeItems, setRecipeItems] = useState<React.ReactElement[]>();

    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
    }
    
    useEffect(() => {
        const recipesToShow = recipes.filter((keyword) => {
            return keyword.name.toLowerCase().includes(searchValue.toLowerCase());
        })

        setRecipeItems(recipesToShow.map((recipe: RecipeProps) => (
            <RecipeItem key={recipe.id}
                {...recipe}
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
                <Stack>
                    {recipeItems}
                </Stack>
            </Stack>
        </>
    );
}

export default Recipes;