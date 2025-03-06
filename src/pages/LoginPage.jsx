import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import authService from "../services/auth.service";
import Carousel from '../components/Carousel'

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password };

    // Send a request to the server using axios
    /* 
    axios.post(`${process.env.REACT_APP_SERVER_URL}/auth/login`)
      .then((response) => {})
    */

    // Or using a service
    authService
      .login(requestBody)
      .then((response) => {
        // If the POST request is successful store the authentication token,
        // after the token is stored authenticate the user
        // and at last navigate to the home page
        storeToken(response.data.authToken);
        authenticateUser();
        navigate("/profile");
      })
      .catch((error) => {
        // If the request resolves with an error, set the error message in the state
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 4rem)' }}> {/* Misma altura que el Carousel */}
      <Carousel /> {/* Carousel como fondo */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div> {/* Capa de Glassmorphism */}
      <div className="absolute inset-0 flex items-center justify-center"> {/* Centra el contenido */}
        <div className="card w-full max-w-md bg-white/20 backdrop-blur-md rounded-xl shadow-xl"> {/* Aplica Glassmorphism al card */}
          <div className="card-body">
            <h1 className="card-title text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>
            {errorMessage && (
              <div className="alert alert-error mt-4">
                <span>{errorMessage}</span>
              </div>
            )}
            <p className="mt-4 text-center">
              Don't have an account yet?{" "}
              <Link to={"/signup"} className="link link-primary">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}