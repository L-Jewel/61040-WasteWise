<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const isMenuClicked = ref(false);

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
      <button v-on:click="isMenuClicked = !isMenuClicked">
        <img src="/client/assets/images/menu.svg" />
      </button>
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
  <ul v-if="isMenuClicked" class="menu">
    <!-- Make all list items RouterLinks -->
    <li><RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink></li>
    <li v-if="isLoggedIn"><RouterLink :to="{ name: 'Dashboard' }" :class="{ underline: currentRouteName == 'Dashboard' }"> Dashboard </RouterLink></li>
    <li><RouterLink :to="{ name: 'Search' }" :class="{ underline: currentRouteName == 'Search' }"> Search </RouterLink></li>
    <li>Map</li>
    <li v-if="isLoggedIn">Leaderboard</li>
    <li v-if="isLoggedIn"><RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink></li>
  </ul>
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

button {
  height: 2em;
  width: 2em;
}

.menu {
  position: fixed;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  width: 15em;
}

.menu a,
.menu > li {
  /* Remove li selector after changing all nav items to RouterLinks (a)*/
  font-weight: bold;
  padding: 0.67em;
  font-size: larger;
}

.menu a {
  padding: 0;
}

.menu > li:hover {
  background-color: paleturquoise;
}
</style>
