import { Button, Card, CardContent, CircularProgress, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function NoteValueForm() {
    const params = useParams();
    const [loading, setLoading] = useState(false)

    const [addNote, setAddNote] = useState([]);

    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState({
        nombre_nota: '',
        materia_id: '',
        nota_id: '',
        valor: null
    });
    const [student, setStudent] = useState('');


    const loadStudent = async (id) => {
        const response = await fetch(`http://localhost:4000/students/${id}`)
        const data = await response.json()
        setStudent(`${data.nombre_est} ${data.apellido_est}`)
        loadSubjects(data.grupo_id)
    } 

    const loadSubjects = async (grupoId) => {
        const response = await fetch(`http://localhost:4000/subjects/bygroup/${grupoId}`, {
            method: 'GET',
            headers: { "content-type": 'application/json', "accept": 'application/json' },
        })

        const data = await response.json()
        setSubjects(data)
    }

    const loadNoteNames = async () => {
        const response = await fetch('http://localhost:4000/notes', {
            method: 'GET',
            headers: { "content-type": 'application/json', "accept": 'application/json' },
        })

        const data = await response.json()
        //setNote()
    }

    const handleSubjectChange = async (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
        const materia_id = e.target.value

        const response = await fetch(`http://localhost:4000/notes/bysubject/${materia_id}`, {
            method: 'GET',
            headers: { "content-type": 'application/json', "accept": 'application/json' },
        })

        const data = await response.json()
        setNotes(data)
        
    }

    const handleChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            estudiante_id: params.id,
            ...note
        }
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/note/grade`, {
            method: 'POST',
            body: JSON.stringify(body),   // Enviamos el body para el id del estudiante que vamos a editar
            headers: { "content-type": 'application/json', 'accept': 'application/json' },
        });
        const data = await response.json()
    }


    useEffect(() => {
        loadStudent(params.id)
    }, [])

    
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
                    <Typography fontSize='1.5rem' variant='5' textAlign='center' color='white'>
                        CREATE NOTE VALUE
                    </Typography>
                    <CardContent>

                        {/*----------------------------INICIO DEL FORMULARIO------------------------------ */}

                         <form onSubmit={handleSubmit} > 
                            <TextField
                                    variant='filled'
                                    label='STUDENT NAME'
                                    sx={{
                                        display: 'block',
                                        margin: '.5rem 0',
                                        color: 'white'
                                    }}
                                    name='nombre'
                                    value={student}
                                    disabled={false}  // REVISA!!!
                                    inputProps={{ style: { color: 'white' } }}
                                    InputLabelProps={{ style: { color: 'white' } }}
                            />
                            <div>
                                <InputLabel sx={{color: 'white'}} id="demo-simple-select-label">SUBJECT</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={note.materia_id}
                                    label="SUBJECT"
                                    name='materia_id'
                                    sx={{
                                        display: 'block',
                                        margin: '.5rem 0',
                                        color: 'white'
                                    }}
                                    onChange={handleSubjectChange}
                                >
                                    {subjects.map(subject => {
                                        return (
                                            <MenuItem
                                                key={subject.materia_id}
                                                value={subject.materia_id}
                                            >
                                                {subject.nombre_materia}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </div>

                            <div>
                                <InputLabel sx={{color: 'white'}} id="demo-simple-select-label">NOTE NAME</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={note.nota_id}
                                    label="NOTE NAME"
                                    name='nota_id'
                                    sx={{
                                        display: 'block',
                                        margin: '.5rem 0',
                                        color: 'white'
                                    }}
                                    onChange={handleChange}
                                >
                                    {notes.map(note => {
                                        return (
                                            <MenuItem
                                                key={note.nota_id}
                                                value={note.nota_id}
                                            >
                                                {note.nombre_nota}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </div>            

                            <TextField
                                variant='filled'
                                label='NOTE VALUE'
                                sx={{
                                    display: 'block',
                                    margin: '.5rem 0'
                                }}
                                name='valor'
                                value={note.valor}
                                onChange={handleChange}
                                inputProps={{ style: { color: 'white' } }}
                                InputLabelProps={{ style: { color: 'white' } }}
                            />
                            <Button
                                variant='contained'
                                color='primary'
                                type='submit'
                                disabled={!note.materia_id || !note.nota_id || !note.valor}
                            >
                                {loading ? <CircularProgress
                                    color='inherit'
                                    size={22}
                                /> : 'Create'    /*esta en mmodo edicion o creacion...*/
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