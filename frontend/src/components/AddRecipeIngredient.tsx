import { Box, FormControl, FormLabel, HStack, Heading, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Radio, RadioGroup, Stack} from "@chakra-ui/react";
import { RecipeIngredientProps } from "../pages/Recipes";

const AddRecipeIngredient = ({ ingredient, setIngredient, num, isDisplayed }: {
    ingredient: RecipeIngredientProps, setIngredient: (arg0: RecipeIngredientProps) => void, num: number, isDisplayed: boolean
}) => {

    return (
        <Box display={isDisplayed ? 'block' : 'none'}>
            <Heading size='md' mb='15px'>
                Ingredient {num}</Heading>
            <Stack gap='5' ml='10px'>
                <Box display='flex' gap='5'>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={ingredient.name} onChange={(value) => {
                            const newIngredient = {...ingredient, name: value.currentTarget.value}
                            setIngredient(newIngredient)
                        }} />
                    </FormControl>
                    <FormControl>
                    <FormLabel>Quantity</FormLabel>
                    <NumberInput
                        onChange={(value) => {
                            const newIngredient = {...ingredient, quantity: parseInt(value)}
                            setIngredient(newIngredient)
                        }}
                        value={ingredient.quantity}
                        max={50000}
                        min={0}
                        defaultValue={0}
                    >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    </FormControl>
                </Box>
                <FormControl as='fieldset'>
                    <FormLabel>Quantity Type</FormLabel>
                    <RadioGroup value={ingredient.quantityType} onChange={(value: RecipeIngredientProps["quantityType"]) => {
                        const newIngredient = { ...ingredient, quantityType: value }
                        setIngredient(newIngredient)
                    }}>
                        <HStack spacing='24px'>
                            <Radio value='piece'>Pieces</Radio>
                            <Radio value='gram'>Grams</Radio>
                            <Radio value='milliliter'>Milliliters</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>
            </Stack>
        </Box>
    );
}

export default AddRecipeIngredient;