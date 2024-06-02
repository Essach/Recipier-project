import { HashRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home."
import Sidebar from "./components/Sidebar"
import { Box, Flex } from "@chakra-ui/react"
import Generate from "./pages/Generate"
import Recipes from "./pages/Recipes"
import Groceries from "./pages/Groceries"

function App() {
  return (
    <HashRouter>
      <Flex bg='whitesmoke' minW='100vw' minH='100vh'>
        <Sidebar />
        <Box flexGrow={1} w='calc(100vw - 70px)' ml='70px' px='8' py='5'>
          <Routes>
            <Route path='*' Component={Home}/>
            <Route path='/generate' Component={Generate}/>
            <Route path='/groceries' Component={Groceries}/>
            <Route path='/recipes' Component={Recipes}/>
          </Routes>
        </Box>
      </Flex>
    </HashRouter>
  )
}

export default App
