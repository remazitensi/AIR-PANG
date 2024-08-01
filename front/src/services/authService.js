import axiosInstance from './axiosInstance';

const loginWithGoogle = async (token) => {
  const response = await axiosInstance.post('/api/auth/google', { token });
  return response.data;
};

export default {
  loginWithGoogle,
};
