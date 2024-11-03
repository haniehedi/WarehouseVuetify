import Vue from 'vue';
import Router from 'vue-router';
import WarehousePage from '@/components/Warehouses/WarehousePage.vue';
import FactorPage from '@/components/Factors/FactorPage.vue';
import ProfilePage from '@/components/accounts/ProfilePage.vue';
import ProfilesPage from '@/components/accounts/ProfilesPage.vue';
import RegisterPage from '@/components/accounts/RegisterPage.vue';
import LoginPage from '@/components/accounts/LoginPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history', 
  routes: [
    {path: '/login', name: 'LoginPage', component: LoginPage},
    {path: '/register', name: 'RegisterPage', component: RegisterPage},
    {path: '/warehouse', name: 'WarehousePage', component: WarehousePage},
    {path: '/factors', name: 'FactorPage', component: FactorPage}, 
    {path: '/profile', name: 'ProfilePage', component: ProfilePage},
    {path: '/profiles', name: 'ProfilesPage', component: ProfilesPage}
  ]
});
