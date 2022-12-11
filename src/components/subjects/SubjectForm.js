import { Grid, Card, Typography, CardContent, TextField, Button, CircularProgress, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';


export default function SubjectForm() {

  const params = useParams();
  const [subject, setSubject] = useState({
    grupoId: '',
    nombre: '',
    estado: true,
  })


  // HOOKS
  const [loading, setLoading] = useState(false) // inhabilita boton y muestra senal de que esta cargando la solicitud
  const navigate = useNavigate();  //Sirve para navegar entre rutas
  const [isEditing, setIsEditing] = useState(false) // Indica si estamos editando o creando (segun el caso modifica el modal)
  const [groups, setGroups] = useState([]) // Permite seleccionar nombre de grupo y nos devuelve el id

  const loadGroups = async () => {

    // Funcion que consulta los grupos. Setea los grupos con el hook

    const response = await fetch('http://localhost:4000/groups', {
      method: 'GET',
      headers: { "content-type": 'application/json', "accept": 'application/json' },
    })
    const data = await response.json()
    setGroups(data)
  };

  const getSubject = async (subjectId) => {

    // Funcion consulta materia por id solo en caso de edicion
    const id = parseInt(subjectId)
    const response = await fetch(`http://localhost:4000/subjects/${id}`)
    const data = await response.json()
    setSubject({
      grupoId: data.grupo_id,
      nombre: data.nombre_materia,
    })
  };

  useEffect(() => {

    // Carga grupos para mostrarlos en el selector
    loadGroups()
    // Valida si estamos editando o creando 
    if (params?.id) {
      setIsEditing(true)
      getSubject(params.id)
    }
  }, [params]);


  const handleSubmit = async (e) => {

    // Funcion para boton de envio de formulario 

    e.preventDefault();

    setLoading(true) // Circulito de cargar 

    // logica para caso de edicion (put) o de creacion (post) 

    if (isEditing) {
      const id = parseInt(params.id)
      await fetch(`http://localhost:4000/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(subject),
        headers: { "content-type": 'application/json' },
      });
    } else {
      await fetch('http://localhost:4000/subjects', {
        method: 'POST',
        body: JSON.stringify(subject),
        headers: { "content-type": 'application/json' },
      });
    }
    setLoading(false)
    navigate("/subjects/list")
  }

  const handleChange = (e) => {

    // Se encarga de cammbiar los estados del formulario

    setSubject({ ...subject, [e.target.name]: e.target.value })
  }

  // Aca empieza el JSX

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
            } SUBJECT
          </Typography>
          <CardContent>

            {/*----------------------------INICIO DEL FORMULARIO------------------------------ */}

            <form onSubmit={handleSubmit} >

              <div>
                <InputLabel sx={{color: 'white'}} id="demo-simple-select-label">GRUPO</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={subject.grupoId}
                  label="GROUP"
                  name='grupoId'
                  sx={{
                    display: 'block',
                    margin: '.5rem 0',
                    color: 'white'
                  }}
                  onChange={handleChange}
                >
                  {groups.map(group => {
                    return (
                      <MenuItem
                        key={group.grupo_id}
                        value={group.grupo_id}
                      >
                        {group.nombre_grupo}
                      </MenuItem>
                    )
                  })}
                </Select>
              </div>
              <TextField
                variant='filled'
                label='SUBJECT NAME'
                sx={{
                  display: 'block',
                  margin: '.5rem 0'
                }}
                name='nombre'
                value={subject.nombre}
                onChange={handleChange}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={!subject.nombre || !subject.grupoId}
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
