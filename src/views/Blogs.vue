<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const posts = ref([])
const newPost = ref({ title: '', content: '' })
const currentPage = ref(1)
const pageSize = 5

const fetchPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts`)
    posts.value = res.data
}

const addPost = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/posts`, newPost.value)
        await fetchPosts()
        newPost.value = { title: '', content: '' }
    } catch (err) {
        console.error("新增失敗", err.response?.data || err.message)
    }
}

const paginatedPosts = computed(() => {
    if (!Array.isArray(posts.value)) return []
    const start = (currentPage.value - 1) * pageSize
    return posts.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(posts.value.length / pageSize))

onMounted(fetchPosts)
</script>

<template>
    <div class="container no-navbar">
        <div class="add-post">
            <h3 class="center">✏️ 發表一則新內容</h3>
            <div class="input-wrapper">
                <input v-model="newPost.title" placeholder="輸入標題" />
            </div>
            <div class="input-wrapper">
                <textarea v-model="newPost.content" placeholder="輸入內容"></textarea>
            </div>
            <button @click="addPost">發布</button>

            <!-- 修正 v-if 的 transition 應該套在內層元素 -->
            <div v-if="newPost.title || newPost.content">
                <transition name="fade">
                    <div class="preview">
                        <h4 class="center">📸 即時預覽</h4>
                        <div class="post-card preview-card center-text">
                            <h3 class="center">{{ newPost.title }}</h3>
                            <p class="center">{{ newPost.content }}</p>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <div class="post-list">
            <div class="post-card" v-for="post in paginatedPosts" :key="post.id">
                <h3 class="center">{{ post.title }}</h3>
                <p class="center">{{ post.content?.slice(0, 100) || '' }}...</p>
                <small class="center">
                    #{{ post.author_id || '？' }}・{{ post.created_at ? new Date(post.created_at).toLocaleString() : '無時間' }}
                </small>
            </div>
        </div>

        <div class="pagination">
            <button @click="currentPage--" :disabled="currentPage === 1">⬅</button>
            <span>{{ currentPage }} / {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages">➡</button>
        </div>
    </div>
</template>

<style scoped>
html,
body,
#app {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #121212;
    color: #fff;
    font-family: 'Helvetica Neue', sans-serif;
}

.container {
    width: 95%;
    max-width: 600px;
    padding: 16px;
    box-sizing: border-box;
    margin: 0 auto;
}

.center-text,
.center {
    text-align: center;
}

.add-post {
    background-color: #1e1e1e;
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 32px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.input-wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    margin-bottom: 12px;
}

.add-post input,
.add-post textarea {
    width: 100%;
    padding: 12px;
    border: none;
    background-color: #2a2a2a;
    color: #fff;
    font-size: 0.95rem;
    outline: none;
    -webkit-tap-highlight-color: transparent;
}

button {
    background: #1a73e8;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s ease;
}

button:hover {
    background: #4285f4;
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.preview {
    margin-top: 24px;
    transition: all 0.3s ease-in-out;
}

.preview-card {
    background-color: #252525;
    opacity: 0.95;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* fade transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.post-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 24px;
}

.post-card {
    background-color: #1e1e1e;
    padding: 16px;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
}

.post-card:hover {
    transform: scale(1.01);
}

.post-card h3 {
    font-size: 1.2rem;
    margin-bottom: 8px;
}

.post-card p {
    font-size: 0.95rem;
    color: #cccccc;
}

.post-card small {
    display: block;
    margin-top: 10px;
    font-size: 0.8rem;
    color: #888;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
}
</style>
