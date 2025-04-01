import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth.service";
import Carousel from '../components/Carousel';

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleName = (e) => setName(e.target.value);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const requestBody = { email, password, name };

    authService
      .signup(requestBody)
      .then((response) => {
        navigate("/login");
      })
      .catch((error) => {
        const errorDescription = error.response.data.message;
        setErrorMessage(errorDescription);
      });
  };

  return (
    <div className="relative bg-base-200" style={{ height: 'calc(100vh - 100px)' }}>
      <div className="absolute inset-0 w-full h-full">
        <Carousel />
      </div>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
      
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
        <div className="card w-full max-w-md bg-base-100/20 backdrop-blur-md rounded-xl shadow-2xl">
          <div className="card-body p-8">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/icon-app-final.png" 
                alt="Watchery Logo" 
                className="h-16 w-16 mb-4"
              />
              <h1 className="text-3xl font-bold text-white">Crear Cuenta</h1>
              <div className="h-1 w-20 bg-primary mt-2 rounded-full"></div>
            </div>
            
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="form-control">
                <label className="block text-white text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Introduce tu nombre"
                  className="input input-bordered bg-base-100/30 text-white w-full placeholder-white/70"
                  value={name}
                  onChange={handleName}
                />
              </div>
              
              <div className="form-control">
                <label className="block text-white text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Introduce tu email"
                  className="input input-bordered bg-base-100/30 text-white w-full placeholder-white/70"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              
              <div className="form-control">
                <label className="block text-white text-sm font-medium mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Introduce tu contraseña"
                  className="input input-bordered bg-base-100/30 text-white w-full placeholder-white/70"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              
              <div className="form-control mt-8">
                <button type="submit" className="btn btn-primary w-full">
                  Registrarse
                </button>
              </div>
            </form>
            
            {errorMessage && (
              <div className="alert alert-error mt-6">
                <span>{errorMessage}</span>
              </div>
            )}
            
            <p className="mt-6 text-center text-white">
              ¿Ya tienes una cuenta?{" "}
              <Link to={"/login"} className="link link-primary font-bold">
                Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}