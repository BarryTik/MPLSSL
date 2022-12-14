<template>
  <div class="bg-indigo-600">
    <nav
      class="
        container
        px-6
        py-8
        mx-auto
        md:flex md:justify-between md:items-center
        dropdown
      "
    >
      <div class="flex items-center justify-between">
        <router-link
          to="/"
          class="
            text-xl
            font-bold
            text-gray-100
            md:text-2xl
          "
          @click="closeNav"
          ><img src="../../public/favicon.ico">
        </router-link>
        <!-- Mobile menu button -->
        <div @click="toggleNav" class="flex md:hidden">
          <button
            type="button"
            class="
              text-gray-100
              focus:outline-none focus:text-gray-400
            "
          >
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path
                fill-rule="evenodd"
                d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <ul
        :class="showMenu ? 'flex' : 'hidden'"
        class="
          flex-col
          mt-8
          space-y-4
          md:flex md:space-y-0 md:flex-row md:items-center md:space-x-10 md:mt-0
        "
      >
        <li class="text-gray-100"><router-link @click="closeNav" to="/Standings">Standings</router-link></li>
        <li class="text-gray-100"><router-link @click="closeNav" to="/GoldenBoot">Golden Boot</router-link></li>
        <li class="text-gray-100"><router-link @click="closeNav" to="/Input">Input</router-link></li>
        <li class="text-gray-100"><router-link @click="closeNav" to="/Subs">Subs</router-link></li>
      </ul>
    </nav>
  </div>
</template>
<style scoped>
  .dropdown{
      z-index: 3;
      position: absolute;
      background-color: blue;
      position: fixed;
  }
  nav{
    max-width: 100vw !important;
  }
</style>
<script>
import { ref } from 'vue';
export default {
  setup() {
    let showMenu = ref(false);
    const toggleNav = () => (showMenu.value = !showMenu.value);
    const closeNav = () => (showMenu.value = false);
    return { showMenu, toggleNav, closeNav };
  },
};
</script>