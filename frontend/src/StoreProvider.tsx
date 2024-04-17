import { FC, createContext, useState } from "react";
import request from "./helpers/request";

export const StoreContext = createContext(null);

const StoreProvider:FC = () => {
    const [groceries, setGroceries] = useState([]);

    return (
        <div></div>
    );
}

export default StoreProvider;