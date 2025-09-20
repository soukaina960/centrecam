
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login'); // Rediriger vers la page de login si non authentifié
  }

  return token;
};
