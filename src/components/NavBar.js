import { AppBar, Box, Button, Container, Toolbar, Typography, IconButton } from '@mui/material';
import { Link, useNavigate, use, useLocation } from 'react-router-dom';




export default function NavBar() {

    const navigate = useNavigate();
    const location = useLocation();
   
    if (['/login', '/signup'].includes(location.pathname)){
        return null;
    }

    const handelLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static' color='transparent'>
                <Container>
                    <Toolbar variant='regular'>
                        <Typography variant='h4' sx={{ flexGrow: 1, marginLeft: -4 }}>
                            <Link to='/' style={{ textDecoration: 'none', color: '#eee' }}>SCHOOL APP</Link>
                        </Typography>

                        <Button variant='outlined' size='medium' color="primary" sx={{ margin: 1 }} onClick={() => navigate("/groups/list")}>
                            Groups
                        </Button>

                        <Button variant='outlined' size='medium' color="primary" sx={{ margin: 1 }} onClick={() => navigate("/students/list")}>
                            Students
                        </Button>

                        <Button variant='outlined' size='medium' color="primary" sx={{ margin: 1 }} onClick={() => navigate("/subjects/list")}>
                            Subjects
                        </Button>

                        <Button variant='outlined' size='medium' color="primary" sx={{ margin: 1 }} onClick={() => navigate("/notes/names")}>
                            Pensum
                        </Button>

                        <Button variant='outlined' size='medium' color="primary" sx={{ margin: 1 }} onClick={() => navigate("/notes/values")}>
                            Notes values
                        </Button>

                        <Button variant="outlined" color="error" sx={{marginLeft: 2}} onClick={() => handelLogout()}>
                            logout
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    )
}