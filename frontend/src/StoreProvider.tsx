import { createContext, useEffect, useState } from "react";
import request from "./helpers/request";
import { GroceryProps } from "./pages/Groceries";

export type GlobalContent = {
    groceries: Array<GroceryProps>
    setGroceries:(c:Array<GroceryProps>) => void
}
export const StoreContext = createContext<GlobalContent>({
    groceries: [],
    setGroceries: () => {},
})

const StoreProvider = ({children}: {children: React.ReactNode}) => {
    const [groceries, setGroceries] = useState<Array<GroceryProps>>([]);

    const fetchGroceriesData = async () => {
        const { data, status } = await request.get('/groceries');

        if (status === 200) {
            setGroceries(data.groceries)
        }
    }

    useEffect(() => {
        fetchGroceriesData()
    },[])

    return (
        <StoreContext.Provider value={{
            groceries: groceries,
            setGroceries: setGroceries,
        }}>
            {children}
        </StoreContext.Provider>
    );
}

export default StoreProvider;