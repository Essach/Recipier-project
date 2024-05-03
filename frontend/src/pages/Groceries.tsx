import { Box, Button, Fade, Flex, Heading, Input, Stack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useReducer, useState } from "react";
import { StoreContext } from "../StoreProvider";
import GroceryItem from "../components/GroceryItem";
import request from "../helpers/request";
import { useNavigate } from "react-router-dom";

export interface GroceryProps {
    id: string,
    image: string,
    name: string,
    quantity: string,
    quantityType: string
}

interface GroceryChange {
    id?: string,
    newQuantity?: number;
}

export interface GroceryAction {
    type: 'ADD' | 'DELETE' | 'CLEAR',
    payload: GroceryChange,
}

const Groceries = () => {

    const { groceries } = useContext(StoreContext);

    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const changesLogReducer = (changesLog: Array<GroceryChange>, action: GroceryAction) => {
        const { type, payload } = action;
        switch (type) {
            case 'ADD': {
                const index = changesLog.findIndex(grocery => grocery.id === payload.id)
                if(index === -1) {
                    return [...changesLog, payload]
                } else {
                    changesLog[index].newQuantity = payload.newQuantity;
                    return changesLog
                }
            }
            case 'DELETE':
                return changesLog.filter(grocery => grocery.id !== payload.id)
            case 'CLEAR':
                return [];
            default:
                return changesLog;
        }
    }
    const [changesLog, dispatch] = useReducer(changesLogReducer, [])

    const navigate = useNavigate();

    const [seed, setSeed] = useState(1);

    // let groceryItems = groceries.map((grocery: GroceryProps) => (
    //     <GroceryItem key={grocery.id}
    //         {...grocery}
    //         dispatch={dispatch}
    //     />))

    const handleSaveChanges = async () => {
        changesLog.forEach(async (changeData) => {
            const { data, status } = await request.patch('groceries/quantity', {
                groceryId: changeData.id,
                updatedQuantity: changeData.newQuantity,
            })

            if (status === 200) {
                console.log('updated groceries')
                navigate(0)
            } else {
                console.log(data.message)
            }
        })
    }

    const handleDiscardChanges = () => {
        dispatch({ type: 'CLEAR', payload: {} })
        // groceryItems = groceries.map((grocery: GroceryProps) => (
        // <GroceryItem key={grocery.id}
        //     {...grocery}
        //     dispatch={dispatch}
        // />))
        setSeed(Math.random())
    }

    useEffect(() => {
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
                <Stack key={seed}>
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
                        <Button colorScheme="red" onClick={handleDiscardChanges}>Discard changes</Button>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}

export default Groceries;