<template>
  <div class="auth-card">
    <form @submit.prevent="onSubmit">
      <h2 class="auth-card__title">Войти</h2>
      <div>
        <input class="auth-card__input" v-model="username" type="email" placeholder="Логин" />
        <div class="auth-card__aller">{{ usernameError }}</div>
      </div>
      <div>
        <input class="auth-card__input" v-model="password" type="password" placeholder="Пароль" />
        <div class="auth-card__aller"> {{ passwordError }}</div>
      </div>
      <div class="auth-card__aller">{{ nonFieldErrors }}</div>
      <button class="auth-card__button">
      <span v-if="isLoade === true">Войти</span>
      <div v-else class="auth-card__spinner"></div>
      </button>
    </form>
  </div>

</template>

<script>
import axios from "axios"

export default {
  name: 'login',
  components: {
   
},
  data() {
    return {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
      nonFieldErrors: '',
      error: '',
      isLoade: true
    }
  },
  methods: {
    async onSubmit() {
        this.usernameError = '',
        this.passwordError = '',
        this.nonFieldErrors = '',
        this.error = '',
        this.isLoade = false
      axios.post('https://my.shtab.app/api/users/user/login/', {
        username: this.username,
        password: this.password,
      }).then(res => (
        localStorage.setItem('token', res.data.token),
        this.$store.commit('setUsername', res.data.user.username),
        res.data.token.length > 3 ? (this.$store.commit('setLogine', true), this.$router.push('/user')) : null
      )).catch(error => {
        !error.response.status ? this.nonFieldErrors = "Проверьте подключение к интернету" : null
        this.error = JSON.parse(error.response.request.responseText);
        if (error.response.status) {
          if (error.response.status == 429) {
            this.error.non_field_errors = ['Превышено количество попыток, подождите 20 секунд']
          } if (error.response.status.toString()[0] == 5) {
            this.error.non_field_errors = ['Сервер не отвечает, попробуйте позже']
          } if (error.response.status == 404) {
            this.error.non_field_errors = ['Что-то пошло не так - ошибка 404']
          } if (this.error.username) {
            this.usernameError = JSON.stringify(this.error.username).replace(/^..|..$/g, "")
          } if (this.error.password) {
            this.passwordError = JSON.stringify(this.error.password).replace(/^..|..$/g, "")
          } if (this.error.non_field_errors) {
            this.nonFieldErrors = JSON.stringify(this.error.non_field_errors).replace(/^..|..$/g, "")
          }
        }
      }).finally(() => {
        this.isLoade = true
      });
    }
  }
}
</script>
<style>
.auth-card {
  max-width: 450px;
  margin: auto;
  margin-top: 10vh;
  padding: 30px;
  border-radius: 10px;
  border: solid rgb(219, 217, 217) 1px;
  background-color: rgb(250, 250, 250);
}

.auth-card__title {
  font-size: 2rem;
}

.auth-card__input {
  width: 90%;
  height: 22px;
  margin: 23px 0px;
  font-size: 1rem;
  text-indent: 0px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgb(193, 195, 205);
  cursor: pointer;
  transition: border 0.3s linear;

}

.auth-card__input:active,
:hover,
:focus {
  outline: 0;
  outline-offset: 0;
}

.auth-card__input:focus {
  border-color: #5e79ec;
}

.auth-card__input:hover::-webkit-input-placeholder {
  color: transparent;
  transition: 0.2s linear;
}

:-moz-placeholder {
  color: transparent;
  transition: 0.2s linear;
}

::-moz-placeholder {
  color: transparent;
  transition: 0.2s linear;
}

:-ms-input-placeholder {
  color: transparent;
  transition: 0.2s linear;
}

.auth-card__button {
  height: 46px;
  width: 70%;
  border: none;
  border-radius: 5px;
  background-color: #5e79ec;
  margin-bottom: 15px;
  color: azure;
  font-size: 1.2rem;

}

.auth-card__button:hover {
  background-color: #4864df;
  transition: 0.2s linear;
}

.auth-card__button:active {
  background-color: #8a8d99;
  border: #4f505228 solid 3px;
}

.auth-card__aller {
  position: relative;
  bottom: 20px;
  height: 1rem;
  font-size: 0.9rem;
  color: tomato;
}
@keyframes donut-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.auth-card__spinner {
  display: inline-block;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #b4b4b4;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: donut-spin 1.2s linear infinite;
}

</style>