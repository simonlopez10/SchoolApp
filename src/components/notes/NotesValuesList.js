import { useState, useEffect } from "react";
import { Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';


export default function NotesList() {


    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    const loadNotes = async () => {

        // get a endpoint de grupos para traer listado de grupos

        const response = await fetch('http://localhost:4000/note/values')
        const data = await response.json()
        console.log(data)
        // Organiza la info de la respuesta para entregarla de una forma que le sirva a la tabla
        setNotes(data.map(({ nota_id, nombre_nota, nombre_materia, siglas_grupo, nombre_grupo, materia_id, grupo_id, nombre_est, valor_nota, apellido_est }) => {
            return (
                {
                    id: nota_id,
                    grupo_id,
                    nombre_nota,
                    nombre_grupo,
                    siglas_grupo,
                    nombre_materia,
                    materia_id,
                    nombre_est,
                    apellido_est,
                    valor_nota
                }
            )
        }))
    }

    useEffect(() => {
        loadNotes()
    }, [])


    const columns = [
        { field: 'nombre_est', headerName: 'STUDENT NAME', width: 200 },
        { field: 'apellido_est', headerName: 'STUDENT LASTNAME', width: 200 },
        { field: 'nombre_materia', headerName: 'SUBJECT', width: 200 },
        { field: 'nombre_nota', headerName: 'NOTE NAME', width: 200 },
        { field: 'valor_nota', headerName: 'NOTE VALUE', width: 200 }
    ]

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <h1>NOTES VALUES</h1>
                <Button variant='contained' color='primary' sx={{ padding: -5, marginTop: 3, marginBottom: 3 }} onClick={() => navigate("/notes/add")}>
                    CREATE NOTE VALUE
                </Button>
            </Box>


            <div style={{ height: 450, width: '100%' }}>
                <DataGrid
                    rows={notes}
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