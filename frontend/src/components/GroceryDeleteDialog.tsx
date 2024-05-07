import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from "@chakra-ui/react";
import request from "../helpers/request";
import { useNavigate } from "react-router-dom";

const GroceryDeleteDialog = ({ isOpen, onClose, cancelRef, id, filePath }: { isOpen: boolean, onClose: () => void, cancelRef: React.MutableRefObject<HTMLButtonElement | null>, id: string, filePath: string}) => {

    const navigate = useNavigate();

    const handleDeleteGrocery = async () => {
        const { data, status } = await request.patch('/groceries/delete', { groceryId: id, oldImagePath: filePath })
        if (status === 200) {
            console.log('grocery deleted')
            onClose()
            navigate(0)
        } else {
            throw new Error(data.message)
        }

    }

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete grocery
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={handleDeleteGrocery} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
}

export default GroceryDeleteDialog;