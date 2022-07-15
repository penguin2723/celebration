<template>
  <div id="cursor"></div>
</template>

<script>
import { onMounted } from '@vue/runtime-core';

export default {
  setup() {
    onMounted(() => {
      let cursor = document.getElementById('cursor');
  
      document.addEventListener('mousemove', function (e) {
        cursor.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)' + ' rotate(45deg)';
        cursor.style.border = 'solid #67c99b';
        cursor.style.boxShadow = '0 0 10px 1px #67c99b, inset 0 0 10px 1px #67c99b'
      });
  
      document.addEventListener('mousedown', function (e) {
        if (typeof e === 'object') {
          switch (e.button) {
            case 0:
              cursor.style.border = 'solid #0b79bd';
              cursor.style.boxShadow = '0 0 10px 1px #0b79bd';
              cursor.style.borderRadius = '50%';
              cursor.style.width = '6rem';
              cursor.style.height = '6rem';
              cursor.style.top = '-3.3rem';
              cursor.style.left = '-3.3rem';
              break;
            case 2:
              cursor.style.border = 'solid red';
              cursor.style.boxShadow = 'inset 0 0 10px red';
              cursor.style.borderRadius = '50%';
              cursor.style.width = '3rem';
              cursor.style.height = '3rem';
              cursor.style.top = '-1.8rem';
              cursor.style.left = '-1.8rem';
              break;
          }
        } 
      });
  
      document.addEventListener('mouseup', function () {
        cursor.style.border = 'solid #67c99b';
        cursor.style.borderRadius = '30%';
        cursor.style.width = '4rem';
        cursor.style.height = '4rem';
        cursor.style.top = '-2.2rem';
        cursor.style.left = '-2.2rem';
      });
    })
  }
}
</script>


<style scoped>
  #cursor {
    z-index: 1001; 
    position: fixed;       
    top: -2.2rem;
    left: -2.2rem; 
    width: 4rem;
    height: 4rem;
    margin: 0;
    padding: 0;
    pointer-events: none; 
    border-radius: 30%;
    transform: translate(3.3rem, 2.7rem) rotate(45deg);
    background-color: transparent;
    /* border: solid #32a1ce; */
    border: unset;
  }
</style>