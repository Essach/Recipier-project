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

    const { groceries }: {groceries: Array<GroceryProps>} = useContext(StoreContext);

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
                <Stack>
                    {groceries.map((grocery) => (
                        <GroceryItem
                            name={grocery.name}
                        />))}
                </Stack>
            </Flex>
        </Stack>
    );
}

export default Groceries;