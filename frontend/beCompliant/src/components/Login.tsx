import { useEffect } from 'react';

const LoginPage = () => {
  const redirect = async () => {
    const redirectUrl = await fetch('http://localhost:8080/login', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://login.microsoftonline.com',
        credentials: 'include',
      },
    });
    return redirectUrl;
  };

  useEffect(() => {
    redirect();
  }, [redirect]);

  return (
    <div>
      <p>Redirecting to login...</p>
    </div>
  );
};

export default LoginPage;
