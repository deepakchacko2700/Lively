import React from 'react';
import {Modal, TextField, IconButton, Typography, Box, Button} from '@mui/material'
import { UploadFile} from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close';
import { API_URL } from './Constants';


export default function UpdateProfileModal(props) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    const [profileForm, setProfileForm] = React.useState(
        {
            first_name : '',
            last_name : '',
            place : '',
            profile_img : '',
        }
    );
    const [errors, setErrors] = React.useState(
        {
            first_name_error:null,
            last_name_error:null,
            place_error:null
        }
    );
    const [loading, setLoading] = React.useState(false)

    function handleChange(e) {
        const {name, value, type} = e.target
        setProfileForm(prev => ({...prev, 
            [name]: type==='file' ? e.target.files[0] : value}))    
    };

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true)
        const form_data = new FormData();
        form_data.append('first_name', profileForm.first_name)
        form_data.append('last_name', profileForm.last_name)
        form_data.append('place', profileForm.place)
        if (profileForm.profile_img) {
            form_data.append('profile_img', profileForm.profile_img, profileForm.profile_img.name)
        }
        // const values = [...form_data.entries()];
        // console.log(values);
        const requestOptions = {
            method : 'PUT',
            headers : {'Authorization':`Token ${props.token}`},
            body :form_data
        }
            fetch(`${API_URL}/api/profile-viewset/${props.username}/`, requestOptions)
            .then(res => {
                if (!res.ok) {
                    res.json()
                    .then(data => {
                        console.log(data)
                        if (data.first_name) {
                            setErrors(prev => ({...prev, first_name_error:data.first_name}))
                        }
                        else if (data.last_name) {
                            setErrors(prev => ({...prev,
                                first_name_error:null,
                                last_name_error:data.last_name}))
                        }
                        else {
                            setErrors({place:data.place,
                                    first_name_error:null,
                                    last_name_error:null
                            })
                        }
                    })
                }
                else {
                    res.json()
                    .then(data => {
                        props.fetchProfiledata();
                        props.handleClose()})      
                }
            })
            .catch(err => console.error(err.message))
            .finally(console.log(loading))
    };

    return(
        <Modal 
            open={props.open}
            onClose={props.handleClose}
        >
            <Box sx={style}>
            <Box textAlign='right' mt={-2} >
                    <IconButton onClick={props.handleClose}
                        sx={{p:0}}
                    >
                        <CloseIcon />
                    </IconButton>
            </Box>
            <Typography component='h5' textAlign='center' >Update profile details</Typography>
            <TextField
                label='First name'
                variant='outlined'
                fullWidth
                margin='normal'
                name='first_name'
                value={profileForm.first_name}
                onChange={handleChange}
                error={errors.first_name_error !== null}
                helperText={errors.first_name_error}
                />
            <TextField
                label='Last name'
                variant='outlined'
                fullWidth
                margin='normal'
                name='last_name'
                value={profileForm.last_name}
                onChange={handleChange}
                error={errors.last_name_error !== null}
                helperText={errors.last_name_error}
                />
            <TextField
                label='Place'
                variant='outlined'
                fullWidth
                margin='normal'
                name='place'
                value={profileForm.place}
                onChange={handleChange}
                error={errors.place_error !== null}
                helperText={errors.place_error}
                />
            <TextField
                label='Image'
                variant="outlined"   
                margin='normal'       
                type="text"
                InputProps={{
                    endAdornment: (
                    <IconButton component="label">
                    <UploadFile />
                    <input
                        styles={{display:"none"}}
                        type="file"
                        // hidden
                        onChange={handleChange}
                        name="profile_img"
                    />
                    </IconButton>
                        ),
                    }}
                />
                <Button 
                    disabled={loading}
                    variant='contained' 
                    color='primary' 
                    onClick={handleSubmit}
                    >
                    Submit
                </Button>
            </Box>
            
        </Modal>
    )
}