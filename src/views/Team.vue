<template>
    <div>
        <Lead :title="props.teams[props.team]? props.teams[props.team].name : 'Not Found'" :color="props.teams[props.team]? props.teams[props.team].color : 'gray'"/>
    </div>
    <div v-if="reactives.loading">
        LOADING
    </div>
    <div v-else>
        <table class="bg-gray-50">
            <tr v-for="player in reactives.teamPlayers" :key="player" >
                <td>{{player.Captain? player.Name + ' (c)' : player.Name}}</td>
                <td>{{player.Email}}</td>
                <td>{{player.Gender}}</td>
                <td>{{player.Paid}}</td>
                <td>{{player['Years In League']}}</td>
                <td>{{player.Fact}}</td>
                <td><a :href="player.Picture" target="_blank">Picture</a></td>
                
            </tr>
        </table>
    </div>
</template>

<script setup>
    import Lead from '@/components/Lead.vue';
    import jsonQuery from 'json-query';
    import { reactive } from 'vue';

    const props = defineProps({
      teams: Object,
      players: Object,
      games: Object,
      finishedGames: Object,
      totalScores: Object,
      team: String,
    });

    const reactives = reactive({
        teamPlayers: {},
        loading: true,
    })

    getPlayers();

    function getPlayers(){
        const data = jsonQuery(`[**][*Team=${props.team}]`, {
            data: props.players
        })
        reactives.teamPlayers = data.value;
        reactives.loading = false;
    }

</script>

<style scoped>
    tr:nth-child(even) {background: #CCC}
    tr:nth-child(odd) {background: #FFF}

    table{
        display: block;
        max-width: -moz-fit-content;
        max-width: fit-content;
        margin: 0 auto;
        overflow-x: auto;
    }
</style>