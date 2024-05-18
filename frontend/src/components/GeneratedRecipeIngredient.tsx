import { ListItem } from "@chakra-ui/react";
import { RecipeIngredientProps } from "../pages/Recipes";
import { useContext } from "react";
import { StoreContext } from "../StoreProvider";

const GeneratedRecipeIngredient = ({ name, quantity, quantityType }: RecipeIngredientProps) => {

    const { groceries } = useContext(StoreContext);

    const grocery = groceries.find(grocery => grocery.name === name)

    return (
        <ListItem>
            {grocery?.quantity}/{quantity > 1 ? quantity+' '+quantityType+'s of '+name : quantity+' '+quantityType+' of '+name}
        </ListItem>
    );
}

export default GeneratedRecipeIngredient;