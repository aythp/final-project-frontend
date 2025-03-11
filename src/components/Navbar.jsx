import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { FaFilm, FaTv } from 'react-icons/fa';

export default function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
        
        {isLoggedIn && (
          <div className="flex ml-4 space-x-4">
            <Link to="/top-movies" className="btn btn-ghost btn-sm normal-case">
              <FaFilm className="mr-2" />
              Top Películas
            </Link>
            <Link to="/top-series" className="btn btn-ghost btn-sm normal-case">
              <FaTv className="mr-2" />
              Top Series
            </Link>
          </div>
        )}
      </div>

      <div className="flex-none gap-2">
        {isLoggedIn && (
          <>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img 
                    src={user.profileImage || "https://picsum.photos/id/402/200/300"} 
                    alt="profile" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/profile" className="justify-between">
                    Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/settings">
                    Ajustes
                  </Link>
                </li>
                <li>
                  <button onClick={logOutUser}>Cerrar Sesión</button>
                </li>
              </ul>
            </div>
            <span className="text-base-content">{user && user.name}</span>
          </>
        )}

        {!isLoggedIn && (
          <div className="flex gap-2">
            <Link to="/signup" className="btn btn-primary">
              Registrarse
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Iniciar Sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}