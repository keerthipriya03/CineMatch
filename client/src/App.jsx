import {
  BrowserRouter,
  Routes,
  Route, Navigate
} from "react-router-dom";

// function Login() {
//   return <h1>Login Page</h1>;
// }

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateGroup from "./pages/CreateGroup";
import JoinGroup from "./pages/JoinGroup";
import GroupDetails from "./pages/GroupDetails";
import Preferences from "./pages/Preferences";
import Results from "./pages/Results";


function ProtectedRoute({children}){
  const token = localStorage.getItem("token");
  return token? children: <Navigate to="/" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute> 
        }/>

        <Route path="/create-group" element={
          <ProtectedRoute>
            <CreateGroup />
          </ProtectedRoute>
        } />

        <Route path="/join-group" element={
          <ProtectedRoute>
            <JoinGroup />
          </ProtectedRoute>
        } />

        <Route path="/group/:id" element={
          <ProtectedRoute>
            <GroupDetails />
          </ProtectedRoute>
        } />

        <Route path="/preferences/:id" element={
          <ProtectedRoute>
            <Preferences />
          </ProtectedRoute>
        } />

        <Route path="/results/:id" element={
          <ProtectedRoute>
            <Results />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
