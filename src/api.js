const params = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};

const URL = 'http://localhost:3333/api';

const getAllUsers = () => {
  return fetch(`${URL}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.error('Ocorreu um erro', err);
    });
};

const getUserByCPF = (cpf) => {
  return fetch(`${URL}/${cpf}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.error('Ocorreu um erro', err);
    });
};

const api = {
  getAllUsers,
  getUserByCPF,
};

export default api;
