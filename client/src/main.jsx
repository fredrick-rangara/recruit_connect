import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux' // Provides access to the Redux store
import { store } from './store'
import './index.css'
import App from './App.jsx'

/**
 * Initializing the root of the React application.
 * We wrap the <App /> with the <Provider /> so that every component 
 * in our application can access the Redux store.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
