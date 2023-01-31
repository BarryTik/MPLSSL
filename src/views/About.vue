<template>
    <div>
        <Lead title="About"/>
    </div>
</template>

<script setup>
  import Lead from '@/components/Lead.vue';

  const props = defineProps({
      teams: Object,
      players: Object,
      games: Object,
      finishedGames: Object,
      totalScores: Object,
  });

</script>

<style>

</style>