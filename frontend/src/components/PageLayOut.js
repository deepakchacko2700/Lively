import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import ViewProfiles from "./ViewProfiles";
import {Grid } from '@mui/material';


export default function PageLayOut() {
    
    const token_obj = JSON.parse(sessionStorage.getItem('Token_obj'))
    const token = token_obj.token
    const username = token_obj.username

    return(
        <Grid container spacing={0} 
            sx={{ 
                minHeight:'100vh',
                position:'relative',
            }}
        >
            <Grid item xs={12} mb={4}>
                <NavBar token={token} username={username} />
            </Grid>
            <Grid item xs={12} md={9} container>
                <Outlet />
            </Grid>
            <Grid item xs={3} 
                sx={{
                    display:{xs:'none', md:'flex'},
                    position:'sticky',
                    top:10,
                    height:'100vh',
                    p:0
                }}
            >
                <ViewProfiles token={token} />
            </Grid>
        </Grid>
    )
}