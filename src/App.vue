<template>
  <CursorDecoration />
  <MainContent />
</template>

<script>
import CursorDecoration from './components/CursorDecoration.vue'
import MainContent from './components/MainContent.vue'

export default {
  name: 'App',
  components: {
    CursorDecoration,
    MainContent
  }
}

const alert9 = 'Opening on your PC or using a mouse on your phone is recommended. \n\n'

const alert0 = 'How to operate (Mouse)\n\n'
const alert1 = '1. Moving the pointer:  Changing the direction you are looking\n';
const alert2 = '2. Holding down the LEFT button:  Moving forward\n';
const alert3 = '3. Holding down the RIGHT button:  Moving backward\n';
const alert4 = '4. Holding down the SCROLL WHEEL:  Switching viewpoints\n\n';
const alert5 = 'You can do the same things with the following touch pad operations.\n\n';
const alert6 = '2 = Double-tap (long press for the second tap with a single finger)\n';
const alert7 = '3 = Double-tap (two fingers for the first tap and long press for the second tap with a single finger)\n';
const alert8 = '4 = Double-tap (three fingers for the first tap and long press for the second tap with a single finger)';

const Alert = alert9 + alert0 + alert1 + alert2 + alert3 + alert4 + alert5 + alert6 + alert7 + alert8;

alert(Alert);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body {
  margin: 0;
  padding: 0;
  position: relative;
  height: 100%;
  /* width: 100%; */
}
</style>
