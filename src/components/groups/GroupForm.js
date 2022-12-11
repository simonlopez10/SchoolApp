import { Grid, Card, Typography, CardContent, TextField, Button, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// COMPONENTE CON FORMULARIO PARA CREACIÓN Y EDICION DE GRUPOS
export default function GroupForm() {

    const params = useParams();
    const [group, setGroup] = useState({
        grupoId: '',
        nombre: '',
        siglas: '',
        estado: true
    })

    // HOOKS
    const [loading, setLoading] = useState(false)  //inhabilita boton y muestra senal de que esta cargando la solicitud
    const navigate = useNavigate();  //Sirve para navegar entre rutas
    const [isEditing, setIsEditing] = useState(false) // Indica si estamos editando o creando (segun el caso modifica el modal)

    

    const getGroup = async (groupId) => {

         // Funcion consulta grupo por id solo en caso de edicion

        const id = parseInt(groupId)
        const response = await fetch(`http://localhost:4000/groups/${id}`)
        const data = await response.json()

        console.log(data)

        setGroup({
            grupoId: data.grupo_id,
            nombre: data.nombre_grupo,
            siglas: data.siglas_grupo,
        })
    }

    useEffect(() => {
        if (params?.id) {          // Valida si estamos creando o editando un grupo 
            setIsEditing(true)
            getGroup(params.id)
        }
    }, [params])


    const handleSubmit = async (e) => {   // Funcion para boton de envio de formulario 
        e.preventDefault();
        setLoading(true);

        if (isEditing) {
            const id = parseInt(params.id)
            await fetch(`http://localhost:4000/groups/${id}`, {
                method: 'PUT',
                body: JSON.stringify(group),
                headers: { "content-type": 'application/json' },
            });
        } else {
            console.log('estoy creando')
            await fetch("http://localhost:4000/groups", {
                method: 'POST',
                body: JSON.stringify(group),
                headers: { "content-type": 'application/json' },
            });            
        }
        setLoading(false)
        navigate("/groups/list")
    }

    const handleChange = (e) => {

        // Se encarga de cammbiar los estados del formulario
        setGroup({ ...group, [e.target.name]: e.target.value })
    }


    // Aqui empieza el JSX
    return (
        <Grid
        container
        direction='column'
        alignItems='center'
        justifyContent='center'
    >
        <Grid item xs={3}>
            <Card sx={{ mt: 5 }} style={{
                backgroundColor: '#1e272e',
                padding: '1rem'
            }}>
                <Typography fontSize='1.5rem' variant='5' textAlign='center' color='white'>  {/*esta en mmodo edicion o creacion...*/}
                    {isEditing ? "EDIT" :
                        "CREATE"
                    } GROUP
                </Typography>
                <CardContent>

                    {/*----------------------------INICIO DEL FORMULARIO------------------------------ */}

                    <form onSubmit={handleSubmit} >
                        <TextField
                            variant='filled'
                            label='GROUP NAME'
                            sx={{
                                display: 'block',
                                margin: '.5rem 0'
                            }}
                            name='nombre'
                            value={group.nombre}
                            onChange={handleChange}
                            inputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />

                        <TextField
                            variant='filled'
                            label='ABBREVIATION'
                            sx={{
                                display: 'block',
                                margin: '.5rem 0'
                            }}
                            name='siglas'
                            value={group.siglas}
                            onChange={handleChange}
                            inputProps={{ style: { color: 'white' } }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />

                        <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                            disabled={!group.nombre || !group.siglas}
                        >
                            {loading ? <CircularProgress
                                color='inherit'
                                size={22}
                            /> : isEditing ? ' Edit' : 'Create'    /*esta en mmodo edicion o creacion...*/
                            }
                        </Button>
                    </form>
                    {/*-------------------------------FIN DEL FORMULARIO------------------------------ */}

                </CardContent>
            </Card>
        </Grid>
    </Grid>
    )
}