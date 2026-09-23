import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  
  // If not authenticated, the layout will redirect to /login
  // If authenticated, we just want to go to /home
  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }
  
  return null;
}
