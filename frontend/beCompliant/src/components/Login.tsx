import {useEffect} from 'react';

const LoginPage = () => {
  const redirect = async () => {
    return await fetch('http://localhost:8080/login', {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "*",
      },
      credentials: 'include',
    });
  };

  useEffect(() => {
    window.location.href = "http://localhost:8080/login";
  }, []);

  return (
    <div>
      <p>Redirecting to login...</p>
    </div>
  );
};

export default LoginPage;
