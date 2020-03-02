<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: 'app',
  provide(){
    return {
      reload: this.reload
    }
  },
  data (){
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function(){
        this.isRouterAlive = true
      })
    }
  },
  created () {
    let saveState = JSON.parse(localStorage.getItem('state'))
    this.$store.commit("reSetState", saveState)
  }
}
</script>


<style>
html,body{
	margin: 0; 
	padding: 0;
	border: 0;
  overflow: hidden;
}
</style>
