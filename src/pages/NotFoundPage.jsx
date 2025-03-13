import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center">
      <div className="w-[500px] h-[400px] bg-base-100 shadow-lg rounded-lg p-8 text-center">
        <FaExclamationTriangle className="text-6xl text-warning mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Página no encontrada</h2>
        <p className="mb-8 text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="flex justify-center">
          <Link to="/" className="btn btn-primary">
            <FaHome className="mr-2" /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
