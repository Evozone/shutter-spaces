// React
import React from 'react';

// Material-UI Core
import { Box } from '@mui/material';

// Material UI Icons
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate';

// Components
import RouteHeader from '../layout/RouteHeader';
import RouteContent from '../layout/RouteContent';
import AddPostInterface from './AddPostInterface'; // Import the AddPostInterface component

export default function AddPost() {
    return (
        <Box className='route-container'>
            <RouteHeader
                {...{
                    title: 'Add Post',
                    icon: <AddPhotoAlternate sx={{ fontSize: 60 }} />,
                }}
            />
            <RouteContent>
                <AddPostInterface />    
            </RouteContent>
        </Box>
    );
}
