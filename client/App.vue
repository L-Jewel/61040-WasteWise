<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <v-btn id="menu-activator">
        <img src="/client/assets/images/menu.svg" />
      </v-btn>
      <!-- <button v-on:click="isMenuClicked = !isMenuClicked">
        <img src="/client/assets/images/menu.svg" />
      </button> -->
      <div class="title">
        <img src="@/assets/images/logo.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>WasteWise</h1>
        </RouterLink>
      </div>
      <ul class="navigation-list">
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <v-menu activator="#menu-activator">
    <v-list>
      <!-- https://vuetifyjs.com/en/components/menus/#api -->
      <v-list-item>
        <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
      </v-list-item>
      <v-list-item v-if="isLoggedIn">
        <RouterLink :to="{ name: 'Dashboard' }" :class="{ underline: currentRouteName == 'Dashboard' }"> Dashboard </RouterLink>
      </v-list-item>
      <v-list-item>
        <RouterLink :to="{ path: '/search/' }" :class="{ underline: currentRouteName == 'Search' }"> Search </RouterLink>
      </v-list-item>
      <v-list-item>
        <RouterLink :to="{ path: '/map/' }" :class="{ underline: currentRouteName == 'Map' }"> Map </RouterLink>
      </v-list-item>
      <v-list-item v-if="isLoggedIn">
        <v-list-item-title> Leaderboard </v-list-item-title>
      </v-list-item>
      <v-list-item v-if="isLoggedIn">
        <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
      </v-list-item>
    </v-list>
  </v-menu>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: lightgray;
  display: flex;
  align-items: center;
  gap: 1em;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

.navigation-list {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
