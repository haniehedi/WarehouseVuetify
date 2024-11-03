<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6" lg="4"> <!-- Adjust column sizes here -->
        <v-card>
          <v-card-title class="text-h5">Register</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                type="password"
                required
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :rules="confirmPasswordRules"
                label="Confirm Password"
                type="password"
                required
              ></v-text-field>

              <v-select
                v-model="role"
                :items="roles"
                label="Role"
                required
                :rules="roleRules"
              ></v-select>

              <v-btn
                :disabled="!valid"
                @click="register"
                color="primary"
                class="mt-4"
              >
                Register
              </v-btn>

              <v-btn
                @click="$router.push('/login')"
                color="secondary"
                class="mt-2"
              >
                Go to Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      roles: ['admin', 'user', 'staff'],
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => (v && v.length <= 20) || 'Username must be less than 20 characters',
      ],
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 2) || 'Password must be at least 2 characters',
      ],
      confirmPasswordRules: [
        (v) => !!v || 'Confirm Password is required',
        (v) => v === this.password || 'Passwords do not match',
      ],
      roleRules: [
        (v) => !!v || 'Role is required',
      ],
    };
  },
  methods: {
    register() {
      if (this.$refs.form.validate()) {
        const registrationData = {
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role, 
        };
        console.log('Registering user...', registrationData);

        // Clear form after submission
        this.clearForm();
      }
    },
    clearForm() {
      this.username = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
      this.role = ''; 
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped>
.v-card {
  padding: 20px; 
  max-width: 400px; 
  margin: 0 auto; 
}
</style>
