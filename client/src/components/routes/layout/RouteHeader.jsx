// React
import React from 'react';

// Material UI
import { Box, Typography } from '@mui/material';

export default function RouteHeader({ title, icon, children }) {
    return (
        <Box
            sx={{
                minHeight: '35vh',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: '0 2rem',
            }}
        >
            {children}
            <Typography
                variant='h2'
                sx={{
                    mt: '3rem',
                    font: 'bold 4rem Geologica, sans-serif',
                    color: 'common.white',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                {icon}&nbsp;{title}
            </Typography>
        </Box>
    );
}
