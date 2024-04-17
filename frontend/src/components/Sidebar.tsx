import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { PlusSquareIcon } from '@chakra-ui/icons';
import { RiFridgeLine, RiBook2Fill, RiHome2Fill  } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'
const Sidebar = () => {

    const navigate = useNavigate();

    const handleNavigate = (url: string) => {
        navigate(`/${url}`)
    }

    return (
        <Box h='100vh' w='250px' bg='gray.900' transform='translateX(-180px)' transition='ease-in-out 0.1s' _hover={{ transform: 'translate(0%)' }} p='5' position='fixed' zIndex='10'>
            <VStack spacing='20px' align='stretch'>
                <Flex alignItems='center' gap='10px' justifyContent='space-between' _hover={{ cursor: 'pointer' }} onClick={()=>handleNavigate('home')}>
                    <Text fontSize='xl' color='whitesmoke'>Home</Text>
                    <Icon as={RiHome2Fill} color='whitesmoke' w={8} h={8} />
                </Flex>
                <Flex alignItems='center' gap='10px' justifyContent='space-between' _hover={{ cursor: 'pointer' }} onClick={()=>handleNavigate('generate')}>
                    <Text fontSize='xl' color='whitesmoke'>Generate recipe</Text>
                    <PlusSquareIcon color='whitesmoke' w={8} h={8} />
                </Flex>
                <Flex alignItems='center' gap='10px' justifyContent='space-between' _hover={{ cursor: 'pointer' }}  onClick={()=>handleNavigate('groceries')}>
                    <Text fontSize='xl' color='whitesmoke'>Groceries</Text>
                    <Icon as={RiFridgeLine} color='whitesmoke' w={8} h={8} />
                </Flex>
                <Flex alignItems='center' gap='10px' justifyContent='space-between' _hover={{ cursor: 'pointer' }}  onClick={()=>handleNavigate('recipes')}>
                    <Text fontSize='xl' color='whitesmoke'>Recipes</Text>
                    <Icon as={RiBook2Fill} color='whitesmoke' w={8} h={8} />
                </Flex>
            </VStack>
        </Box>
    );
}

export default Sidebar;