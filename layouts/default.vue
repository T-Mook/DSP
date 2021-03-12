<template>
  <v-app>
    <v-app-bar :color="appBar.color" dense flat>
      <v-spacer />
      <v-app-bar-title class="white--text">
        <small>{{ appBar.title }}</small>
      </v-app-bar-title>
      <v-spacer />
    </v-app-bar>
    <v-container class="mb-4">
      <nuxt />
    </v-container>
    <main-footer />
  </v-app>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'nuxt-property-decorator'
import MainFooter from '@/components/default/MainFooter.vue'
@Component({
  components: {
    MainFooter,
  },
})
class LayoutDefault extends Vue {
  @Provide() appBar: { title: string; color: string } = {
    title: '다이슨 스피어 프로그램 공장 최적화 도우미',
    color: 'rgba(21,31,32,1)',
  }
}
export default LayoutDefault
</script>
