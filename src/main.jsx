import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import reportWebVitals from "./reportWebVitals.js";
import {Provider} from "react-redux";
import {store} from "./redux/store.js";
import {BrowserRouter} from "react-router";
import {RouterProvider} from "react-router-dom";
import router from "./routes/Routes.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>,
)
reportWebVitals();
