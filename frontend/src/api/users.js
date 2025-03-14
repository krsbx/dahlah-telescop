import axios from "../utils/axios";
import store from "../store/users";
import authStore from "../store/auth";

export const createUser = async (payload) => {
  const { data } = await axios.post("/users", payload);

  const user = data.data;

  store.getState().addUser(user);

  return user;
};

export const updateUser = async (userId, payload) => {
  const { data } = await axios.patch(`/users/${userId}`, payload);

  const user = data.data;

  if(userId === authStore.getState().auth?.userId){
    authStore.getState().setAuth(user)
  }
  store.getState().updateUser(userId, user);

  return user;
};

export const listUser = async (query) => {
  const { data } = await axios.get("/users", {
    params: query,
  });

  const users = data.data;

  store.getState().setUsers(users);

  return users;
};

export const findUser = async (userId) => {
  const { data } = await axios.get(`/users/${userId}`);

  const user = data.data;

  store.getState().updateUser(userId, user);

  return user;
};

export const deleteUser = async (userId) => {
  await axios.delete(`/users/${userId}`);

  store.getState().deleteUser(userId);
};

export const updateUserPassword = async (userId, payload) => {
  if (!payload.confirmPassword) {
    payload.confirmPassword = payload.password;
  }

  await axios.post(`/users/${userId}/change-password`, payload);
}
