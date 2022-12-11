import { Grid, Card, Typography, CardContent, TextField, Button, CircularProgress, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

export default function NoteNameForm() {

    const params = useParams();
    const [note, setNote] = useState({
        noteId: '',
        grupoId: '',
        materiaId: '',
        nombre: '',
        nombreGrupo: '',
        nombreMateria: ''
    })

    const [loading, setLoading] = useState(false) // inhabilita boton y muestra senal de que esta cargando la solicitud
    const navigate = useNavigate();
    const [groups, setGroups] = useState([])
    const [subjects, setSubjects] = useState([])
    const [isEditing, setIsEditing] = useState(false)


    const loadGroups = async () => {

        // Funcion que consulta los grupos para ponerlos en el formulario

        const response = await fetch('http://localhost:4000/groups', {
            method: 'GET',
            headers: { "content-type": 'application/json', "accept": 'application/json' },
        })
        const data = await response.json()
        setGroups(data)
    }

    const getSubject = async (groupId) => {

        // Funcion consulta materia por id solo en caso de edicion
        const id = parseInt(groupId)
        const response = await fetch(`http://localhost:4000/subjects/bygroup/${id}`)
        const data = await response.json()
        setSubjects(data)
    };

    const getNote = async (noteId) => {

        // Funcion consulta estudiante por id solo en caso de edicion
        const id = parseInt(noteId)
        const response = await fetch(`http://localhost:4000/notes/${id}`)
        const data = await response.json()
        
        getSubject(data.grupo_id);

        setNote({
            noteId: data.nota_id,
            grupoId: data.grupo_id,
            materiaId: data.materia_id,
            nombreMateria: data.nombre_materia,
            nombre: data.nombre_nota,
            nombreGrupo: data.nombre_grupo
        })
    }





    useEffect(() => {
        loadGroups()
        if (params?.id) {
            setIsEditing(true)
            getNote(params.id)
        }
    }, [params])

    // Muestra las materias en el selectior segun el grupo seleccionado
    const handleGroupChange = async (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
        const groupId = parseInt(e.target.value)
        const response = await fetch(`http://localhost:4000/subjects/bygroup/${groupId}`, {
            method: 'GET',
            headers: { "content-type": 'application/json', "accept": 'application/json' },
        })
        const data = await response.json()
        setSubjects(data)
    }


    const handleSubmit = async (e) => {

        // Funcion para boton de envio de formulario 

        e.preventDefault();

        setLoading(true) // Circulito de cargar 

        // logica para caso de edicion (put) o de creacion (post) 

        if (isEditing) {
            const id = parseInt(params.id)
            await fetch(`http://localhost:4000/notes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(note),
                headers: { "content-type": 'application/json' },
            });
        } else {
            await fetch('http://localhost:4000/notes', {
                method: 'POST',
                body: JSON.stringify(note),
                headers: { "content-type": 'application/json' },
            });
        }
        setLoading(false)
        navigate("/notes/list")
    }



    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }



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
                        } NOTE NAME
                    </Typography>
                    <CardContent>

                        {/*----------------------------INICIO DEL FORMULARIO------------------------------ */}

                        <form onSubmit={handleSubmit} >

                            <div>
                                <InputLabel sx={{color: 'white'}} id="demo-simple-select-label">GROUP</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={note.grupoId}
                                    label="GROUP"
                                    name='grupoId'
                                    sx={{
                                        display: 'block',
                                        margin: '.5rem 0',
                                        color: 'white'
                                    }}
                                    onChange={handleGroupChange}
                                >
                                    {groups.map(group => {
                                        return (
                                            group.estado_grupo ? (
                                                <MenuItem
                                                    key={group.grupo_id}
                                                    value={group.grupo_id}
                                                >
                                                    {group.nombre_grupo}
                                                </MenuItem>
                                            ) :
                                                null
                                        )
                                    })}

                                </Select>
                            </div>
                            <div>
                                <InputLabel sx={{color: 'white'}} id="demo-simple-select-label">SUBJECT</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={note.materiaId}
                                    disabled={!subjects.length}
                                    label="GROUP"
                                    name='materiaId'
                                    sx={{
                                        display: 'block',
                                        margin: '.5rem 0',
                                        color: 'white'
                                    }}
                                    onChange={handleChange}
                                >
                                    {subjects.map(subject => {
                                        return (
                                            subject.estado_materia ? (
                                                <MenuItem
                                                    key={subject.materia_id}
                                                    value={subject.materia_id}
                                                >
                                                    {subject.nombre_materia}
                                                </MenuItem>
                                            ) :
                                                null
                                        )
                                    })}

                                </Select>
                            </div>
                            <TextField
                                variant='filled'
                                label='NOTENAME'
                                sx={{
                                    display: 'block',
                                    margin: '.5rem 0'
                                }}
                                name='nombre'
                                value={note.nombre}
                                onChange={handleChange}
                                inputProps={{ style: { color: 'white' } }}
                                InputLabelProps={{ style: { color: 'white' } }}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                disabled={!note.nombre || !note.grupoId || !note.materiaId}
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

