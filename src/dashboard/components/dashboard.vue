<script>
export default {
  name: "dashboard",
  data() {
    return {
      items: [
        { label: "Due Diligence", to: `/${this.$route.params.id}/workspace` },
        { label: "Q&A", to: `/${this.$route.params.id}/qa` },
        { label: "Settings", to: `/${this.$route.params.id}/settings` },
      ],
    };
  }
}
</script>

<template>
  <div class="col-2 w-48 bg-blue-800 text-white pt-4">
    <router-link v-for="item in items" :key="item.label" :to="item.to"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">{{ item.label }}</span>
    </router-link>
  </div>
</template>

<style scoped>

</style>