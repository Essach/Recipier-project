import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import StoreProvider from './StoreProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
