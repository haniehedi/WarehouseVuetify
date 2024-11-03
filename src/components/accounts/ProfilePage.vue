<template>
  <div class="profile-container">
    <h2>User Profile</h2>
    <div v-if="profile" class="profile-details">
      <img v-if="profile.profile_picture" :src="profile.profile_picture" alt="Profile Picture" class="profile-picture" />
      <h3>{{ profile.username }}</h3>
      <p>Email: {{ profile.email }}</p>
      <p v-if="profile.bio">Bio: {{ profile.bio }}</p>
      <p v-if="profile.location">Location: {{ profile.location }}</p>
      <p v-if="profile.birth_date">Birth Date: {{ profile.birth_date }}</p>
      <p>Role: {{ profile.role }}</p>
      <v-btn @click="openEditModal" color="primary">Edit Profile</v-btn>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>

    <v-dialog v-model="isEditModalOpen" max-width="600px">
      <v-card>
        <v-card-title>
          <span>Edit Profile</span>
          <v-spacer></v-spacer>
          <v-btn @click="closeEditModal" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="editProfileForm" v-model="valid" lazy-validation>
            <v-text-field
              v-model="editProfile.username"
              label="Username"
              required
            ></v-text-field>
            <v-text-field
              v-model="editProfile.email"
              label="Email"
              required
            ></v-text-field>
            <v-textarea
              v-model="editProfile.bio"
              label="Bio"
            ></v-textarea>
            <v-text-field
              v-model="editProfile.location"
              label="Location"
            ></v-text-field>
            <v-text-field
              v-model="editProfile.birth_date"
              label="Birth Date"
              type="date"
            ></v-text-field>
            <v-btn @click="updateProfile" color="primary" :disabled="!valid">Save Changes</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProfileComponent',
  data() {
    return {
      profile: null,
      editProfile: {
        username: '',
        email: '',
        bio: '',
        location: '',
        birth_date: '',
      },
      isEditModalOpen: false,
      errorMessage: '',
      valid: false,
    };
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  async mounted() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/profile/?view=self', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        this.profile = await response.json();
        // Initialize editProfile with fetched data
        this.editProfile = { ...this.profile };
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    openEditModal() {
      this.isEditModalOpen = true; // Open the edit modal
      this.editProfile = { ...this.profile }; // Pre-fill form with existing profile data
    },
    async updateProfile() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/profile/?view=self', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.editProfile),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        // Update the local profile with the latest data
        this.profile = await response.json();
        this.closeEditModal(); // Close the edit modal
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    closeEditModal() {
      this.isEditModalOpen = false; // Close the edit modal
    },
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.profile-details {
  margin-top: 20px;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style>
