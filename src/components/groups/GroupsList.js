import { useEffect, useState } from 'react';
import { Box, Button, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';


export default function GroupsList() {

    // HOOKS
    const [groups, setGroups] = useState([])

    const loadGroups = async () => {

        // get a endpoint de grupos para traer listado de grupos

        const response = await fetch('http://localhost:4000/groups')
        const data = await response.json()

        // Organiza la info de la respuesta para entregarla de una forma que le sirva a la tabla
        setGroups(data.map(({ grupo_id, nombre_grupo, siglas_grupo, estado_grupo }) => {
            return (
                {
                    id: grupo_id,
                    nombre_grupo,
                    siglas_grupo,
                    estado_grupo
                }
            )
        }))

    }

    // Solo se llama cuando se carga o se monta el commponente:  1) Se llamma a load students  2) load student hace la peticion 3) Organiza la informacion
    useEffect(() => {
        loadGroups()
    }, [])


    // Sirve para navegar entre rutas... react router
    const navigate = useNavigate();


    // Maneja el boton editar de la tabla, nos envia a la ruta de edidcion con el id del estudiante seleccionado
    const handleEditClick = (rowId) => {
        navigate(`/groups/form/edit/${rowId}`)
    }

    // LLeva al modo edicion
    const getEditButton = (params) => {
        return (
            <Button onClick={() => handleEditClick(params.row.id)}>edit</Button>
        )
    }

    const handleStateClick = async (row) => {

        var answer = window.confirm(`Do you really want to change the state? 
        ✅ Active
        🔲 Inactive`);

        if (answer) {

            const id = parseInt(row.id)    // convierte el string a integer
            console.log(row)
            const body = {
                grupoId: row.grupo_id,
                nombre: row.nombre_grupo,
                siglas: row.siglas_grupo,
                estado: row.estado_grupo ? false : true
            }
            const response = await fetch(`http://localhost:4000/groups/${id}`, {
                method: 'PUT',
                body: JSON.stringify(body),   // Enviamos el body para el id del estudiante que vamos a editar
                headers: { "content-type": 'application/json', 'accept': 'application/json' },
            });
            const data = await response.json()

            if (data.success) { // entra si la peticion es exitosa
                const updatedGroup = groups.map((group) => { // Solammente entra cuando la peticion es exitosa (el id de la ruta coincide con algun id de la db)
                    if (group.id === id) {
                        return {
                            ...group,  // devuelve al estudiante tal como esta
                            estado_grupo: !group.estado_grupo // Cambia al estado opuesto
                        }
                    }
                    return { ...group };
                })
                setGroups(updatedGroup); // actualiza el estado 
            }

        } else {
            navigate('/gruops/list')
        }
    }

    // Retorna el checbox de cada fila y trae el estado de la db
    const getStateCheckbox = (params) => {
        return (
            <Checkbox
                onClick={() => handleStateClick(params.row)}
                checked={params.row.estado_grupo}
            />
        )
    }


    const columns = [
        { field: 'nombre_grupo', headerName: 'GROUP', width: 200 },
        { field: 'siglas_grupo', headerName: 'ABBREVIATION', width: 200 },
        { field: 'edit', headerName: 'EDIT', width: 200, sortable: false, renderCell: getEditButton },
        { field: 'state', headerName: 'STATE', width: 200, sortable: false, renderCell: getStateCheckbox }
    ]

    // Aqui empieza el JSX
    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>GROUPS</h1>
                <Button variant='contained' color='primary' sx={{ padding: -5, marginTop: 3, marginBottom: 3 }} onClick={() => navigate("/groups/form")}>
                    CREATE GROUP
                </Button>
            </Box>


            <div style={{ height: 450, width: '100%' }}>
                <DataGrid
                    rows={groups}
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