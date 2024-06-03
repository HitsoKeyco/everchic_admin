import { Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import Header from "./shared/Header";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import LoginPage from "./page/LoginPage";

function App() {
  const isLogin = useSelector(state => state.user);

  return (
    <div className="app">
      {
        isLogin && <Header />
      }
      <Routes>        
        {
          isLogin
            ? <Route path="/*" element={<ProtectedRoutes />} />
            : <Route path="login" element={<LoginPage />} />
        }
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </div>
  );
}

export default App;
