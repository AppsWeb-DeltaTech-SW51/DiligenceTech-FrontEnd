<script>
export default {
  name: "dashboard",
  props: ['insideProject2'],
  data() {
    return {
      // From the outside
      insideProject3: this.insideProject2,
      // Else
      items: [
        { label: "My Projects", to: `/${this.$route.params.id}/workspace` },
        { label: "Project Creation", to: `/${this.$route.params.id}/project_creation` },
        { label: "Settings", to: `/${this.$route.params.id}/settings` },
      ],
      project_items: [
        { label: "Due Diligence", to: `/${this.$route.params.id}/workspace/${this.$route.params.project_id}/${this.$route.params.user_type}` },
        { label: "Q&A", to: `/${this.$route.params.id}/qa/${this.$route.params.project_id}/${this.$route.params.user_type}` },
        { label: "Settings", to: `/${this.$route.params.id}/settings/${this.$route.params.project_id}/${this.$route.params.user_type}` },
      ],
    };
  }
}
</script>

<template>
  <div
      v-if="!insideProject2"
      class="col-2 w-48 bg-gray-900 text-white pt-4"
  >
    <router-link v-for="item in items" :key="item.label" :to="item.to"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">{{ item.label }}</span>
    </router-link>
  </div>
  <div
      v-else
      class="col-2 w-48 bg-gray-900 text-white pt-4"
  >
    <router-link v-for="item in project_items" :key="item.label" :to="item.to"
                 class="block px-4 py-2 rounded hover:bg-blue-700 transition-colors">
      <span class="text-white text">{{ item.label }}</span>
    </router-link>
  </div>
</template>

<style scoped>

</style>