import { Box, Card, CardBody, Flex, Heading, IconButton, Image, List, useDisclosure } from "@chakra-ui/react";
import { ChevronDownIcon, DeleteIcon} from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { RecipeIngredientProps, RecipePropsImage } from "../pages/Recipes";
import IngredientsListItem from "./IngredientsListItem";
import RecipeDeleteDialog from "./RecipeDeleteDialog";


const RecipeItem = ({ id, image, name, ingredients }: { id: string, image: RecipePropsImage, name: string, ingredients: Array<RecipeIngredientProps> }) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = useRef(null)

    const [isClosed, setIsClosed] = useState(true)
    const handleOnClickOpen = () => {
        setIsClosed(prev => !prev)
    }

    return (
        <Card maxW='700px'>
            <CardBody display='flex' flexDirection='column' justifyContent='space-between' p='0' position='relative'>
                <Flex justifyContent='space-between' flexGrow='1' alignItems='center' p='12px' zIndex='9' h='85px' bg='white'>
                    <Box display='flex' alignItems='center' gap='2'>
                        <Image
                            src={image.url}
                            objectFit='cover'
                            boxSize='60px'
                            aspectRatio={1}
                        />
                        <Heading size='lg'>{name.charAt(0).toUpperCase() + name.slice(1)}</Heading>
                    </Box>
                    <Box h='100%' display='flex' alignItems='center'>
                        <IconButton
                            colorScheme="red"
                            aria-label='delete grocery'
                            icon={<DeleteIcon/>}
                            onClick={onOpen}
                            size='lg'
                        />
                        <RecipeDeleteDialog
                            isOpen={isOpen}
                            onClose={onClose}
                            cancelRef={cancelRef}
                            id={id}
                            filePath={image.filePath}
                        />
                    </Box>
                </Flex>
                <Box w='100%' h={isClosed ? '35px' : '120px'} transition={isClosed ? '0.05s all ease-in' : '0.15s all ease-out'}></Box>
                <Box w='100%' h='120px' display='flex' flexDirection='column' justifyContent='space-between' position='absolute' bg='white' transform={isClosed ? 'translateY(0px)' : 'translateY(85px)'} transition={isClosed ? '0.05s all ease-in' : '0.15s all ease-out'}>
                    <Box h='85px'>
                        {!isClosed && (
                            <List display='grid' h='85px' gridAutoFlow='column' gridTemplateRows='repeat(3,1fr)'
                            gridTemplateColumns='repeat(3, 1fr)'
                            p='2px 12px'>
                                    {ingredients.map((ingredient: RecipeIngredientProps) => <IngredientsListItem key={Math.random()} {...ingredient} />)}
                            </List>
                        )}
                    </Box>
                    <Flex w='100% ' h='35px' borderTop='1px solid black' justifyContent='center' alignItems='center'
                        _hover={{ cursor: 'pointer' }}
                        onClick={handleOnClickOpen} >
                        <ChevronDownIcon boxSize={9} transform={isClosed ? 'none' : 'rotate(180deg)'}  transition={isClosed ? '0.05s all ease-in' : '0.15s all ease-out'}/> 
                    </Flex>
                </Box>
            </CardBody>
        </Card>
    );
}

export default RecipeItem;