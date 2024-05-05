import { AspectRatio, Box, Card, CardBody, Editable, EditableInput, EditablePreview, Flex, Heading, IconButton, Image } from "@chakra-ui/react";
import { AddIcon, DeleteIcon, MinusIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { GroceryAction } from "../pages/Groceries";

const GroceryItem = ({id, image,name,quantity,quantityType, dispatch}: {id: string,image: string,name: string,quantity: string, quantityType: string, dispatch: (arg0: GroceryAction) => void}) => {
    const [currentQuantity, setCurrentQuantity] = useState<string>(quantity);
    
    const handleChangeQuantity = (v: string) => {
        if (parseInt(v) >= 0 || v === "") {
            setCurrentQuantity(v)
        }
        if (parseInt(v) !== parseInt(quantity)) {
            dispatch({ type: 'ADD', payload: { id: id, newQuantity: parseInt(v) } })
        } else if (parseInt(v) === parseInt(quantity)) {
            dispatch({ type: 'DELETE', payload: { id: id } })
        }
    }
    const handleOnBlurQuantity = () => {
        if (currentQuantity === "") {
            setCurrentQuantity(quantity)
        }
    }
    const handleAddQuantity = () => {
        setCurrentQuantity((parseInt(currentQuantity) + 1).toString())

        if (parseInt(currentQuantity)+1 !== parseInt(quantity)) {
            dispatch({ type: 'ADD', payload: { id: id, newQuantity: parseInt(currentQuantity)+1 } })
        } else if (parseInt(currentQuantity)+1 === parseInt(quantity)) {
            dispatch({ type: 'DELETE', payload: { id: id } })
        }
    }
    const handleSubtractQuantity = () => {
        if (parseInt(currentQuantity) > 0) {
            setCurrentQuantity((parseInt(currentQuantity) - 1).toString())
        }
        if (parseInt(currentQuantity) - 1 !== parseInt(quantity)) {
            dispatch({ type: 'ADD', payload: { id: id, newQuantity: parseInt(currentQuantity) - 1 } })
        } else if (parseInt(currentQuantity)-1 === parseInt(quantity)) {
            dispatch({ type: 'DELETE', payload: { id: id } })
        }
    }

    return (
        <Card maxW='700px'>
            <CardBody display='flex' alignItems='center' justifyContent='space-between' p='12px'>
                <Flex align='center' gap='4'>
                <Box display='flex' alignItems='center'>
                    <Image
                        src={image}
                        objectFit='cover'
                        boxSize='60px'
                        aspectRatio={1}
                    />
                    <Heading size='lg'>{name.charAt(0).toUpperCase() + name.slice(1)}</Heading>
                </Box>
                <IconButton
                    colorScheme="red"
                    aria-label='delete grocery'
                    icon={<DeleteIcon/>}
                    mt='3px'
                />
                </Flex>
                <Box display='flex' alignItems='center'>
                    <IconButton
                        aria-label='Add 1 of this grocery'
                        icon={<AddIcon />}
                        colorScheme='green'
                        onClick={handleAddQuantity}
                    />
                    <AspectRatio w='40px' ratio={1}>
                        <Editable
                            value={currentQuantity}
                            textAlign='center'
                            fontSize='xl'
                        >
                            <EditablePreview />
                            <EditableInput
                                value={currentQuantity}
                                onChange={(e) => { handleChangeQuantity(e.target.value) }}
                                type="number"
                                onBlur={handleOnBlurQuantity}
                                />
                        </Editable>
                    </AspectRatio>
                    <IconButton
                        aria-label='Subtract 1 of this grocery'
                        icon={<MinusIcon />}
                        colorScheme='red'
                        onClick={handleSubtractQuantity}
                    />
                    <Heading size='md' ml='10px'>{quantityType}s</Heading>
                </Box>
            </CardBody>
        </Card>
    );
}

export default GroceryItem;