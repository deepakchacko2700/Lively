import React from 'react';
import {IconButton, TextField, Box, Avatar, Typography, Modal} from '@mui/material'
import SearchIcon from "@mui/icons-material/Search"
import { nanoid } from 'nanoid';
import {Link} from 'react-router-dom'
import '../App.css'
import { API_URL } from './Constants';


export default function ViewProfiles({token}) {
    const [searchField, setSearchField] = React.useState('')
    const [searchResult, setSearchResult] = React.useState([])
    const[profiles, setProfiles] = React.useState([])
    const [open, setOpen] = React.useState(false)
    
    const searchItems = searchResult.map(item => 
            <Box key={nanoid()} 
                sx={{display:'flex',
                    justifyContent:'flex-start',
                    pb:1,
                    fontFamily:'Helvetica, sans-serif'
                }} 
            >
                <Avatar alt={item.user.username} 
                        src={item.profile_img}
                        component={Link}
                        to={"../profile/" + item.user.username} />
                <Typography m={1} variant='body2'>{item.user.username}</Typography>
            </Box>
    );

    const profileItems = profiles.map(item => 
        <Box key={nanoid()}
            component={Link}
            to={"../profile/" + item.user.username} 
            
            sx={{display:'flex',
                justifyContent:'flex-start',
                m:1,
                mb:2,
                // pb:1,
                textDecoration:'none',
                color:'#121212',
                fontFamily:'Helvetica, sans-serif',
                '&:hover': {backgroundColor:'#e3e2e1',
                            borderRadius:2}
            }} 
        >
            <Avatar alt={item.user.username} 
                    src={item.profile_img}                    
                    width={40}
            />
            <Typography variant='body2' m={1} >{item.user.username}</Typography>
        </Box>
    );
   
    React.useEffect(() => {
        fetch(`${API_URL}/api/profile-viewset/`, {
            method : 'GET',
            headers : {
                'Authorization':`Token ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => setProfiles(data))
        .catch(err => console.error(err.message))
    }, [token]);

    const handleClick = () => {
        if (searchField) {
        fetch(`${API_URL}/api/profile-viewset/searchProfile?username=${searchField}`, {
            method: 'GET',
            headers: {'Authorization':`Token ${token}`},
        })
        .then(res => res.json())
        .then(data => {
            setSearchResult(data)
            setOpen(true)
        })
        }
    };

    return(
        <Box sx={{
                 position:'absolute',
                //   top:0,
                 overflow:'auto',
                 backgroundColor:'#ededed',
                 height:'100vh',
                 m:'0 auto',
                 borderRadius:1,
                 pl:1,
                 pr:1,
                }} >
                <TextField 
                    label='Search Profiles'
                    variant='standard'
                    type='text'
                    size='small'
                    sx={{ mb:3, pt:0}}
                    value={searchField}
                    onChange={(e)=> setSearchField(e.target.value)}
                    InputProps={{
                        endAdornment: (
                        <IconButton  onClick={handleClick} sx={{p:0}}> 
                            <SearchIcon />
                        </IconButton>
                        )
                    }}
                />
                
            <Modal 
                open={open}
                onClose={()=> setOpen(false)}
            > 
                <Box sx={{position:'absolute',
                        width:210,
                        top:150,
                        right:70,
                        color:'#213421',
                        backgroundColor:"#ebe8e8",
                        borderRadius:1
                    }}
                >
                    {searchItems.length > 0 ? searchItems : 'not found'}
                </Box>
            </Modal>
            <Box >
                    {profileItems}
            </Box>
           
        </Box>
        
    )
}