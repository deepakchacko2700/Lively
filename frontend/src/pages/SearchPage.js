import React from 'react'
import {Box, TextField, IconButton, Avatar, Typography, Modal } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { nanoid } from 'nanoid'
import {Link} from 'react-router-dom'
import { API_URL } from '../components/Constants'

export default function SearchPage() {
    const [searchField, setSearchField] = React.useState('')
    const [searchResult, setSearchResult] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'))
    const token = token_obj.token

    const handleClick = () => {
        fetch(`${API_URL}/api/profile-viewset/searchProfile?username=${searchField}`, {
            method: 'GET',
            headers: {'Authorization':`Token ${token}`,
                        'Content-Type':'application/json'
            },
        })
        .then(res => res.json())
        .then(data => {
            setSearchResult(data)
            setOpen(true)
        })
        .catch(err => console.error(err.message))
    };

    const searchItems = searchResult.map(item => 
        <Box key={nanoid()} 
            sx={{display:'flex',
                justifyContent:'flex-start',
                pb:1,
            }} 
        >
            <Avatar alt={item.user.username} 
                    src={item.profile_img}
                    component={Link}
                    to={"../profile/" + item.user.username} />
            <Typography m={1}>{item.user.username}</Typography>
        </Box>
    );

    return(
        <Box>
            <TextField 
                label='Search Profiles'
                variant='standard'
                type='text'
                size='small'
                sx={{width:'90vw', ml:3}}
                value={searchField}
                onChange={(e)=> setSearchField(e.target.value)}
                InputProps={{
                    endAdornment: (
                    <IconButton  onClick={handleClick}> 
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
                        top:80,
                        left:20,
                        color:'#213421',
                        backgroundColor:"#ebe8e8",
                        borderRadius:1
                    }}
                >
                    {searchItems.length > 0 ? searchItems : 'not found'}
                </Box>
            </Modal>
        </Box>
    )
}