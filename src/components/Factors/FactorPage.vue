<template>
  <v-container max-width="600">
    <v-card class="factor-container" outlined>
      <v-card-title>
        <h2>📊 Factors</h2>
      </v-card-title>
      
      <v-card-text>
        <v-form @submit.prevent="addFactor" v-model="valid" class="add-factor-form">
          <v-select
            v-model="selectedWare"
            :items="wares"
            item-text="name"
            item-value="id"
            label="Select Ware"
            outlined
            required
          ></v-select>

          <v-text-field
            v-model="quantity"
            label="Quantity"
            type="number"
            outlined
            required
          ></v-text-field>

          <v-text-field
            v-model="purchasePrice"
            label="Purchase Price"
            type="number"
            outlined
            required
          ></v-text-field>

          <v-select
            v-model="type"
            :items="['input', 'output']"
            label="Select Type"
            outlined
            required
          ></v-select>

          <v-btn type="submit" color="primary" :disabled="!valid" block>Add Factor</v-btn>
        </v-form>

        <v-alert v-if="errorMessage" type="error" class="mt-3" dense outlined>{{ errorMessage }}</v-alert>

        <v-data-table
          :headers="headers"
          :items="factors"
          class="elevation-1"
          :loading="loading"
        >
          <template v-slot:item="{ item }">
            <td>{{ getWareName(item.ware) }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.purchase_price }}</td>
            <td>
              <v-btn icon @click="openEditFactorModal(item)">
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteFactor(item.id)">
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </td>
          </template>
        </v-data-table>

        <!-- Edit Factor Modal -->
        <v-dialog v-model="isEditModalOpen" max-width="400">
          <v-card>
            <v-card-title>Edit Factor</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="updateFactor" v-model="editValid">
                <v-select
                  v-model="editFactor.ware"
                  :items="wares"
                  item-text="name"
                  item-value="id"
                  label="Select Ware"
                  outlined
                  required
                ></v-select>

                <v-text-field
                  v-model="editFactor.quantity"
                  label="Quantity"
                  type="number"
                  outlined
                  required
                ></v-text-field>

                <v-text-field
                  v-model="editFactor.purchase_price"
                  label="Purchase Price"
                  type="number"
                  outlined
                  required
                ></v-text-field>

                <v-select
                  v-model="editFactor.type"
                  :items="['input', 'output']"
                  label="Select Type"
                  outlined
                  required
                ></v-select>

                <v-card-actions>
                  <v-btn color="primary" :disabled="!editValid" @click="updateFactor">Update Factor</v-btn>
                  <v-btn text @click="closeEditFactorModal">Cancel</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'FactorComponent',
  data() {
    return {
      factors: [],
      wares: [],
      selectedWare: '',
      quantity: '',
      purchasePrice: '',
      type: '',
      isEditModalOpen: false,
      editFactor: {},
      errorMessage: '',
      valid: true,
      editValid: true,           
      headers: [
        { text: 'Type', value: 'type' },
        { text: 'Ware', value: 'ware' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Price', value: 'purchase_price' },
        { text: 'Actions', value: 'actions' }
      ],
    };
  },
  computed: {
    ...mapGetters(['getToken']),
  },
  async mounted() {
    await this.fetchFactors();
    await this.fetchWares();
  },
  methods: {
    async fetchFactors() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/factors/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch factors');
        this.factors = await response.json();
        console.log('Fetched Factors:', this.factors); // Log fetched factors
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async fetchWares() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/wares/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch wares');
        this.wares = await response.json();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    getWareName(wareId) {
      const ware = this.wares.find(w => w.id === wareId);
      return ware ? ware.name : 'Unknown Ware';
    },
    async addFactor() {
      const token = this.getToken;
      try {
        const response = await fetch('http://localhost:8000/factors/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            ware: this.selectedWare,
            quantity: this.quantity,
            purchase_price: this.purchasePrice,
            type: this.type,
          }),
        });
        if (!response.ok) throw new Error('Failed to add factor');
        await this.fetchFactors();
        this.resetForm();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    openEditFactorModal(factor) {
      this.editFactor = { ...factor };
      this.isEditModalOpen = true;
    },
    async updateFactor() {
      const token = this.getToken;
      try {
        const response = await fetch(`http://localhost:8000/factors/${this.editFactor.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(this.editFactor),
        });
        if (!response.ok) throw new Error('Failed to update factor');
        await this.fetchFactors();
        this.closeEditFactorModal();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async deleteFactor(id) {
      const token = this.getToken;
      try {
        const response = await fetch(`http://localhost:8000/factors/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to delete factor');
        await this.fetchFactors();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    closeEditFactorModal() {
      this.isEditModalOpen = false;
      this.editFactor = {};
    },
  },
};
</script>
