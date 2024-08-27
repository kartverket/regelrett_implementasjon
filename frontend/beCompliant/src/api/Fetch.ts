import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Generic fetch function to be used as queryFn and mutationFn in TanStack Query
 * @param {Object} options - The options object for the Axios request
 * @param {string} options.url - The URL for the request
 * @param {string} [options.method='get'] - The HTTP method (get, post, put, delete, etc.)
 * @param {Object} [options.data] - The data to be sent as the request body
 * @param {Object} [options.params] - The URL parameters to be sent with the request
 * @param {Object} [options.withCredentials] - Include credentials (cookies) with the request
 * @returns {Promise} - A promise that resolves to the response data
 */
export const axiosFetch = async <T>({
  url,
  method = 'GET',
  data,
  params,
  withCredentials = true,
  ...rest
}: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  try {
    return await axios({
      url,
      method,
      data,
      params,
      withCredentials,
      ...rest,
    });
  } catch (error) {
    const axiosError = error as AxiosError<T>;
    console.error(axiosError);
    throw axiosError;
  }
};
