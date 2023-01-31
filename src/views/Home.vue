<template>
    <div>
        <Lead title="Winter 21/22"/>
    </div>
</template>

<script setup>
  import { reactive } from 'vue';
  import Lead from '@/components/Lead.vue';

  const reactives = reactive({
      loading: true,
  });

</script>

<style>
  h1 {
    font-size: 1.6em;
    font-weight: 600;
    background-color: rgba(256, 256, 256, 0.85);
    margin-top: 10px;
  }
  .score {
    background-color: white;
  }
  .vs {
    font-weight: 600;
    background-color: rgba(256, 256, 256, 0.85);
  }
  table {
    font-family: arial, sans-serif;
    border-collapse: collapse;
  }
  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
</style>