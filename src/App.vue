<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>User Profile</v-toolbar-title>
      <v-spacer></v-spacer>
      <router-link to="/login">
        <v-btn text>Login</v-btn>
      </router-link>
      <v-btn text @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list dense>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://via.placeholder.com/100" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>

        <v-list-item-group>
          <v-list-item v-for="item in menuItems" :key="item.title" :to="item.path">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer app color="primary" dark>
      <span class="mx-auto">&copy; 2023 Your Application</span>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'; // Import axios
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      drawer: false,
      user: {
        name: '',
        email: '',
      },
      menuItems: [
        { title: 'My Profile', path: '/profile', icon: 'mdi-account' },
        { title: 'Warehouses', path: '/warehouse', icon: 'mdi-warehouse' },
        { title: 'Factors', path: '/factors', icon: 'mdi-calculator' },
        { title: 'Add User', path: '/register', icon: 'mdi-account-plus' },
        { title: 'Users', path: '/profiles', icon: 'mdi-account-group' },
        { title: 'Help', path: '/help', icon: 'mdi-help-circle' },
      ],
    };
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await axios.get('http://localhost:8000/profile/', {
          headers: {
            Authorization: `Bearer ${this.$store.getters.getToken}` 
          }
        });
        this.user.name = response.data.name; 
        this.user.email = response.data.email; 
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    },
    logout() {
      console.log("Logged out");
      this.$store.dispatch('clearToken');
      this.$router.push('/login');
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.fetchUserProfile(); 
    }
  }
};
</script>

<style scoped>
</style>
