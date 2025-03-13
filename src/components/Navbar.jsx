import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { FaFilm, FaTv, FaHeart, FaClock, FaEye, FaCog } from 'react-icons/fa';

export default function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start w-1/4">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Home
        </Link>
      </div>
      
      <div className="navbar-center w-2/4 flex justify-center gap-4">
        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost m-1">
            <FaFilm className="mr-2" />
            Top Películas
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/top-movies/week">Esta Semana</Link></li>
            <li><Link to="/top-movies/year">Este Año</Link></li>
            <li><Link to="/top-movies/all">De la Historia</Link></li>
          </ul>
        </div>

        <div className="dropdown dropdown-hover">
          <label tabIndex={0} className="btn btn-ghost m-1">
            <FaTv className="mr-2" />
            Top Series
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/top-series/week">Esta Semana</Link></li>
            <li><Link to="/top-series/year">Este Año</Link></li>
            <li><Link to="/top-series/all">De la Historia</Link></li>
          </ul>
        </div>

        {isLoggedIn && (
          <div className="dropdown dropdown-hover">
            <label tabIndex={0} className="btn btn-ghost m-1">
              <FaHeart className="mr-2" />
              Mi Cuenta
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link to="/likes" className="flex items-center">
                  <FaHeart className="mr-2" />
                  Favoritos
                </Link>
              </li>
              <li>
                <Link to="/pending" className="flex items-center">
                  <FaClock className="mr-2" />
                  Pendientes
                </Link>
              </li>
              <li>
                <Link to="/viewed" className="flex items-center">
                  <FaEye className="mr-2" />
                  Vistos
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center">
                  <FaCog className="mr-2" />
                  Ajustes
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="navbar-end w-1/4">
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
            <span className="text-base-content ml-2">{user && user.name}</span>
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