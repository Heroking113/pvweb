<template>
  <div>
    <NaviBar></NaviBar>
    <router-view></router-view>
  </div>
</template>

<script>
import NaviBar from "../../components/NaviBar/Teacher/NaviBar.vue";
export default {
  components: {
    NaviBar,
  }
}
</script>

<style>

</style>
