import React from 'react'
import { useParams, useNavigate} from 'react-router-dom'
import {Grid, Box, TextField, IconButton, Typography, Avatar, Button} from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import CardPost from '../components/CardPost'
import { nanoid } from 'nanoid';


export default function SinglePostView() {
    const navigate = useNavigate()
    const {id} = useParams()
    const[post, setPost] = React.useState(null)
    const[comments, setComments] = React.useState([])
    const[comment, setComment] = React.useState('')
    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'))
    const token = token_obj.token
    // console.log(comment, id)

    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/post-viewset/${id}`,
        {
            method :'GET',
            headers : {'Authorization':`Token ${token}`},
        }
        ).then(res => res.json())
        .then(data => setPost(data))
        .catch(err => console.error(err.message))
    }, [id, token]);

    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/comments-viewset?post_id=${id}`,
        {
            method:'GET',
            headers: {'Authorization':`Token ${token}`},
            'Content-Type':'application/json',
        }
        ).then(res => res.json())
        .then(data => {
                setComments(data)
        })
    }, [token, id])

    const commentItems = comments.map(item => 
        <Box key={nanoid()}            
            sx={{display:'flex',
                justifyContent:'flex-start',
                alignItems:'center',
                mt:1,
                // pb:1,
                color:'#121212',
                fontFamily:'Helvetica, sans-serif',
            }} 
        >
            <Avatar 
                src={item.comment_by.profile_img}                    
                sx={{width:30, height:30}}
            />
            <Box ml={2} 
                backgroundColor='#e4e5eb'
                pl={1}
                pr={1}
                borderRadius={2}    
            >
                <Typography variant='body2'
                    sx={{fontWeight:550, fontSize:12}}
                >
                    {item.comment_by.user.username}
                </Typography>
                <Typography variant='body2'
                    sx={{color:'#363638',
                        pl:1
                    }}
                >
                    {item.text}
                </Typography>
            </Box>
        </Box>
    );
    
    const handleClick = () => {
        const comments_count = comments.length
        fetch(`http://127.0.0.1:8000/api/comments-viewset/`, {
            method: 'POST',
            headers: {'Authorization':`Token ${token}`,
                        'Content-Type':'application/json',
                        // 'Accept':'application/json'
            },
            body: JSON.stringify({'text':comment, 'post':id})
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            setComments(prevComments => [data, ...prevComments])
            setComment('')
            setPost(prev => ({...prev, comments_count:comments_count+1}))
        })
    };
    return(
        <>
            <Grid container>
               
                <Grid item xs={12} ml={2} mt={-3}>
                    <Typography variant='subtitle1' 
                        component={Button}
                        sx={{textDecoration:'underline',
                                mb: {xs:2, md:0}
                        }}
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Typography>
                </Grid>
                <Grid item  container
                 sx={{
                    justifyContent:'flex-start',
                    alignItems:'center',
                    position:'relative' ,
                    flexDirection:'column',
                    mt:-2,
                    }}
                >
                    <Box  width={450}>
                        {post && <CardPost {...post} /> }                       
                    </Box>
                    <Box mt='-30px' mb={3} width={450}>
                            <TextField 
                                fullWidth
                                name='comment'
                                label='Write your comment'
                                variant='filled'
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                                type='text'
                                size='small'
                                sx={{borderRadius:4}}
                                InputProps={{
                                    endAdornment: (
                                    <IconButton  onClick={handleClick}> 
                                        <SendIcon />
                                    </IconButton>
                                    )
                                }}
                            />
                            { commentItems}
                    </Box>
                </Grid>

            </Grid>
        </>
    )
}