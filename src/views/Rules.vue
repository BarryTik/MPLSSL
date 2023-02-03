<template>
    <div>
        <Lead title="Rules"/>
    </div>
    <div class="rules">
      <h2>As always, don't be an asshole</h2>

      <h2>FOULS</h2>
      <ul>
        <li>Call your own fouls - Remember sportsmanship is key in this league, respect each other. Again, don't be an asshole.</li>
        <li>We've all got varying levels of skill, let's keep the competition fun dammit!</li>
      </ul>

      <h2>Out of bounds</h2>
      <ul>
        <li>Ceiling</li>
        <li>Nets</li>
        <li>Backwalls (Roll the ball back to the opposing keeper)</li>
        <li>Return the ball back into play with a stationary kick-in, no throw-ins</li>
        <li>Side walls are IN BOUNDS</li>
      </ul>

      <h2>Goals</h2>
      <ul>
        <li>When a goal is scored, return the ball back to midfield for kickoff</li>
      </ul>

      <h2>Keeper's Crease</h2>
      <ul>
        <li>Keeper's can handle the ball inside the crease only</li>
        <li>Defenders can enter the crease</li>
        <li>Offence should stay OUT, if the ball is present in the keeper's crease - the opposing team may NOT enter nor reach into the crease to score</li>
        <li>Keepers have final sign off on if a goal stands due to offence crease infractions</li>
        <li>Keeper can leave the crease as they see fit</li>
      </ul>

      <h2>Teams</h2>
      <ul>
        <li>Each team should have at least 1 player whom identifies female on the field at all times</li>
        <li>Each team should have no more than 8 active members</li>
      </ul>

      <h2>Subs</h2>
      <ul>
        <li>Subs are asked to donate $5 for each game in which they participate</li>
      </ul>

      <h2>Time</h2>
      <ul>
        <li>Two 25 minute halfs; 23 minute during playoffs. </li>
        <li>5 minute half-time</li>
      </ul>

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

<style scoped>
.rules {
  background-color: rgba(256, 256, 256, 0.95);
}
.rules h2 {
  font-size: 1.6em;
  font-weight: 600;
}
ul {
  margin-left: 20px;
}
li {
  list-style: none;
}
li::before {
  content: '';
  display: inline-block;
  height: 32px;
  width: 32px;
  background-image: url("/soccerball.ico");
  background-size: cover;
  vertical-align: -40%;
  margin-right: 3px;
}

</style>