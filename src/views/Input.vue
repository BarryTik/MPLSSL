<template>
    <div>
        <Lead title="Input Scores" route="Home"/>
    </div>
    <div v-if="reactives.loading">
        LOADING
    </div>
    <div v-else>
        <div class="dropdown" v-show="reactives.showDropdown">
            <button v-on:click="dropdownFunction()" class="dropbtn">Choose Date and Match</button>
            <div id="gameDropdown" class="dropdown-content">
                <a v-for="day in Object.keys(reactives.games)" :key="day" v-on:click="chooseDay(day)" href="#">{{day}}</a>
            </div>
        </div>
        <div v-if="reactives.games[reactives.day] && reactives.daySelected">
            <button
                v-for="match in Object.keys(reactives.games[reactives.day].Matches)" :key="match"
                v-on:click="chooseMatch(match)"
                class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none"
                >{{reactives.teams[reactives.games[reactives.day].Matches[match].team1].name}} vs {{reactives.teams[reactives.games[reactives.day].Matches[match].team2].name}} {{reactives.games[reactives.day].Matches[match].time}}
            </button>
        </div>
        <div v-if="reactives.match && reactives.matchSelected" 
            class="max-w-screen-xl px-4 mx-auto sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between"
            v-on:click="changeMatch()"
        >
            <h2
                class="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 sm:text-4xl sm:leading-10  bg-gray-50 lead"
            >
                {{reactives.teams[reactives.games[reactives.day].Matches[reactives.match].team1].name}} vs {{reactives.teams[reactives.games[reactives.day].Matches[reactives.match].team2].name}} {{reactives.games[reactives.day].Matches[reactives.match].time}}
            </h2>
        </div>
        <div v-if="reactives.games[reactives.day] && reactives.matchSelected">
            <button
                v-on:click="chooseTeam(reactives.games[reactives.day].Matches[reactives.match].team1)"
                class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none"
                :style="{ backgroundColor: reactives.teams[reactives.games[reactives.day].Matches[reactives.match].team1].color }"
                >{{reactives.teams[reactives.games[reactives.day].Matches[reactives.match].team1].name}}
            </button>
            <button
                v-on:click="chooseTeam(reactives.games[reactives.day].Matches[reactives.match].team2)"
                class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none"
                :style="{ backgroundColor: reactives.teams[reactives.games[reactives.day].Matches[reactives.match].team2].color }"
                >{{reactives.teams[reactives.games[reactives.day].Matches[reactives.match].team2].name}}
            </button>
        </div>
        <div v-if="reactives.team && reactives.teamSelected">
            <div v-for="player in _.filter(reactives.players, ['Team', reactives.team])" :key="player">
                <button
                    v-on:click="playerScored(player)"
                    :style="{ backgroundColor: reactives.teams[reactives.team].color }"
                    class="inline-flex items-center justify-center px-5 py-3 text-base font-medium leading-6 text-white transition duration-150 ease-in-out bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-500 focus:outline-none"
                    >{{player.Name}}
                </button>
            </div>
        </div>

        
    </div>
</template>
<style scoped>
.lead{
  padding: 3%;
}
/* Dropdown Button */
.dropbtn {
  background-color: #3498DB;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover, .dropbtn:focus {
  background-color: #2980B9;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {display:block;}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script setup>
    import { db } from "../firebase";
    import { ref, onValue } from "firebase/database";
    import { reactive, ref as vueRef } from 'vue';
    import Lead from '@/components/Lead.vue'
    import _ from 'lodash';

    const reactives = reactive({
        loading: true,
        daySelected: false,
        matchSelected: false,
        teamSelected: false,
        showDropdown: true,
        games: {},
        day: '',
        match: NaN,
        team: '',
        teams: {},
        players: {},
    })
    loadTeams();
    loadPlayers();
    loadGames();


    async function loadGames(){
        onValue(ref(db, 'winter-21-22-2/Games'), (snapshot) => {
            reactives.games = snapshot.val();
            reactives.loading = false;
        });
    }

    async function loadTeams(){
        onValue(ref(db, 'winter-21-22-2/Teams'), (snapshot) => {
            reactives.teams = snapshot.val();
        })
    }

    async function loadPlayers() {
        onValue(ref(db, 'winter-21-22-2/Players'), (snapshot) => {
            reactives.players = snapshot.val();
        })
    }

    function dropdownFunction(){
        document.getElementById("gameDropdown").classList.toggle("show");
        reactives.daySelected = false;
        reactives.matchSelected = false;
        reactives.teamSelected= false;
    };

    function chooseDay(day){
        reactives.day = day;
        reactives.daySelected = true;
        reactives.showDropdown = false;
    }

    function chooseMatch(match){
        reactives.match = match;
        reactives.daySelected = false;
        reactives.matchSelected = true;
    }
    
    function chooseTeam(team){
        reactives.team = team;
        reactives.teamSelected = true;
    }

    function playerScored(player){
        console.log(player.Name);
    }

    function changeMatch(){
        reactives.daySelected = false;
        reactives.matchSelected = false;
        reactives.teamSelected= false;
        reactives.showDropdown = true;
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

</script>