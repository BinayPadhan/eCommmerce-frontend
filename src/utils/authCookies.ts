// utils/authCookies.ts
import Cookies from 'js-cookie'

export const setToken = (token: string) => {
  Cookies.set('token', token, { expires: 7 }); // expires in 7 days
};

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const removeToken = () => {
  Cookies.remove('token');
};
