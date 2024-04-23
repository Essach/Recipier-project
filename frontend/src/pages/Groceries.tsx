import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogHeader, Button, Flex, Heading, Input, Stack, useDisclosure } from "@chakra-ui/react";
import { Reducer, useContext, useEffect, useReducer, useRef } from "react";
import { StoreContext } from "../StoreProvider";
import GroceryItem from "../components/GroceryItem";

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
    
    const cancelRef = useRef(null)

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

    useEffect(() => {
        console.log(changesLog)
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
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        Save changes?
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Button colorScheme="green" onClick={onClose}></Button>
                        <Button colorScheme="red" ref={cancelRef} onClick={onClose}></Button>
                    </AlertDialogBody>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default Groceries;