import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// SignUp, SignIn and NavBar
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import NavBar from './components/NavBar';
//Students
import StudentsList from './components/students/StudentsList';
import StudentForm from './components/students/StudentForm';
// Groups
import GroupsList from './components/groups/GroupsList';
import GroupForm from './components/groups/GroupForm';
// Subjects
import SubjectsList from './components/subjects/SubjectsList';
import SubjectForm from './components/subjects/SubjectForm';
// Notes
import NotesNamesList from './components/notes/NotesNamesList';
import NoteValueForm from './components/notes/NoteValueForm';
import NoteNameForm from './components/notes/NoteNameForm';
import NotesValuesList from './components/notes/NotesValuesList';

import { Container } from '@mui/material';

const PrivateRoutes = () => {
  const token = localStorage.getItem('token')

  return <>{token ? <Outlet /> : <Navigate to='/login' />}</>
}

const RestrictedRoutes = () => {
  const token = localStorage.getItem('token')

  return <>{!token ? <Outlet /> : <Navigate to='/' />}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Container>
        <Routes>
          <Route element={<RestrictedRoutes />}>
            {/* Aqui van las rutas restringidas */}
            <Route path='/register' element={<SignUp />} />
            <Route path='/login' element={<SignIn />} />
          </Route>

          <Route element={<PrivateRoutes />}>
            {/* Aqui van las rutas privadas */}
            <Route path='/' element={<GroupsList />} />
            <Route path='/students/list' element={<StudentsList />} />
            <Route exact path='/students/form' element={<StudentForm />} />
            <Route path='/students/form/edit/:id' element={<StudentForm />} />
            <Route path='/groups/list' element={<GroupsList />} />
            <Route exact path='/groups/form' element={<GroupForm />} />
            <Route path='/groups/form/edit/:id' element={<GroupForm />} />
            <Route path='/subjects/list' element={<SubjectsList />} />
            <Route exact path='/subjects/form' element={<SubjectForm />} />
            <Route path='/subjects/form/edit/:id' element={<SubjectForm />} />
            <Route path='/notes/names' element={<NotesNamesList />} />
            <Route path='/notes/values' element={<NotesValuesList />} />
            <Route path='/notes/note-name-form' element={<NoteNameForm />} />
            <Route path='/notes/note-name-form/edit/:id' element={<NoteNameForm />} />
            <Route path='/notes/note-value-form/:id' element={<NoteValueForm />} />
          </Route>
        </Routes>
        </Container>
    </BrowserRouter>
  );
}