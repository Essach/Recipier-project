import { ListIcon, ListItem } from "@chakra-ui/react";
import { RecipeIngredientProps } from "../pages/Recipes";
import { useContext, useEffect, useState } from "react";
import { RiCheckboxCircleFill, RiCloseCircleFill  } from "react-icons/ri";
import { StoreContext } from "../StoreProvider";

const IngredientsListItem = ({ name, quantity, quantityType }: RecipeIngredientProps) => {

    const [isAvailable, setIsAvailable] = useState(false);

    const { groceries } = useContext(StoreContext);

    useEffect(() => {
        groceries.forEach(grocery => {
            if (grocery.name.toLowerCase() === name.toLowerCase() && grocery.quantity >= quantity) {
                setIsAvailable(true);
            }
        })
    }, [groceries, name, quantity])

    return (
        <ListItem>
            <ListIcon as={isAvailable ? RiCheckboxCircleFill : RiCloseCircleFill} color={isAvailable ? 'green.500' : 'red.500'} />
            {quantity > 1 ? quantity+' '+quantityType+'s of '+name : quantity+' '+quantityType+' of '+name}
        </ListItem>
    );
}

export default IngredientsListItem;