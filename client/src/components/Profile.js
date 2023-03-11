import React, { useState } from 'react';

import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import jwtDecode from 'jwt-decode';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PinterestIcon from '@mui/icons-material/Pinterest';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {
    lMode1,
    lMode2,
    lMode3,
    lMode4,
    lMode5,
    lMode6,
    dMode1,
    dMode2,
    dMode3,
    dMode4,
    dMode5,
    dMode6,
} from '../utils/colors';
import { border } from '@mui/system';
import { useLocation } from 'react-router-dom';
export default function Profile() {
    const location = useLocation();
    const token = location.state.token;
    console.log(token);
    const { sub: uid, email, name, picture: photoURL } = jwtDecode(token);
    const username = email.split('@')[0];
    const [formData, setFormData] = useState({
        name: name,
        email,
        uid,
        socialLinks: {
            twitter: '',
            instagram: '',
            pinterest: '',
            portfolio: '',
        },
        bio: '',
        username,
        role: '',
        skill_level: '',
        location: '',
        pinnedPostRef: [],
    });
    console.log(formData);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // const handleUpload = async () => {
    //     if (file) {
    //         setUploading(true);
    //         // upload file using axios or fetch
    //         // simulate upload progress
    //         // setTimeout(() => {
    //         //     setUploading(false);
    //         //     setSuccess(true);
    //         // }, 3000);
    //     // }
    // };
    const formSubmit = (e) => {
        e.preventDeafults();
    };
    const handleLevelChange = (event) => {
        setFormData({ ...formData, skill_level: event.target.value });
    };
    console.log(formData);
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100vw',
            }}
        >
            {/* Left SideBar with Profile Picture */}
            <Box
                sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    width: '30%',
                    backgroundColor: lMode1,
                    borderRight: '1px solid #000000',
                    p: 2,
                }}
            >
                <Stack
                    spacing={1}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        height: '100%',
                        width: '100%',
                        backgroundColor: lMode1,
                        p: 2,
                    }}
                >
                    <img
                        style={{
                            borderRadius: '50%',
                            height: '250px',
                            width: '250px',
                        }}
                        src={photoURL}
                        alt='Profile Picture'
                    />
                    <Typography
                        variant='h5'
                        sx={{
                            color: 'black',
                            fontWeight: 'bold',
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography
                        variant='p'
                        sx={{
                            color: lMode3,
                        }}
                    >
                        {email}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            backgroundColor: lMode1,
                            padding: '10px',
                        }}
                    >
                        <Typography
                            variant='p'
                            sx={{
                                color: lMode5,
                            }}
                        >
                            Skill Level &nbsp;&nbsp;
                        </Typography>
                        <Select
                            labelId='demo-simple-select-helper-label'
                            id='demo-simple-select-helper'
                            value={
                                formData.skill_level.length !== 0
                                    ? formData.skill_level
                                    : 10
                            }
                            onChange={handleLevelChange}
                        >
                            <MenuItem value={10}>Beginner</MenuItem>
                            <MenuItem value={20}>Intermediate</MenuItem>
                            <MenuItem value={30}>Professional</MenuItem>
                        </Select>
                    </Box>

                    {/* Add input for location */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            backgroundColor: lMode1,
                            padding: '10px',
                        }}
                    >
                        <Typography
                            variant='p'
                            sx={{
                                color: lMode5,
                            }}
                        >
                            Location
                        </Typography>

                        <TextField
                            id='outlined-basic'
                            label='Location'
                            variant='outlined'
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: e.target.value,
                                })
                            }
                            sx={{
                                color: lMode5,
                                backgroundColor: lMode1,
                                marginLeft: '10px',
                            }}
                        />
                    </Box>
                </Stack>
            </Box>
            {/* Right part with Name, type of user and photo */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    height: '100%',
                    width: '70%',
                    backgroundColor: lMode6,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        p: 2,
                    }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            color: lMode1,
                            fontWeight: 'bold',
                        }}
                    >
                        I am a
                        <Select
                            labelId='demo-simple-select-label'
                            id='demo-simple-select'
                            value={
                                formData.role.length !== 0 ? formData.role : 10
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            sx={{
                                color: lMode1,
                                backgroundColor: lMode6,
                                marginLeft: '10px',
                                border: 'none',
                                '&:focus': {
                                    border: 'none',
                                },
                                '&:hover': {
                                    border: 'none',
                                },
                            }}
                        >
                            <MenuItem value={10}>Explorer</MenuItem>
                            <MenuItem value={20}>Photographer</MenuItem>
                        </Select>
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            height: '100%',
                            p: 2,
                        }}
                    >
                        {/* Bio */}
                        <TextField
                            id='outlined-multiline-static'
                            label='About Yourself'
                            multiline
                            rows={4}
                            sx={{
                                input: {
                                    color: 'black',
                                },
                            }}
                            value={formData.bio}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bio: e.target.value,
                                })
                            }
                        />

                        {/* Social Media Links */}
                        {/* Create a 2 x 2 grid using MUI Grid */}

                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                p: 2,
                            }}
                        >
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <TwitterIcon
                                        sx={{
                                            color: 'action.active',
                                            mr: 1,
                                            my: 0.5,
                                        }}
                                    />
                                    <TextField
                                        id='input-with-sx'
                                        label='Twitter'
                                        variant='standard'
                                        value={formData.socialLinks.twitter}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: {
                                                    ...formData.socialLinks,
                                                    twitter: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <InstagramIcon
                                        sx={{
                                            color: 'action.active',
                                            mr: 1,
                                            my: 0.5,
                                        }}
                                    />
                                    <TextField
                                        id='input-with-sx'
                                        label='Instagram'
                                        variant='standard'
                                        value={formData.socialLinks.instagram}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: {
                                                    ...formData.socialLinks,
                                                    instagram: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <PinterestIcon
                                        sx={{
                                            color: 'action.active',
                                            mr: 1,
                                            my: 0.5,
                                        }}
                                    />
                                    <TextField
                                        id='input-with-sx'
                                        label='Pinterest'
                                        variant='standard'
                                        value={formData.socialLinks.pinterest}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: {
                                                    ...formData.socialLinks,
                                                    pinterest: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                    }}
                                >
                                    <AccountCircle
                                        sx={{
                                            color: 'action.active',
                                            mr: 1,
                                            my: 0.5,
                                        }}
                                    />
                                    <TextField
                                        id='input-with-sx'
                                        label='Portfolio'
                                        variant='standard'
                                        value={formData.socialLinks.portfolio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                socialLinks: {
                                                    ...formData.socialLinks,
                                                    portfolio: e.target.value,
                                                },
                                            })
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Section for Photographer to upload two best photos */}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left',
                                justifyContent: 'flex-start',
                                width: '100%',
                                p: 2,
                            }}
                        >
                            <Typography
                                variant='h5'
                                sx={{
                                    color: lMode1,
                                    fontWeight: 'bold',
                                }}
                            >
                                Upload your best photos
                            </Typography>

                            <Stack spacing={2}>
                                <input
                                    accept='image/*'
                                    style={{ display: 'none' }}
                                    id='file-input'
                                    type='file'
                                    onChange={handleFileChange}
                                />
                                <label htmlFor='file-input'>
                                    <Button
                                        variant='contained'
                                        component='span'
                                    >
                                        Choose File
                                    </Button>
                                </label>
                                {file && (
                                    <>
                                        <Typography variant='body1'>
                                            {file.name}
                                        </Typography>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                        >
                                            Upload
                                        </Button>
                                    </>
                                )}
                                {uploading && <LinearProgress />}
                                <Snackbar
                                    open={success}
                                    autoHideDuration={6000}
                                    onClose={() => setSuccess(false)}
                                    message='File uploaded successfully'
                                />
                                <input
                                    accept='image/*'
                                    style={{ display: 'none' }}
                                    id='file-input'
                                    type='file'
                                    onChange={handleFileChange}
                                />
                                <label htmlFor='file-input'>
                                    <Button
                                        variant='contained'
                                        component='span'
                                    >
                                        Choose File
                                    </Button>
                                </label>
                                {file && (
                                    <>
                                        <Typography variant='body1'>
                                            {file.name}
                                        </Typography>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            // onClick={handleUpload}
                                        >
                                            Upload
                                        </Button>
                                    </>
                                )}
                                {uploading && <LinearProgress />}
                                <Snackbar
                                    open={success}
                                    autoHideDuration={6000}
                                    onClose={() => setSuccess(false)}
                                    message='File uploaded successfully'
                                />
                            </Stack>
                        </Box>

                        {/* Save Button */}

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                width: '100%',
                                p: 2,
                            }}
                        >
                            <Button
                                variant='contained'
                                sx={{
                                    backgroundColor: lMode1,
                                    color: lMode3,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        backgroundColor: lMode1,
                                        color: lMode3,
                                    },
                                }}
                                onSubmit={formSubmit}
                                fullWidth
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}