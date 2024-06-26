// Material UI Utils
import { styled } from '@mui/material/styles';

// Material UI components
import Swtich from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export const StyledSwitch = styled(Swtich)(() => ({
    width: 65,
    height: 45,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 10,
        transitionDuration: '300ms',
        '&.Mui-checked': {
            '& + .MuiSwitch-track': {
                opacity: 0.5,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 25,
        height: 25,
    },
    '& .MuiSwitch-track': {
        borderRadius: 50 / 2,
    },
}));

export const StyledButton = styled(Button)(() => ({
    borderColor: 'background.paper',
    borderRadius: '50px',
    borderWidth: '2px',
    height: '35px',
    '&:hover': {
        borderWidth: '2px',
    },
    '&:disabled': {
        borderWidth: '2px',
    },
}));

export const IslandBox = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '1rem',
    margin: '1rem 0 1rem 1rem',
    borderRadius: '10px',
}));

export const dateTimeinputStyle = {
    width: '250px',
    height: '35px',
    borderRadius: '50px',
    border: '1px solid #000000',
    padding: '0 10px',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#000000',
    '&:focus': {
        outline: 'none',
    },
};
