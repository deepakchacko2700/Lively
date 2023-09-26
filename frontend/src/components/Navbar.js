import React from 'react';
import {NavLink, Link, useNavigate} from 'react-router-dom'
import { AppBar, Toolbar, Box, IconButton, Typography } from '@mui/material';
import {Menu, MenuItem, Button, Avatar, Modal} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

export default function NavBar({token, username}) {
    const pages = ['profile', 'post']
    const [userProfile, setUserProfile] = React.useState(null)
    const [anchorElNav, setAnchorElNav] = React.useState(null)
    const [openModal, setOpenModal] = React.useState(false)
    
    const navigate = useNavigate()

    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/profile-viewset/${username}/get_userProfile/`, {
            method : 'GET',
            headers : {
                'Authorization' : `Token ${token}`,
            }
        })
        .then(res => res.json())
        .then(data => setUserProfile(data))
        .catch(error => console.error(error.message))
    }, [username, token]
    );

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout = () => {
        fetch(`http://127.0.0.1:8000/api-logout/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`
                }
            }
        ).then(res => {
            console.log(res.status)
            navigate('/')
            })
        .catch(err =>
            console.log(err)
        )
    }
    const modal = (openModal) => {
        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            // border: '1px solid #000',
            boxShadow: 24,
            pt: 1,
          };
        return(
            <Modal 
                open={openModal}
                onClose={() => setOpenModal(false)}
            >
                <Box sx={style} 
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                >
                    <Typography variant='body2' >
                        Are you sure you want to log out
                    </Typography>
                    <Box display='flex' width='inherit' justifyContent='space-evenly'>
                        <Button onClick={handleLogout} size='small' >
                            Log out
                        </Button>
                        <Button onClick={() => setOpenModal(false)} size='small' color='error'>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>

        )
    }

    return (
            <AppBar 
                position='static' 
                sx={{backgroundColor: '#ffffff',
                    color:'#b548b1'}}
            >
                <Toolbar >
                    <Box sx={{display:'flex'}} >
                        {userProfile && <Avatar alt={userProfile.user.username}
                            src={userProfile.profile_img}
                            component={Link}
                            to={"../profile/" + userProfile.user.username}
                            sx={{width:50, 
                                height:50,
                                transition:'transform .2s',
                                '&:hover':{
                                    transform:'scale(1.3)'
                                }
                            }}
                        /> } 
                    </Box>
                    <Typography variant='h4'
                        sx={{
                            fontWeight:600,
                            fontFamily:'serif',
                            ml:3                           
                        }}
                     >
                        Lively
                    </Typography>

                    <Box float='right' 
                        display='flex'
                        marginLeft='auto'
                        marginRight={3}
                    >

                        <Box sx={{
                            display:{xs:'flex', md:'none'},
                            color:'#b548b1'
                            }}
                        >
                            <IconButton
                                size='large'
                                onClick={handleOpenNavMenu}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                    }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                    }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                { userProfile && pages.map((page) => (
                                <MenuItem 
                                    key={page} 
                                    onClick={handleCloseNavMenu}
                                    component={Link}
                                    to={`../${page}/` + userProfile.user.username }    
                                    sx={{minHeight:10}}
                                >
                                    <Typography textAlign="center"
                                        sx={{fontSize:13}}
                                    >
                                        {page.toUpperCase()}
                                    </Typography>
                                </MenuItem>
                                ))}
                                <MenuItem 
                                    component={Button}
                                    onClick={() => {handleCloseNavMenu() 
                                        setOpenModal(true)}}
                                    sx={{ minHeight:10}}
                                >
                                    <Typography textAlign='center'
                                        sx={{fontSize:13}}
                                    >
                                        LOG OUT
                                    </Typography>
                                </MenuItem>
                            
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            
                            { userProfile && pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, 
                                    color: '#b548b1',
                                    display: 'block',
                                    '&.active':{'textDecoration':'underline', color:'#232323'} 
                                }}
                                component={NavLink}
                                to={`../${page}/`+ userProfile.user.username}
                            >
                                {page}
                            </Button>
                            ))}
                            <Button
                                onClick={() => {handleCloseNavMenu()
                                            setOpenModal(true)}
                                    }
                                sx={{ my: 2, 
                                    color: '#b548b1',
                                    display: 'block',
                                    '&.active':{'textDecoration':'underline', color:'#232323'} 
                                }}
                            >
                                LOG OUT
                            </Button>
                        </Box>
                        <Box>
                            {modal(openModal)}
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton 
                                size='large'
                                component={Link} 
                                to='../search-profile'
                            >
                                <SearchIcon  />
                            </IconButton>
                        </Box>
                    </Box>

                </Toolbar>
            </AppBar>
    )
}


