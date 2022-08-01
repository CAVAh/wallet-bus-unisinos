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

const getUserByDocument = (document) => {
  return fetch(`${URL}/${document}`, params)
    .then((res) => res.json())
    .catch((err) => {
      console.error('Ocorreu um erro', err);
    });
};

const api = {
  getAllUsers,
  getUserByDocument,
};

export default api;
