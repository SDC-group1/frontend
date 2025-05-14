<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const blogs = ref([])

onMounted(async () => {
    const res = await axios.get('http://localhost:8000/blogs')
    blogs.value = res.data
})
</script>

<template>
    <div>
        <h2>Blog 列表</h2>
        <ul>
            <li v-for="(b, i) in blogs" :key="i">
                <h3>{{ b.title }}</h3>
                <p>{{ b.content }}</p>
            </li>
        </ul>
    </div>
</template>
