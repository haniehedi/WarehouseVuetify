<template>
  <v-container class="warehouse-container" max-width="600">
    <v-card>
      <v-card-title>
        <h2>🏢 Warehouses</h2>
      </v-card-title>
      <v-card-subtitle>Select a warehouse to view its items!</v-card-subtitle>
      
      <!-- Form to Add New Warehouse -->
      <v-form @submit.prevent="addWarehouse" class="add-warehouse-form">
        <v-text-field
          v-model="newWarehouseName"
          label="New Warehouse Name"
          outlined
          required
        ></v-text-field>
        <v-btn color="primary" @click="addWarehouse" class="ml-2">Add Warehouse</v-btn>
      </v-form>

      <!-- Warehouse List -->
      <v-list dense>
        <v-list-item
          v-for="warehouse in warehouses"
          :key="warehouse.id"
          class="warehouse-item"
        >
          <v-list-item-content @click="toggleWares(warehouse.id)">
            <v-list-item-title>{{ warehouse.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn small text color="primary" @click="openAddWareModal(warehouse.id)">Add Ware</v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>

      <!-- Display Selected Warehouse's Wares -->
      <div v-if="selectedWarehouse">
        <h3>📦 Items in {{ selectedWarehouse.name }}</h3>
        <v-list dense>
          <v-list-item v-for="ware in selectedWarehouse.wares" :key="ware.id" class="ware-item">
            <v-list-item-content>
              <v-list-item-title>{{ ware.name }}</v-list-item-title>
              <v-list-item-subtitle>Cost Method: <strong>{{ ware.cost_method }}</strong></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <v-alert v-if="errorMessage" type="error" dismissible>{{ errorMessage }}</v-alert>

      <!-- Modal for Adding Ware -->
      <v-dialog v-model="isModalOpen" max-width="500">
        <v-card>
          <v-card-title>Add New Ware</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="addWare">
              <v-text-field v-model="newWareName" label="Ware Name" required></v-text-field>
              <v-text-field v-model="newWareCostMethod" label="Cost Method" required></v-text-field>
              <v-text-field v-model="price" label="Price" type="number" required></v-text-field>
              <v-text-field v-model="stock" label="Stock" type="number" required></v-text-field>
              <v-text-field v-model="description" label="Description" required></v-text-field>
              <v-card-actions>
                <v-btn color="primary" type="submit">Add Ware</v-btn>
                <v-btn text @click="closeAddWareModal">Cancel</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'WarehousePage',
  data() {
    return {
      warehouses: [],
      selectedWarehouse: null,
      errorMessage: '',
      newWarehouseName: '',
      isModalOpen: false,
      newWareName: '',
      newWareCostMethod: '',
      currentWarehouseId: null,
      price: '',
      stock: '',
      description: '',
    };
  },
  computed: {
    ...mapGetters(['getToken', 'getUserId']),
  },
  async mounted() {
    await this.fetchWarehouses();
  },
  methods: {
    async fetchWarehouses() {
      try {
        const token = this.getToken;
        const warehouseResponse = await fetch('http://localhost:8000/warehouses/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!warehouseResponse.ok) {
          throw new Error(`Error ${warehouseResponse.status}: ${warehouseResponse.statusText}`);
        }

        this.warehouses = await warehouseResponse.json();
      } catch (error) {
        this.errorMessage = error.message;
        console.error('Error fetching data:', error);
      }
    },
    async addWarehouse() {
      const token = this.getToken;

      try {
        const response = await fetch('http://localhost:8000/warehouses/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name: this.newWarehouseName }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add warehouse');
        }

        this.newWarehouseName = '';
        await this.fetchWarehouses();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    toggleWares(warehouseId) {
      const warehouse = this.warehouses.find(w => w.id === warehouseId);
      this.selectedWarehouse = this.selectedWarehouse === warehouse ? null : warehouse;
    },
    openAddWareModal(warehouseId) {
      this.currentWarehouseId = warehouseId;
      this.isModalOpen = true;
    },
    closeAddWareModal() {
      this.isModalOpen = false;
      this.newWareName = '';
      this.newWareCostMethod = '';
      this.price = '';
      this.stock = '';
      this.description = '';
    },
    async addWare() {
      const token = this.getToken;
      const userId = this.getUserId;

      try {
        const response = await fetch('http://localhost:8000/wares/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: this.newWareName,
            user_created: userId,
            warehouse: this.currentWarehouseId,
            cost_method: this.newWareCostMethod,
            price: parseFloat(this.price),
            stock: parseInt(this.stock, 10),
            description: this.description,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to add ware');
        }

        this.closeAddWareModal();
        await this.fetchWarehouses(); 
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
};
</script>

<style scoped>
.warehouse-container {
  padding: 20px;
}
.add-warehouse-form {
  display: flex;
  align-items: center;
  gap: 10px;
}
.warehouse-item:hover {
  background-color: #e0f7fa;
}
</style>
