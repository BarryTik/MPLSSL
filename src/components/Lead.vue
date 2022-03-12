<template>
  <div>
    <div
      class="max-w-screen-xl px-4 py-12 mx-auto sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
    >
      <h2
        class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10  bg-gray-50 lead"
      >
        MPLSSL
        <br />
        <span class="text-indigo-600">{{title}}</span>
      </h2>
    </div>
  </div>
</template>

<style scoped>
.lead{
  padding: 3%;
}
</style>

<script setup>
const props = defineProps({
  title: String
})
</script>