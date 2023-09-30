import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import {Button, TextField, Typography, IconButton, InputAdornment, Box} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Visibility from '@mui/icons-material/Visibility'
import  VisibilityOff  from '@mui/icons-material/VisibilityOff';
import Loader from '../components/Loader'
import { API_URL } from '../components/Constants';

export default function LoginPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = React.useState({
                    username : '',
                    password : '', });
    const [errors, setErrors] = React.useState({
                    username_empty : '',
                    password_empty : '',
                })
    const [credentialsError, setCredentialsError] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    const handleChange = (event) => {
        setCredentials(prev => (
            {...prev, [event.target.name] : event.target.value}
        ))
    };
    
    const validate = () => {
        if(!credentials.username) {
             setErrors(prev=>({...prev,username_empty:'Username is required!'}))
             return false}
        else if (!credentials.password){
             setErrors({username_empty:'',password_empty:'Password is required!'})
             return false}
        else {
            return true
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const fetchToken = async(credentials) => {
            setLoading(true)
            const requestOptions = {
                method : 'POST',
                headers : {'Content-Type':'application/json'},
                body :JSON.stringify(credentials)
            }

            try {
                const result = await fetch(`${API_URL}/api-token-auth/`, requestOptions)
                if (!result.ok) {
                    throw new Error ('Invalid Username or Password')
                };
                const data = await result.json()
                sessionStorage.setItem('Token_obj', JSON.stringify(data))
                data.username && navigate(`post/${data.username}`)       
            } catch (error) {
                console.log(error.message)
                setCredentialsError(error.message)
            } finally {
                setLoading(false)
            }
            
        };
        if (validate()){
        fetchToken(credentials)
        setErrors({username_empty:'', password_empty:''})
        }
    };

    return(
        <form>
            <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    minHeight:'100vh',
                    backgroundColor:'#ddcade'
                }}
            >
                <Typography variant='h5'
                    sx={{
                        color:'#b548b1',
                        fontWeight:600,
                        fontFamily:'serif',
                        mb:2
                    }}
                >
                    Lively
                </Typography>
                <Box sx={{
                    display:'flex',
                    flexDirection:'column',
                    justifyContent:'center',
                    alignItems:'center',
                    width:'40vw',
                    borderRadius:2,
                    backgroundColor:'#FFF',
                    padding:'20px',
                    boxShadow: '0 0 2px #c6c8cc'
                    }}
                >
                    <Typography variant='subtitle1' pb={2}>
                         Sign in to Lively  
                    </Typography>
                    <TextField 
                        required
                        name='username'
                        value={credentials.username}
                        label='Username'
                        variant='outlined'
                        size='small'
                        margin='normal'
                        type='text'
                        InputProps={{
                            startAdornment:(
                            <InputAdornment position='start'>
                                <AccountCircleIcon />
                            </InputAdornment>
                            )
                            }}
                        onChange={handleChange}
                        error={errors.username_empty !== ''}
                        helperText={errors.username_empty}
                    />
       
                    <TextField
                        required
                        name='password'
                        value={credentials.password}
                        label='Password'
                        variant='outlined'
                        size='small'
                        margin='normal'
                        type={showPassword ? 'text' : 'password'}
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
                        onChange={handleChange}
                        error={errors.password_empty !== ''}
                        helperText={errors.password_empty}
                    />
        
                    <Button variant='contained'
                         onClick={handleSubmit}
                         disabled={loading}
                         sx={{marginTop:2}}
                    >
                        Sign In
                    </Button>
                    
                    <Box sx={{color:'red'}}>
                        {credentialsError && <span>{credentialsError}</span>}<br/>
                    </Box> 
                    <Box component={Link} to='/create-user' sx={{color:'primary'}}>
                        <Typography variant='body2' textAlign='center' >
                            Do not own an account. Create yours
                        </Typography>
                    </Box>
                </Box>
                {loading && <Loader />}
            </Box>          
        </form>
    )
}