import { Button, Flex, Heading, Input, Stack } from "@chakra-ui/react";
import request from "../helpers/request";

const Groceries = () => {
    const handleGetGroceries = async () => {
        const { data } = await request.get('/groceries');

        console.log(data.groceries)
    };

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
            <Button onClick={handleGetGroceries}>get groceries</Button>
        </Stack>
    );
}

export default Groceries;