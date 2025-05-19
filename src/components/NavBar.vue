<template>
    <nav class="nav">
        <ul>
            <li>
                <router-link to="/blogs" class="link" active-class="active">Blogs</router-link>
                <a v-if="!hasAccessToken" class="link" @click="login">Login</a>
                <a v-else class="link" @click="logout">Logout</a>
            </li>
        </ul>
    </nav>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const hasAccessToken = ref(false)

function updateAccessTokenState() {
  hasAccessToken.value = document.cookie.split('; ').some(cookie =>
    cookie.startsWith('access_token=')
  )
}

const login = () => {
  window.location.href = `${import.meta.env.VITE_BASE_URL}/api/auth/login?c=${window.location.origin}/auth`
}

const logout = () => {
  document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
  updateAccessTokenState()
  router.push("/")
}

onMounted(() => {
  updateAccessTokenState()
})
</script>
  
<style scoped>
.nav {
    background-color: #121212;
    padding: 1rem 2rem;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid #2a2a2a;
}

.nav li {
    gap: 10px
}

ul {
    display: flex;
    list-style: none;
    gap: 1.2rem;
    margin: 0;
    padding: 0;
}

button { 

}

.link {
    padding: 0.4rem 1.2rem;
    border-radius: 9999px;
    background-color: transparent;
    color: #aaa;
    font-weight: 500;
    text-decoration: none;
    transition: background 0.2s, color 0.2s;
}

.link:hover {
    background-color: #2a2a2a;
    color: #fff;
}

.active {
    background-color: #ffffff10;
    color: #fff;
    font-weight: 600;
}
</style>
  