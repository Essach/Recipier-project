import { Box, Card, CardBody, Flex, Heading, IconButton, Image, useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon} from "@chakra-ui/icons";
import { useRef } from "react";
import GroceryDeleteDialog from "./GroceryDeleteDialog";
import { RecipeAction, RecipePropsImage } from "../pages/Recipes";

const RecipeItem = ({id, image,name, ingredients, dispatch}: {id: string,image: RecipePropsImage,name: string,quantity: string, quantityType: string, dispatch: (arg0: RecipeAction) => void}) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef(null)

    return (
        <Card maxW='700px'>
            <CardBody display='flex' flexDirection='column' justifyContent='space-between' p='0'>
                <Flex justifyContent='space-between' flexGrow='1' alignItems='center' p='12px'>
                    <Box display='flex' alignItems='center' gap='2'>
                        <Image
                            src={image.url}
                            objectFit='cover'
                            boxSize='60px'
                            aspectRatio={1}
                        />
                        <Heading size='lg'>{name.charAt(0).toUpperCase() + name.slice(1)}</Heading>
                    </Box>
                    <Box h='100%'>
                        <IconButton
                            colorScheme="red"
                            aria-label='delete grocery'
                            icon={<DeleteIcon/>}
                            onClick={onOpen}
                            size='lg'
                        />
                        <GroceryDeleteDialog 
                            isOpen={isOpen}
                            onClose={onClose}
                            cancelRef={cancelRef}
                            id={id}
                            filePath={image.filePath}
                        />
                    </Box>
                </Flex>
                <Box w='100%' h='30px' display='flex' justifyContent='center' borderTop='1px solid black' alignItems={'center'}>
                    <ChevronDownIcon boxSize={10} />
                </Box>
            </CardBody>
        </Card>
    );
}

export default RecipeItem;