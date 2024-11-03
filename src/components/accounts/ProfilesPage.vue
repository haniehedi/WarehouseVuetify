<template>
  <v-container>
    
    <v-data-table
      :headers="headers"
      :items="users"
      class="elevation-1"
      :loading="loading"
    >
      <template slot="items" slot-scope="{ item }">
        <tr>
          <td>{{ item.username }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.bio || 'N/A' }}</td>
          <td>{{ item.location || 'N/A' }}</td>
          <td>{{ item.birth_date || 'N/A' }}</td>
        </tr>
      </template>
    </v-data-table>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProfilesPage',
  data() {
    return {
      users: [],
      errorMessage: '',
      loading: true,
      headers: [
        { text: 'Username', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Bio', value: 'bio' },
        { text: 'Location', value: 'location' },
        { text: 'Birth Date', value: 'birth_date' },
      ],
    };
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  async mounted() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        this.users = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  margin-top: 20px;
}
</style>
