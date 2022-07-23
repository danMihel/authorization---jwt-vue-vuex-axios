import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    logied: false,
    getProfile: false,
    userName: "",
    firstName: "",
    lastName: "",
    error: "",
   
  },
  getters: {},
  mutations: {
    setError(state, str) {
      state.error = str;
    },
    logine(state, bool) {
      state.logied = bool;
    },
    setProfile(state, bool) {
      state.getProfile = bool;
    },
    setUsername(state, str) {
      state.userName = str;
    },
    setFirstName(state, str) {
      state.firstName = str;
    },
    setLastName(state, str) {
      state.lastName = str;
    },
  },
  actions: {
    async getUser({ commit }) {
      axios
        .get("https://my.shtab.app/api/users/profile/", {
          headers: {
            authorization: `Token ${localStorage.getItem("token")}`,
          },
        })
        .then(
          (res) => (
            commit("setError", ""),
            commit("setFirstName", res.data.first_name),
            commit("setLastName", res.data.last_name),
            commit("setProfile", true)
          )
        )
        .catch(error => {
          commit("setProfile", false)
          !error.response.status ? commit("setError", "Проверьте подключение к интернету") :
          error.response.status  == 404 ? commit("setError", "Ой - ошибка 404") :
          (error.response.status + '')[0] == 5 ? commit("setError", "Сервер сеичас недоступен, но скоро мы все починим") :
          null
        })
    },
  },
  modules: {},
});
