<template>
  <v-app>
    <!-- AppBar -->
    <v-app-bar color="primary" density="comfortable">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title>Daily Expense Tracker</v-app-bar-title>

    </v-app-bar>

    <!-- Optional NavigationDrawer (hidden on desktop) -->
    <v-navigation-drawer color="primary" v-model="drawer" temporary location="left">
      <v-list nav>
        <v-list-item prepend-icon="mdi-home" title="Home" to="/" />
        <v-list-item prepend-icon="mdi-chart-bar" title="Reports" to="/reports" />
        <v-list-item prepend-icon="mdi-cog" title="Settings" to="/settings" />
      </v-list>
    </v-navigation-drawer>

    <!-- Main content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
const drawer = ref(false)
</script>