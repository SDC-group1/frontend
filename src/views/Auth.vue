<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('access_token');

  if (accessToken) {
    document.cookie = `access_token=${accessToken}; path=/`
  }
  router.push('/')
})
</script>