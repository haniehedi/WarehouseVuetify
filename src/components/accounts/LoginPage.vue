<template>
  <v-container class="login-form" max-width="350"> <!-- Reduced max-width -->
    <v-card outlined>
      <v-card-title class="text-h5">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login" v-model="valid">
          <v-text-field
            v-model="username"
            label="Username"           
            required
            :rules="[usernameRules]"
            prepend-icon="mdi-account"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            type="password"           
            required
            :rules="[passwordRules]"
            prepend-icon="mdi-lock"
          ></v-text-field>
          <v-btn color="primary" :disabled="!valid" @click="login" block>Login</v-btn>
          <v-alert v-if="message" type="error" class="mt-3" dense outlined>{{ message }}</v-alert>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      username: '',
      password: '',
      message: '',
      valid: true,
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length <= 20) || 'Username must be less than 20 characters',
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 2) || 'Password must be at least 2 characters',
      ],
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:8000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed!');
        }

        const data = await response.json();
        this.$store.dispatch('saveToken', data.access);
        this.$router.push({ name: 'WarehousePage' });
      } catch (error) {
        this.message = error.message;
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  margin-top: 100px;
  width: 40%; 
}

.v-alert {
  margin-top: 10px;
}
</style>
