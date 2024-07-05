const useBackendUrl = (path?: string) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const isProd = import.meta.env.PROD;

  if (isProd) {
    if (backendUrl) {
      return [backendUrl, path].join('');
    } else {
      console.error('Backend URL not found :(');
    }
  }

  return ['http://localhost:8080', path].join('');
};

export default useBackendUrl;
