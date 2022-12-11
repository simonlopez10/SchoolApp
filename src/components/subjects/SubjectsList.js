import { useEffect, useState } from 'react';
import { Button, Checkbox, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';



export default function SubjectsList() {

    //HOOKS
    const [subjects, setSubjects] = useState([])  // setea las materias

    const loadSubjects = async () => {

        // get a endpoint de materias para traer el listado

        const response = await fetch('http://localhost:4000/subjects');
        const data = await response.json()

        // Organiza la info de la respuesta para entregarla de una forma que le sirva a la tabla
        setSubjects(data.map(({ materia_id, grupo_id, nombre_materia, nombre_grupo, estado_materia }) => {
            return (
                {
                    id: materia_id,
                    nombre_materia,
                    estado_materia,
                    nombre_grupo,
                    grupo_id,
                }
            )
        }))
    }

    // Solo se llama cuando se carga o se monta el commponente:  1) Se llamma a load students  2) load student hace la peticion 3) Organiza la informacion
    useEffect(() => {
        loadSubjects()
    }, [])

    // Sirve para navegar entre rutas... react router
    const navigate = useNavigate();


    // Maneja el boton editar de la tabla, nos envia a la ruta de edidcion con el id del estudiante seleccionado
    const handleEditClick = (rowId) => {
        navigate(`/subjects/form/edit/${rowId}`)
    }

    const getEditButton = (params) => {
        return (
            <Button onClick={() => handleEditClick(params.row.id)}>edit</Button>
        )
    }

    // Funciones para los botones de edicion y actualizacion de estado del listado 

    // Cambia el estado de cada estudiante con un checkbox
    const handleStateClick = async (row) => {

        var answer = window.confirm(`Do you really want to change the state? 
        ✅ Active
        🔲 Inactive`);

        if (answer) {

            const id = parseInt(row.id)    // convierte el string a integer
            console.log(row)
            const body = {
                grupoId: row.grupo_id,
                nombre: row.nombre_materia,
                estado: row.estado_materia ? false : true
            }
            const response = await fetch(`http://localhost:4000/subjects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),   // Enviamos el body para el id del estudiante que vamos a editar
                headers: { "content-type": 'application/json', 'accept': 'application/json' },
            });
            const data = await response.json()

            if (data.success) { // entra si la peticion es exitosa
                const updatedSubjects = subjects.map((subject) => { // Solammente entra cuando la peticion es exitosa (el id de la ruta coincide con algun id de la db)
                    if (subject.id === id) {
                        return {
                            ...subject,  // devuelve al estudiante tal como esta
                            estado_materia: !subject.estado_materia // Cambia al estado opuesto
                        }
                    }
                    return { ...subject };
                })
                setSubjects(updatedSubjects); // actualiza el estado 
            }
        } else {
            navigate('subjects/list')
        }
    }

    // Retorna el checbox de cada fila y trae el estado de la db
    const getStateCheckbox = (params) => {
        return (
            <Checkbox
                onClick={() => handleStateClick(params.row)}
                checked={params.row.estado_materia}
            />
        )
    }

    const columns = [
        { field: 'nombre_grupo', headerName: 'GROUP', width: 200 },
        { field: 'nombre_materia', headerName: 'SUBJECT', width: 200 },
        { field: 'edit', headerName: 'EDIT', width: 200, sortable: false, renderCell: getEditButton },
        { field: 'state', headerName: 'STATE', width: 200, sortable: false, renderCell: getStateCheckbox }
    ]


    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>SUBJECTS</h1>
                <Button variant='contained' color='primary' sx={{ padding: -5, marginTop: 3, marginBottom: 3 }} onClick={() => navigate("/subjects/form")}>
                    CREATE SUBJECT
                </Button>
            </Box>

            <div style={{ height: 450, width: '100%' }}>
                <DataGrid
                    rows={subjects}
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