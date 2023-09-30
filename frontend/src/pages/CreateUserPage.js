import React from "react";
import {Link} from 'react-router-dom'
import { Grid, Button, TextField, Typography, InputAdornment, IconButton, Box} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility'
import  VisibilityOff  from '@mui/icons-material/VisibilityOff';
import getCookie from "../components/getCookie";
import Loader from '../components/Loader'
import { API_URL } from "../components/Constants";

export default function CreateUserPage() {
    const [formData, setFormData] = React.useState(
        { username : '',
         password : ''}
    );
    const [errors, setErrors] = React.useState(
        {usernameError:null, 
        passwordError:null}
    );
    const [loading, setLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    function handleFormData(e) {
        setFormData(prevFormData => ({...prevFormData, 
                        [e.target.name]:e.target.value}))
    };

    const  handleSubmit = async(e) =>  {
        setLoading(true)
        e.preventDefault()
        const requestOptions = {
            method : 'POST',
            headers : {'X-CSRFToken':getCookie('csrftoken'),
                        'Content-Type':'application/json'},
            body : JSON.stringify(formData)
        }
        try {
        const response = await fetch(`${API_URL}/api/create-user/`, requestOptions)
        const  data = await(response.json())
        // console.log(data)
        if (!response.ok) {
            if (data.username && data.password) {
                setErrors({usernameError: data.username,
                         passwordError: data.password})
            }
            else if (data.username) {
                setErrors({usernameError: data.username})
            }
            else {
                setErrors({passwordError: data.password})
            }
        }
        else {
            alert('Successfully registerd. Please login')
            setErrors({usernameError:null, passwordError:null})
        }
        }
        catch(error) {
            console.log('There was an error', error)
        }
        finally  {setLoading(false)}
    }
    return (
        <Grid container
            spacing={1}
            direction='column'
            alignItems='center'
            justifyContent='center'
            backgroundColor='#ebebeb'
            style={{minHeight:'100vh'}}
         >

            <Grid item container
                 sx={{
                    width:400,
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    borderRadius:2,
                    backgroundColor:'#FFF',
                    padding:'20px',
                    boxShadow: '0 0 2px #c6c8cc'
                 }}
            >
                <Grid item xs={12} align='center' p={2}>
                    <Typography  variant='subtitle1'>
                        Create User Account
                    </Typography>
                </Grid>
                <Grid item xs={12} align='center'>
                    <TextField
                        name="username"
                        required
                        label='Username'
                        variant="outlined"
                        size='small'
                        margin='normal'
                        value={formData.username}
                        onChange={handleFormData}
                        error={errors.usernameError !== null}
                        helperText={errors.usernameError}
                        InputProps={{
                            startAdornment:(
                                <InputAdornment position='start'>
                                    <AccountCircleIcon />
                                </InputAdornment>
                            )
                            }}
                        />
                </Grid>
                <Grid item xs={12} align='center'>
                    <TextField
                        name='password'
                        required
                        label='Password'
                        variant="outlined"
                        size='small'
                        margin='normal'
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleFormData}
                        error={errors.passwordError !== null}
                        helperText={errors.passwordError}
                        InputProps={{
                            startAdornment:(
                                <InputAdornment position='start'>
                                <IconButton  component='label'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    sx={{padding:0}}
                                >
                                    {showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                                </InputAdornment>
                            )
                            }}
                    />
                </Grid>

                <Grid item xs={12} align='center'>
                    <Button color="primary" variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{margin:2}}
                    >
                        Submit
                    </Button>
                </Grid>
                {loading && <Loader />}
                <Grid item xs={12} align='center'>
                    <Box component={Link} to='/' color='primary'>
                        Already registerd! Sign in
                    </Box>
                </Grid>

            </Grid>

            
            
        </Grid>
    )
}