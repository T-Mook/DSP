<template>
  <v-card>
    {{ resourceName }}
    {{ test }}
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dataEnSample from '~/static/data/dataEn.json'

@Component({
  asyncData() {
    return { dataEnSample }
  },
  computed: {
    test() {
      const result = dataEnSample[0]['Iron Ore']
      return result
    },
  },
})
class ComponentsIndexRequiredProcess extends Vue {
  @Prop({ type: String, default: 'Electric Motor' }) resourceName!: string
}

export default ComponentsIndexRequiredProcess
</script>
