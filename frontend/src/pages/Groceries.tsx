import { Box, Button, Fade, Flex, Heading, Input, Stack, useDisclosure } from "@chakra-ui/react";
import { useContext, useEffect, useReducer, useState } from "react";
import { StoreContext } from "../StoreProvider";
import GroceryItem from "../components/GroceryItem";
import request from "../helpers/request";
import { useNavigate } from "react-router-dom";
import AddGroceryModal from "../components/AddGroceryModal";


export interface GroceryPropsImage {
    url: string,
    filePath: string,
}
export interface GroceryProps {
    id: string,
    image: GroceryPropsImage,
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

    const { isOpen: isOpenAlert, onOpen: onOpenAlert, onClose: onCloseAlert } = useDisclosure()

    const { isOpen: isOpenModal, onOpen: onOpenModal, onClose: onCloseModal } = useDisclosure()
    
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

    const [searchValue, setSearchValue] = useState('');
    const [groceryItems, setGroceryItems] = useState<React.ReactElement[]>();

    const handleSaveChanges = async () => {
        changesLog.forEach(async (changeData) => {
            const { data, status } = await request.patch('groceries/quantity', {
                groceryId: changeData.id,
                updatedQuantity: changeData.newQuantity,
            })

            if (status === 200) {
                console.log('updated groceries')
                onCloseAlert();
                dispatch({ type: 'CLEAR', payload: {} })
                navigate(0)
            } else {
                console.log(data.message)
            }
        })
    }

    const handleDiscardChanges = () => {
        dispatch({ type: 'CLEAR', payload: {} })
        setSeed(Math.random())
    }

    const handleChangeSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setSearchValue(e.currentTarget.value)
    }

    useEffect(() => {
        if (changesLog.length > 0) {
            onOpenAlert()
        } else if (changesLog.length === 0) {
            onCloseAlert()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [changesLog])
    
    useEffect(() => {
        const groceriesToShow = groceries.filter((keyword) => {
            return keyword.name.toLowerCase().includes(searchValue.toLowerCase());
        })

        setGroceryItems(groceriesToShow.map((grocery: GroceryProps) => (
            <GroceryItem key={grocery.id}
                {...grocery}
                dispatch={dispatch}
            />)))
    },[searchValue, groceries])

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
                        value={searchValue}
                        onChange={handleChangeSearch}
                    />
                    <Button variant='solid' colorScheme='teal' onClick={onOpenModal}>
                        Add new grocery
                    </Button>
                    <AddGroceryModal
                        isOpen={isOpenModal}
                        onClose={onCloseModal}
                    />
                </Flex>
                <Stack key={seed}>
                    {groceryItems}
                </Stack>
            </Stack>
            <Fade in={isOpenAlert}>
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