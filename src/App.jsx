import {Outlet, useNavigate} from 'react-router-dom'
import {ThemeProvider} from '@mui/material'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getUser} from "./redux/Auth/action.js";
import blueTheme from "./theme/blueTheme.js";
import Navbar from "./Customer/pages/Navbar/Navbar.jsx";


export default function RootLayout() {
    const {auth} = useSelector((store) => store)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getUser(auth.jwt || localStorage.getItem('jwt')))
    }, [auth.jwt, dispatch])

    useEffect(() => {
        if (auth.user?.role === 'ROLE_OWNER') {
            navigate('/clinic-dashboard')
        }
    }, [auth.user?.role, navigate])

    return (
        <>
            <ThemeProvider theme={blueTheme}>
                <Navbar/>
                <div className="relative">
                    <Outlet/>
                </div>
            </ThemeProvider>

        </>
    )
}