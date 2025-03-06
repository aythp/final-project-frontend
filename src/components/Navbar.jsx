import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";

export default function Navbar() {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl ">
          Home
        </Link>
      </div>
      <div className="flex-none">
        {isLoggedIn && (
          <>
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://picsum.photos/id/402/200/300" alt="profile" />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={logOutUser}>Logout</button>
                </li>
              </ul>
            </div>
            <span className="ml-4">{user && user.name}</span>
          </>
        )}

        {!isLoggedIn && (
          <div className="flex gap-2">
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}