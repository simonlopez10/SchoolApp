import { useEffect, useState } from 'react';
import { Button, Checkbox, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';



export default function StudentsList() {

    //HOOKS
    const [students, setStudents] = useState([])  // setea los estudiantes

    const loadStudents = async () => {

        // get a endpoint de estudiantes para traer el listado

        const response = await fetch('http://localhost:4000/students');
        const data = await response.json()

        // Organiza la info de la respuesta para entregarla de una forma que le sirva a la tabla
        setStudents(data.map(({ estudiante_id, nombre_est, apellido_est, estado_estudiante, nombre_grupo, grupo_id }) => {
            return (
                {
                    id: estudiante_id,
                    nombre_est,
                    apellido_est,
                    estado_estudiante,
                    nombre_grupo,
                    grupo_id
                }
            )
        }))
    }

    // Solo se llama cuando se carga o se monta el commponente:  1) Se llamma a load students  2) load student hace la peticion 3) Organiza la informacion
    useEffect(() => {
        loadStudents()
    }, [])

    // Sirve para navegar entre rutas... react router
    const navigate = useNavigate();

    // Maneja el boton editar de la tabla, nos envia a la ruta de edidcion con el id del estudiante seleccionado
    const handleEditClick = (rowId) => {
        navigate(`/students/form/edit/${rowId}`)
    }

    // Funciones para los botones de edicion y actualizacion de estado del listado 

    // Lleva al modo edicion
    const getEditButton = (params) => {
        return (
            <Button onClick={() => handleEditClick(params.row.id)}>EDIT</Button>
        )
    }

    // Cambia el estado de cada estudiante con un checkbox
    const handleStateClick = async (row) => {

        var answer = window.confirm(`Do you really want to change the state? 
        ✅ Active
        🔲 Inactive`);

        if (answer) {

            const id = parseInt(row.id)    // convierte el string a integer
            const body = {
                grupoId: row.grupo_id,
                nombre: row.nombre_est,
                apellido: row.apellido_est,
                estado: row.estado_estudiante ? false : true
            }
            const response = await fetch(`http://localhost:4000/students/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),   // Enviamos el body para el id del estudiante que vamos a editar
                headers: { "content-type": 'application/json', 'accept': 'application/json' },
            });
            const data = await response.json()

            if (data.success) { // entra si la peticion es exitosa
                const updatedStudents = students.map((student) => { // Solammente entra cuando la peticion es exitosa (el id de la ruta coincide con algun id de la db)
                    if (student.id === id) {
                        return {
                            ...student,  // devuelve al estudiante tal como esta
                            estado_estudiante: !student.estado_estudiante // Cambia al estado opuesto
                        }
                    }
                    return { ...student };
                })
                setStudents(updatedStudents); // actualiza el estado 
            }

        } else {
            navigate('/students/list')
        }
    }

    // Retorna el checbox de cada fila y trae el estado de la db
    const getStateCheckbox = (params) => {
        return (
            <Checkbox
                onClick={() => handleStateClick(params.row)}
                checked={params.row.estado_estudiante}
            />
        )
    }


    // Muestra el formulario para adicion de notas y lleva a la info a la db

    const handleAddNoteClick = async (rowId) => {
        navigate(`/notes/note-value-form/${rowId}`)
    };

    // Crea el boton en la fila para abrir el formulario de adicion de notas

    const getAddNoteForm = (params) => {
        return (
            <Button onClick={() => handleAddNoteClick(params.row.id)}>➕</Button>
        )
    }



    const columns = [
        { field: 'nombre_est', headerName: 'FIRST NAME', width: 200 },
        { field: 'apellido_est', headerName: 'LAST NAME', width: 200 },
        { field: 'nombre_grupo', headerName: 'GROUP', width: 200 },
        { field: 'edit', headerName: 'EDIT', width: 200, sortable: false, renderCell: getEditButton },
        { field: 'state', headerName: 'STATE', width: 200, sortable: false, renderCell: getStateCheckbox },
        { field: 'addNote', headerName: 'ADD NOTE', width: 130, sortable: false, renderCell: getAddNoteForm }
    ]

    // Aca empieza el JSX
    return (

        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>STUDENTS</h1>
                <Button variant='contained' color='primary' sx={{ padding: -5, marginTop: 3, marginBottom: 3 }} onClick={() => navigate("/students/form")}>
                    CREATE STUDENT
                </Button>
            </Box>

            <div style={{ height: 450, width: '100%' }}>
                <DataGrid
                    rows={students}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    sx={{
                        color: 'white',
                        boxShadow: 2,
                        border: 2,
                        borderColor: 'wheat',
                        '& .MuiDataGrid-cell:hover': {
                            color: 'primary.main',
                        },
                    }}
                />
            </div>
        </>

    )
}