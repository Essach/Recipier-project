import { Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";
import { useContext } from "react";
import { StoreContext } from "../StoreProvider";
import GroceryItem from "../components/GroceryItem";

export interface GroceryProps {
    id: string,
    image: string,
    name: string,
    quantity: string,
    quantityType: string
}

const Groceries = () => {

    const { groceries } = useContext(StoreContext);

    return (
        <Stack width='100%' gap='30px'>
            <Heading size='4xl'>Groceries</Heading>
            <Flex gap='30px'>
                <Input
                    placeholder='Search for an item...'
                    size='md'
                    w='350px'
                    variant='outline'
                />
                <Button variant='solid' colorScheme='teal'>
                    Add new grocery
                </Button>
            </Flex>
            <Stack>
                {groceries.map((grocery: GroceryProps) => (
                    <GroceryItem {...grocery}
                        // id={grocery.id}
                        // name={grocery.name}
                        // image={grocery.image}
                    />))}
            </Stack>
        </Stack>
    );
}

export default Groceries;