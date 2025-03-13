import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { FaFilm, FaTv, FaHeart, FaEye, FaCog, FaUser, FaList, FaSignOutAlt, FaRandom, FaGlobe } from 'react-icons/fa';
import { BsBookmarkFill } from 'react-icons/bs';

export default function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start w-1/4">
        <Link to="/" className="btn btn-ghost normal-case text-xl flex items-center">
          <img src="/icon-app-final.png" alt="Watchery Logo" className="h-10 w-10 mr-2 hover:rotate-12 transition-transform duration-300" />
          <div className="flex flex-col items-start">
            <div className="flex">
              <span className="font-bold text-2xl">Watch</span>
              <span className="font-light text-2xl">ery</span>
            </div>
          </div>
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
              <FaList className="mr-2" />
              Mis Listas
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
                  <BsBookmarkFill className="mr-2" />
                  Pendientes
                </Link>
              </li>
              <li>
                <Link to="/viewed" className="flex items-center">
                  <FaEye className="mr-2" />
                  Vistos
                </Link>
              </li>
            </ul>
          </div>
        )}

        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <Link to="/feed" className="btn btn-ghost btn-circle">
              <FaGlobe className="text-xl" />
            </Link>

            <Link to="/random" className="btn btn-ghost btn-circle">
              <FaRandom className="text-xl" />
            </Link>
          </div>
        )}
      </div>

      <div className="navbar-end w-1/4">
        {isLoggedIn && (
          <div className="flex items-center gap-3">
            <Link to="/profile" className="btn btn-ghost btn-circle">
              <FaUser className="text-xl" />
            </Link>
            <Link to="/settings" className="btn btn-ghost btn-circle">
              <FaCog className="text-xl" />
            </Link>
            <button onClick={logOutUser} className="btn btn-ghost btn-circle text-red-500 hover:bg-red-100">
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
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