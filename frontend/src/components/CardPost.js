import React from 'react'
import {Link} from 'react-router-dom'
import { Card, CardHeader, CardMedia, CardContent, CardActions} from '@mui/material'
import {Favorite} from '@mui/icons-material'
import {Avatar, Typography, IconButton, Box} from '@mui/material'
import {red} from '@mui/material/colors'
import ModeCommentOutlinedIcon from '@mui/icons-material/ModeCommentOutlined';
import { API_URL } from './Constants'


export default function CardPost(props) {
    const {id, post_img, post_text, post_owner, post_date,
            is_liked_by_current_user, likes_count, comments_count, linkActive} = props
    const [like, setLike] = React.useState(is_liked_by_current_user)
    const [likesCount, setLikesCount] = React.useState(likes_count)
    const [loading, setLoading] = React.useState(false)

    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'));
    const token = token_obj.token

    const ConditionalLink = linkActive ? Link : Box

    const handleLikeClick = () => {
        setLoading(true)
        const editedLike = !like
        fetch(`${API_URL}/api/post-like/`, {
            method : 'POST',
            headers : {
                'Authorization':`Token ${token}`,
                'Content-Type':'application/json',
            },
            body : JSON.stringify({'like': editedLike, 'liked_post_id': id})
               
        })
        .then(res => res.json()
        .then(data => { 
            setLike(editedLike)
            setLikesCount(data.likes_count)
            setLoading(false)
        }))
    }

     return (
                <Card sx={{
                        mb:5,
                        ml:3,
                        mr:3
                    }}
                >
                    <CardHeader 
                        avatar={
                            <Avatar component={Link} 
                                to={'../profile/' + post_owner.user.username}
                                src={post_owner.profile_img}
                                alt={post_owner.user.username}
                                sx={{
                                    transition:'transform .2s',
                                    '&:hover':{
                                        transform:'scale(1.3)'
                                    }
                                }}
                                />}
                        title={<Typography variant='h5'>
                                {post_owner.user.username}
                                </Typography>}
                        subheader={post_date}
                        sx={{backgroundColor:'#ad7893'}}
                    />
                    <ConditionalLink
                        to={'../post/' + post_owner.user.username + '/' + id}
                        style={{textDecoration:'none'}}
                    >
                    {post_img &&
                    <CardMedia 
                        component='img'
                        src = {post_img}
                        alt= ""
                        sx={{objectFit:'contain'}}
                    />
                    }
                    <CardContent 
                        sx={{backgroundColor:'#434345'}}
                    >                                                    
                        <Typography variant='body1' 
                            color='text.secondary'
                            textAlign='center'
                            sx={{color: "#FFFFFF",}}
                        >
                            {post_text}
                        </Typography>
                    </CardContent>
                    </ConditionalLink>
                    <CardActions disableSpacing 
                        sx={{display:'flex', justifyContent:'space-evenly'}}
                    >
                        <Box display='flex'>
                            < Typography variant='subtitle1' mr='3px' > {likesCount}</Typography>                   
                            <IconButton disabled={loading} 
                                onClick={handleLikeClick}
                                sx={{p:0,
                                    '&:hover':{backgroundColor:'transparent'}
                                }}
                            >
                                <Favorite 
                                    sx={{color: like ? red[500] : null}} />
                            </IconButton>
                        </Box>
                        <Box display='flex'>
                            <Typography variant='subtitle1' mr='3px'> {comments_count}</Typography>
                            <IconButton
                                component={linkActive && Link} 
                                to={'../post/' + post_owner.user.username + '/' + id}
                                sx={{p:0,
                                    '&:hover':{backgroundColor:'transparent'}
                                }}
                            >
                                <ModeCommentOutlinedIcon />
                            </IconButton>
                        </Box>
                    
                    </CardActions>

                </Card>
    )
};



