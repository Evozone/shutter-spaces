// React
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from './features/auth/authSlice';

// External Packages
import jwtDecode from 'jwt-decode';
import { HMSRoomProvider } from '@100mslive/hms-video-react';

// Material UI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Other Components
import Navbar from './components/navbar/Navbar';
import Loading from './components/helpers/Loading';
import Notify from './components/helpers/Notify';
import ProtectedRoute from './components/helpers/ProtectedRoute';

// Route Components
import Explore from './components/routes/explore/Explore';
import Blogs from './components/routes/blogs/Blogs';
import Connect from './components/routes/connect/Connect';
import Listings from './components/routes/listings/Listings';
import Spaces from './components/routes/spaces/Spaces';
import SpaceRoom from './components/routes/spaces/space_room/SpaceRoom';
import ViewBlog from './components/routes/blogs/view_blog/ViewBlog';
import CreateBlog from './components/routes/blogs/create_blog/CreateBlog';
import EditBlog from './components/routes/blogs/edit_blog/EditBlog';
import Account from './components/routes/account/Account';
import PersonalCall from './components/routes/connect/chat_app/ca_right_side/one_chat/PersonalCall';
import Profile from './components/routes/profile/Profile';
import AddPost from './components/routes/newpost/AddPost';

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const localTheme = window.localStorage.getItem('photoAppTheme');

    const [mode, setMode] = useState(localTheme ? localTheme : 'light');

    const theme = createTheme({
        palette: {
            mode: mode,
        },
        typography: {
            fontFamily: ['Geologica', 'sans-serif'].join(','),
        },
    });

    const themeChange = () => {
        const updatedTheme = mode === 'light' ? 'dark' : 'light';
        window.localStorage.setItem('photoAppTheme', updatedTheme);
        setMode(updatedTheme);
    };

    const isSignedIn = useSelector((state) => state.auth.isSignedIn);

    useEffect(() => {
        async function checkProfile() {
            const token = localStorage.getItem('photoApp');
            if (token) {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('photoApp');
                    navigate('/');
                } else {
                    try {
                        dispatch(signIn({ ...decodedToken, token }));
                        if (window.location.pathname === '/') {
                            navigate(
                                '/' +
                                    localStorage.getItem('photoAppLastPage') ||
                                    ''
                            );
                        }
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        }

        if (!isSignedIn) {
            checkProfile();
        }
    }, []);

    return (
        <ThemeProvider {...{ theme }}>
            <CssBaseline />
            <Loading />
            <Notify />
            <Navbar {...{ themeChange, mode }} />
            <Routes>
                {/* Explore */}
                <Route path='/' element={<Explore />} />

                {/* Add a new post */}
                <Route path='/addPost' element={<AddPost />} />

                {/* Spaces */}
                <Route
                    path='/spaces'
                    element={
                        <HMSRoomProvider>
                            <Spaces />
                        </HMSRoomProvider>
                    }
                />

                {/* Spaces Room */}
                <Route
                    path='/room/:id'
                    element={
                        <HMSRoomProvider>
                            <SpaceRoom />
                        </HMSRoomProvider>
                    }
                />

                {/* Blogs */}
                <Route path='/blogs' element={<Blogs />} />
                <Route path='/blog/:id' element={<ViewBlog />} />
                <Route
                    path='/blogs/create'
                    element={
                        <ProtectedRoute>
                            <CreateBlog />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/blog/:id/edit'
                    element={
                        <ProtectedRoute>
                            <EditBlog />
                        </ProtectedRoute>
                    }
                />

                {/* Connect */}
                <Route
                    path='/connect'
                    element={
                        <ProtectedRoute>
                            <Connect />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path='/connect/call/:id'
                    element={
                        <ProtectedRoute>
                            <PersonalCall />
                        </ProtectedRoute>
                    }
                />

                {/* Listings */}
                <Route
                    path='/listings'
                    element={
                        <ProtectedRoute>
                            <Listings />
                        </ProtectedRoute>
                    }
                />

                {/* Account Data */}
                <Route
                    path='/account'
                    element={
                        <ProtectedRoute>
                            <Account />
                        </ProtectedRoute>
                    }
                />

                {/* Personal Profile Page */}
                <Route path='/profile/:username' element={<Profile />} />
            </Routes>
        </ThemeProvider>
    );
}

export default App;
