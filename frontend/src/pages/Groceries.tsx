import { Box, Button, Fade, Flex, Heading, Input, Stack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useReducer } from "react";
import { StoreContext } from "../StoreProvider";
import GroceryItem from "../components/GroceryItem";
import request from "../helpers/request";

export interface GroceryProps {
    id: string,
    image: string,
    name: string,
    quantity: string,
    quantityType: string
}

interface GroceryChange {
    id: string,
    newQuantity?: number;
}

export interface GroceryAction {
    type: 'ADD' | 'DELETE';
    payload: GroceryChange;
}

const Groceries = () => {

    const { groceries } = useContext(StoreContext);

    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const changesLogReducer = (changesLog: Array<GroceryChange>, action: GroceryAction) => {
        const { type, payload } = action;
        switch (type) {
            case 'ADD': {
                if (changesLog.findIndex(grocery => grocery.id === payload.id) === -1) {
                    return [...changesLog, payload]
                } else {
                    return changesLog
                }
            }
            case 'DELETE':
                return changesLog.filter(grocery => grocery.id !== payload.id)
            default:
                return changesLog;
        }
    }

    const [changesLog, dispatch] = useReducer(changesLogReducer, [])

    const handleSaveChanges = async () => {
        // changesLog.forEach(async (changeData) => {
        //     const { data, status } = await request.patch('groceries/quantity', {
        //         groceryId: changeData.id,
        //         updatedQuantity: changeData.newQuantity,
        //     })

        //     if (status === 200) {
        //         console.log('updated groceries')
        //     } else {
        //         console.log(status)
        //     }
        // })

        changesLog.forEach((data) => {
            console.log(data.id, data.newQuantity)
        })

        const { data, status } = await request.patch('/groceries/quantity', { groceryId: changesLog[0].id, updatedQuantity: changesLog[0].newQuantity })
        
        console.log(status)
    }

    useEffect(() => {
        console.log(changesLog)
        if (changesLog.length > 0) {
            onOpen()
        } else if (changesLog.length === 0) {
            onClose()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[changesLog])

    return (
        <>
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
                        <GroceryItem key={grocery.id}
                            {...grocery}
                            dispatch={dispatch}
                        />))}
                </Stack>
            </Stack>
            <Fade in={isOpen}>
                <Box position='fixed' bottom='15px' left='calc(50% - 250px)' w='500px' zIndex='5' backgroundColor='white' p='15px' rounded='md' shadow='lg'>
                    <Heading size='lg' mb='20px'>Save changes?</Heading>
                    <Box w='100%' display='flex' justifyContent='flex-end' gap='15px'>
                        <Button colorScheme="green" onClick={handleSaveChanges}>Save</Button>
                        <Button colorScheme="red">Discard changes</Button>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default Groceries;