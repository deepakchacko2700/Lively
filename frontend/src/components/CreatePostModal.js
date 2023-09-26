import React from 'react'
import {Modal, TextField, IconButton, Typography, Box, Button, Icon} from '@mui/material'
import InsertPhoto from '@mui/icons-material/InsertPhoto';
import CloseIcon from '@mui/icons-material/Close';

export default function CreatePostModal(props) {
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

    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'));
    const token = token_obj.token
    const [postForm, setPostForm] = React.useState(
       { post_image : '',
        post_text : '',}
    );

    function handleChange(event) {
        const {name, value, type} = event.target
        setPostForm(prev => ({...prev,
             [name] : type==='file' ? event.target.files[0] : value 
        })
        )
    };
    function handleSubmit(event) {
        event.preventDefault();
        const form_data = new FormData();
        postForm.post_image && form_data.append('post_img', postForm.post_image, postForm.post_image.name)
        postForm.post_text && form_data.append('post_text', postForm.post_text)
        // const values = [...form_data.entries()];
        // console.log(values);
        const requestOptions = {
            method : 'POST',
            headers : {'Authorization':`Token ${token}`},
            body :form_data
        }
        fetch(`http://127.0.0.1:8000/api/post-viewset/`, requestOptions)
        .then(res => res.json())
        .then(data => {console.log(data);
                        // props.fetchPostdata();
                        })      
        .catch(err => console.error(err.message))  
    };
    
    return (
        <Modal 
            open={props.open}
            onClose={() => props.setOpenModal(false)}
        >
            <Box sx={style}>
                <Box textAlign='right' mt={-2} >
                    <IconButton onClick={() => props.setOpenModal(false)}
                        sx={{p:0}}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            <Typography component='h5'>Create your Post</Typography>
            <TextField
                label='Image'
                variant="outlined"   
                margin='normal'       
                type="text"
                InputProps={{
                    endAdornment: (
                    <Box display='flex'>
                     <Icon mb={1}>
                        <InsertPhoto />
                     </Icon>
                    
                     <input
                        styles={{display:"none"}}
                        type="file"
                        // hidden
                        onChange={handleChange}
                        name="post_image"
                     />
                    </Box>
                        ),
                    }}
                />
            <TextField
                label='Your text'
                variant='outlined'
                fullWidth
                margin='normal'
                name='post_text'
                value={postForm.post_text}
                onChange={handleChange}
                />
            
                <Button 
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