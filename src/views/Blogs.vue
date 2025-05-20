<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const posts = ref([])
const newPost = ref({ title: '', content: '' })
const currentPage = ref(1)
const pageSize = 5
const searchKeyword = ref('') 
const isSearching = ref(false) 

function getAccessTokenFromCookie() {
  const match = document.cookie.match(/(^| )access_token=([^;]+)/)
  return match ? match[2] : null
}

const token = getAccessTokenFromCookie()

const fetchPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/posts`)
    posts.value = res.data
}

const addPost = async () => {
    try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/posts`, newPost.value, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        await fetchPosts()
        newPost.value = { title: '', content: '' }
    } catch (err) {
        if (err.response) {
            const status = err.response.status
            console.error(`新增失敗，狀態碼：${status}`, err.response.data)

            if (status === 401) {
            alert('未授權，請重新登入')
            } else if (status === 400) {
            alert('請確認輸入內容正確')
            }
        } else {
            console.error("發生非 HTTP 錯誤", err.message)
            alert("請求失敗，請稍後再試")
        }
    }
}

const paginatedPosts = computed(() => {
    if (!Array.isArray(posts.value)) return []
    const start = (currentPage.value - 1) * pageSize
    return posts.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(posts.value.length / pageSize))

const searchPosts = async() => {
    if(!searchKeyword.value.trim()){
        await fetchPosts() // revert to full list if no keyword
        return
    }
    try {
        const response = await axios.get('${import.meta.env.VITE_BASE_UTL}/api/posts/search', 
            {params: { keyword: searchKeyword.value }})
        posts.value = response.data
        isSearching.value = true
        currentPage.value = 1
    } catch (error) {
        console.error('搜尋失敗', error)
        alert('搜尋失敗，請稍後再試')
        }
}

const clearSearch = async() => {
    searchKeyword.value = ''
    await fetchPosts() // revert to full list
    isSearching.value = false
}

onMounted(fetchPosts)
</script>

<template>
    <div class="container no-navbar">
        <div class="search-section">
            <h3 class="center">🔍 搜尋內容</h3>
            <div class="input-wrapper">
                <input v-model="searchKeyword" placeholder="輸入關鍵字" @keyup.enter="searchPosts" />
            </div>
            <div class="search-buttons">
                <button @click="searchPosts">搜尋</button>
                <button @click="clearSearch" v-if="isSearching">清除搜尋</button>
            </div>
        </div>


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
            <div v-if="paginatedPosts.length === 0" class="center">
                <p> {{ isSearching ? '無符合關鍵字的文章' : '目前沒有文章' }}</p>
            </div>
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

.add-post,
.search-section {
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
.add-post textarea,
.search-section input {
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

.search-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
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
