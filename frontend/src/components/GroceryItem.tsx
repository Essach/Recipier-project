import { Box, Heading } from "@chakra-ui/react";
import { GroceryProps } from "../pages/Groceries";

const GroceryItem = (props: GroceryProps) => {
    return (
        <Box>
            <Heading>{props.name}</Heading>
        </Box>
    );
}

export default GroceryItem;