<template>
    <nav class="nav">
        <ul>
            <li>
                <router-link to="/blogs" class="link" active-class="active">Blogs</router-link>
            </li>
        </ul>
    </nav>
</template>
  
<script>
export default {
    name: 'NavBar'
}
</script>
  
<style scoped>
.nav {
    background-color: #121212;
    padding: 1rem 2rem;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
    border-bottom: 1px solid #2a2a2a;
}

ul {
    display: flex;
    list-style: none;
    gap: 1.2rem;
    margin: 0;
    padding: 0;
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
  