<template>
  <v-card>
    {{ resourceName }}
    {{ test }}
  </v-card>
</template>

<script>
import dataEnSample from '~/static/data/dataEn.json'

export default {
  props: {
    resourceName: { type: String, default: 'Electric Motor' },
  },
  asyncData() {
    return { dataEnSample }
  },
  computed: {
    test() {
      const result = dataEnSample[0]['Iron Ore']
      return result
    },
  },
}
</script>
