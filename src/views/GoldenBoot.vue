<template>
  <div>
      <Lead title="Golden Boot"/>
  </div>
  <div v-if="reactives.loading">
    <h2>Loading</h2>
  </div>
  <div v-else class="golden-boot">
    <table class="bg-gray-50">
        <tr v-for="player in reactives.sortedPlayers" :key="player">
            <td :style="{ backgroundColor: (props.players[player]? props.teams[props.players[player].Team].color : 'white'), color : (props.players[player]? (props.teams[props.players[player].Team].color === 'black' || props.teams[props.players[player].Team].color === ' blue' ? 'white':'black') :'black')}">{{props.players[player]? props.players[player].Name : player}}</td>
            <td>{{reactives.pointsByPlayer[player]}}</td>
        </tr>
    </table>
  </div>
</template>

<script setup>
    import { reactive } from 'vue';
    import _ from 'lodash';
    import jsonQuery from 'json-query';
    import Lead from '@/components/Lead.vue'

    const props = defineProps({
        teams: Object,
        players: Object,
        games: Object,
        finishedGames: Object,
        totalScores: Object
    });

    const reactives = reactive({
        loading: true,
        pointsByPlayer: {},
        sortedPlayers: [],
    });

    calculateLeaders();

    function calculateLeaders() {
        const finishedGames = jsonQuery('[**][*:beforeToday]', {
            data: props.games,
            locals: {
                beforeToday: function (item) {
                    return new Date(item.Date) < new Date();
                }
            }
        });
        const reducedFinishedGames = _.reduce(finishedGames.value, function(gamesResult, gamesValue, gamesKey){
            const reducedMatches = _.reduce(gamesValue.Matches, function(matchesResult, matchesValue, matchesKey){
                const reducedPoints = _.reduce(matchesValue.points, function(pointsResult, pointsValue, pointsKey){
                    const reducedPlayers = _.reduce(pointsValue, function(playersResult, playersValue, playersKey){
                        playersResult.push({[playersKey]: playersValue});
                        return playersResult;
                    },[]);
                    pointsResult.push(reducedPlayers);
                    return pointsResult;
                },[]);
                matchesResult.push(_.flatten(reducedPoints));
                return matchesResult;
            },[]);
            gamesResult.push(_.flatten(reducedMatches));
            return gamesResult;
        },[]);
        const playerPointsPerGame = _.flatten(reducedFinishedGames);
        
        const pointsByPlayer = _.reduce(playerPointsPerGame, function(r, v){
            r[Object.keys(v)[0]] = r[Object.keys(v)[0]]? r[Object.keys(v)[0]] + Object.values(v)[0] : Object.values(v)[0];
            return r;
        },{});

        delete pointsByPlayer.Sub;
        delete pointsByPlayer['Own Goal'];

        const cmp = (a, b) => (a < b) - (a > b);
        const sortedPlayers = Object.keys(pointsByPlayer).sort(function(a, b) {
            return cmp(pointsByPlayer[a], pointsByPlayer[b]) || cmp(a, b); 
        });

        reactives.sortedPlayers = sortedPlayers;
        reactives.pointsByPlayer = pointsByPlayer;
        reactives.loading = false;
    }
</script>

<style>
.golden-boot{
    max-height: 67vh;
    overflow:scroll;
}
</style>