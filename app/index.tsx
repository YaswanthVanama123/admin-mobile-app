import { Redirect } from 'expo-router';

export default function Index() {
  // Check if user is authenticated
  // For now, redirect to login
  return <Redirect href="/login" />;
}
