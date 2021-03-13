<template>
  <v-row justify="center" align="center">
    <v-card :max-width="mainCardMaxWidth" flat tile color="rgba(0,0,0,0)">
      <!-- ### Start : Search Bar ### -->
      {{ resourceName }}
      <v-autocomplete
        v-model="resourceName"
        :items="resources"
        dense
        filled
        label="Filled"
      ></v-autocomplete>
      <!-- ### Start : All Required Process ### -->
      <required-process :upper-resource-name="resourceName" />
    </v-card>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import RequiredProcess from '@/components/index/RequiredProcess.vue'
import dataEnSample from '~/static/data/dataEn.json'

@Component({
  asyncData() {
    return { dataEnSample }
  },
  components: {
    RequiredProcess,
  },
  computed: {
    mainCardMaxWidth(): number {
      const maxWidth: number =
        this.$vuetify.breakpoint.width < 860
          ? this.$vuetify.breakpoint.width
          : 860
      return maxWidth
    },
  },
})
class PagesIndex extends Vue {
  resourceName: null | string = 'Electric Motor'
  resources: Array<string> = [
    'Iron Ore',
    'Copper Ore',
    'Iron Ingot',
    'Electric Motor',
  ]
}
export default PagesIndex
</script>

<style scoped>
#app
  > div
  > div
  > div
  > div
  > div
  > div:nth-child(1)
  > div
  > div.v-card__actions
  > a {
  text-transform: none;
}
</style>
