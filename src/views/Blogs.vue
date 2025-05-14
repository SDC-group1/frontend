<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const blogs = ref([])
const newBlogName = ref("")
const selectedBlog = ref(null)

const fetchBlogs = async () => {
    const res = await axios.get('http://localhost:8000/blogs/')
    blogs.value = res.data
}

const addBlog = async () => {
    const res = await axios.post('http://localhost:8000/blogs/', {
        name: newBlogName.value
    })
    blogs.value.push(res.data)
    newBlogName.value = ""
}

const fetchOneBlog = async (id) => {
    const res = await axios.get(`http://localhost:8000/blogs/${id}`)
    selectedBlog.value = res.data
}

onMounted(fetchBlogs)
</script>

<template>
    <div>
        <h2>所有 Blog</h2>
        <ul>
            <li v-for="b in blogs" :key="b.id">
                {{ b.name }}
                <button @click="fetchOneBlog(b.id)">詳細</button>
            </li>
        </ul>

        <div v-if="selectedBlog">
            <h3>Blog 詳細</h3>
            <p>ID: {{ selectedBlog.id }}</p>
            <p>Name: {{ selectedBlog.name }}</p>
        </div>

        <h3>新增 Blog</h3>
        <input v-model="newBlogName" placeholder="輸入文章名稱" />
        <button @click="addBlog">新增</button>
    </div>
</template>
