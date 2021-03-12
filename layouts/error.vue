<template>
  <v-app light>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/"> Home page</NuxtLink>
  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Provide, Vue } from 'nuxt-property-decorator'
@Component({
  layout: 'empty',
})
class LayoutError extends Vue {
  @Prop({ type: Object, default: null }) error!: { statusCode: number }
  @Provide() pageNotFound: string = '존재하지 않는 페이지'
  @Provide() otherError: string = '알 수 없는 에러'
  head(): object {
    const title: string =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  }
}
export default LayoutError
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
