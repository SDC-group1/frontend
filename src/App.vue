<script setup>
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'

const route = useRoute()
</script>

<template>
  <div>
    <NavBar :key="route.fullPath"/>
  </div>
  <router-view />
</template>

<style>
  
</style>