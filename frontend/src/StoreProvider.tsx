import { createContext, useEffect, useState } from "react";
import request from "./helpers/request";
import { GroceryProps } from "./pages/Groceries";
import { RecipeProps } from "./pages/Recipes";

export type GlobalContent = {
    groceries: Array<GroceryProps>
    setGroceries:(c:Array<GroceryProps>) => void
    recipes: Array<RecipeProps>
    setRecipes:(c:Array<RecipeProps>) => void
}
export const StoreContext = createContext<GlobalContent>({
    groceries: [],
    setGroceries: () => {},
    recipes: [],
    setRecipes: () => {},
})

const StoreProvider = ({children}: {children: React.ReactNode}) => {
    const [groceries, setGroceries] = useState<Array<GroceryProps>>([]);

    const fetchGroceriesData = async () => {
        const { data, status } = await request.get('/groceries');

        if (status === 200) {
            setGroceries(data.groceries)
        }
    }

    const [recipes, setRecipes] = useState<Array<RecipeProps>>([]);

    const fetchRecipesData = async () => {
        const { data, status } = await request.get('/recipes');

        if (status === 200) {
            setRecipes(data.recipes)
        }
    }

    useEffect(() => {
        fetchGroceriesData()
        fetchRecipesData();
    },[])

    return (
        <StoreContext.Provider value={{
            groceries: groceries,
            setGroceries: setGroceries,
            recipes: recipes,
            setRecipes: setRecipes,
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreProvider;