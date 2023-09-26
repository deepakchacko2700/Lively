import React from 'react'
import { useParams } from 'react-router-dom'
import { Button, Grid, Typography, Box} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import dummyImage from '../images/user-dummy.jpg'
import '../App.css'
import UpdateProfileModal from '../components/UpdateProfileModal'
import CardPost from '../components/CardPost';
import { nanoid } from 'nanoid';




export default function ProfilePage() {
    let {username} = useParams();
    const [profileData, setProfileData] = React.useState({})
    const[profilePosts, setProfilePosts] = React.useState([])
    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'))
    const token = token_obj.token
    // console.log(token_obj)
    const token_obj_username = token_obj.username

    const fetchProfiledata = React.useCallback(async() => {
        const requestOptions ={
            method : 'GET',
            headers : {'Authorization':`Token ${token}`},
        };
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/profile-viewset/${username}`,
                                requestOptions)
            const data = await response.json()
            setProfileData(data)
        } catch (error) {
            console.log(error)
        }
    }, [username, token]);

    React.useEffect(() => {
        fetchProfiledata()
    }, [fetchProfiledata]);

    React.useEffect(() => {
        if (profileData.id) {
        fetch(`http://127.0.0.1:8000/api/post-viewset/get_profilePosts?profile_id=${profileData.id}`,
            {
                method :'GET',
                headers : {'Content-Type':'application/json',
                        'Authorization':`Token ${token}`},
            }
        )
        .then(res => res.json())
        .then(data => setProfilePosts(data))}
    }, [profileData.id, token]);

    const profilePostsItems = profilePosts.map(post =>
            <CardPost key={nanoid()} {...post} linkActive={true} />
        );

    return(
        <Grid container spacing={0} 
            sx={{ 
                minHeight:'100vh',
                position:'relative',
                flexDirection:'column'
            }}
        >
           
                <Box width={400} m='0 auto' >
                    <Grid container 
                        borderRadius={3} 
                        boxShadow= '0 0 4px #c6c8cc'
                        backgroundColor='#434345'
                        color='#edeef0'
                    >
                        <Grid item xs={12} mb={2} textAlign='center'  >
                            <img 
                                src={profileData.profile_img ? profileData.profile_img : dummyImage}
                                alt=''
                                style={{width:400,
                                    height:400, 
                                    borderRadius:2,
                                }}              
                            />
                        </Grid>

                        <Grid item xs={12} container 
                            columnSpacing={6}
                            rowSpacing={1}
                            alignItems='center'
                            justifyContent='center'
                        >
            
                            <Grid item xs={6} textAlign='end'>
                                <AccountCircleIcon sx={{mt:1}} />
                            </Grid>
                            <Grid item  xs={6}  >                            
                                <Typography variant='h6' 
                                    fontWeight={400}
                                    fontFamily='"Lucida Console" Monospace'
                                > 
                                    {username}
                                </Typography>
                            </Grid>
                            <Grid item  xs={6} textAlign='end'>
                                <Typography variant='body2' 
                                >
                                    Name
                                </Typography>
                            </Grid>
                            <Grid item  xs={6} >
                                <Typography variant='body2'>{profileData.first_name} {profileData.last_name}</Typography>
                            </Grid>
                            <Grid item xs={6} textAlign='end'>
                                <Typography variant='body2'>Location</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant='body2'>{profileData.place}</Typography>
                            </Grid>
                            <Grid item xs={6}  textAlign='end' pb={2}>
                                <Typography variant='body2'>
                                     {profileData.followers ? profileData.followers : 0}  Followers
                                </Typography>
                            </Grid>
                            <Grid item xs={6} pb={2}>
                                <Typography variant='body2' > 
                                    {profileData.following ? profileData.following : 0}  Following
                                </Typography>
                            </Grid>
                            
                        </Grid>
                    </Grid>
                    <Grid item xs={12} textAlign='center'>
                        { username===token_obj_username 
                        && <Button onClick={handleOpen} 
                                variant='contained'
                                sx={{backgroundColor:'#191a1c', mb:4}}
                            >
                                Update profile
                            </Button>
                        }
                                
                        { username !== token_obj_username 
                        && <FollowButton 
                                token={token}
                                follow_status={profileData.follow_status}
                                setProfileData={setProfileData}
                                id={profileData.id}                       
                            />
                        }
                    </Grid>
                    <div className='updateModal-container'>
                                {open && 
                                <UpdateProfileModal 
                                    open={open}
                                    handleClose={handleClose}
                                    username={username}
                                    token={token}
                                    fetchProfiledata={fetchProfiledata}
                                    {...profileData}
                                />
                                }
                    </div> 
                </Box>

                <Box  
                    m='5 auto' 
                    borderTop='2px double #221122'
                    width={400}
                >
                    {profilePosts[0] &&
                    <Typography variant='subtitle1'
                         sx={{width:'70px',
                            backgroundColor:'#d7d8db',
                            borderRadius:1,
                            m:1,
                            textAlign:'center'
                        }}
                    >
                       Posts
                    </Typography>}

                    <Box>
                        {profilePosts && profilePostsItems}
                    </Box>
                </Box>
        
        </Grid>
        

    )
};


function FollowButton ({follow_status, token, id, setProfileData}) {
   
    const handleClick = () => {
        if (typeof(follow_status) !== 'undefined') {
            const followStatus = !follow_status
            const requestOptions = { 
            method : 'PUT',
            headers : {
                        'Authorization':`Token ${token}`,
                        'Content-Type':'application/json',
                        },
            body : JSON.stringify({'followStatus' : followStatus})
        };
        fetch(`http://127.0.0.1:8000/api/follow/${id}/`, requestOptions)
        .then(res => res.json())
        .then(data => { 
            setProfileData(prevData => (
                {...prevData, 
                    followers:data.followers,
                    follow_status:followStatus
                }
                ))
        })

        };
    };

    return (
        <div>
            <Button onClick={handleClick} variant='contained'>
                {follow_status ? 'Unfollow' : 'follow'}
            </Button>
        </div>
    )
}


