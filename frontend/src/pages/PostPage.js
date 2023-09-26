import React from 'react'
import {Box, Fab, Grid,} from '@mui/material'
import CreatePostModal from '../components/CreatePostModal'
import CardPost from '../components/CardPost'


export default function PostPage() {
    const [openModal, setOpenModal] = React.useState(false)
    const [posts, setPosts] = React.useState([])
    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'))
    const token = token_obj.token

    const fetchPosts = React.useCallback( async() => {
        const requestOptions ={
            method : 'GET',
            headers : {'Content-Type':'application/json',
                        'Authorization':`Token ${token}`},
        };
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/post-viewset/`, requestOptions)
            const data = await response.json()
            setPosts(data)
        } catch (error) {
            console.log(error)
        }
    }, [token]);

    React.useEffect(() => {
        fetchPosts()
    }, [fetchPosts]);

    const postItems = posts.map(item => {
        return(
        <CardPost 
            key = {item.id}
            linkActive={true}
            {...item}
        /> )}
        );

    return(
        <>
        <Grid container 
            sx={{ 
                minHeight:'100vh',
                position:'relative',
                justifyContent:'center'
            }}
        >
                <Box>
                    {posts && postItems}

                    <Fab variant='extended'
                        size='medium' 
                        color='secondary'
                        sx={{position: "sticky", 
                        bottom:5, left:1}}
                        onClick={() => setOpenModal(true)}
                    >
                        Create New Post
                    </Fab>
                </Box>
                
                <div className='createPostModal-contaner'>
                    {openModal && <CreatePostModal 
                                    open={openModal}
                                    setOpenModal={setOpenModal} />}
                </div>
        </Grid>
    </>
    )
}