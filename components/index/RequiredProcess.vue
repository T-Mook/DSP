<template>
  <v-card>
    <v-card-title>
      {{ upperResourceName }}
    </v-card-title>
    <v-card-items>
      {{ test(upperResourceName) }}
    </v-card-items>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dataEnSample from '~/static/data/dataEn.json'

@Component({
  asyncData() {
    return { dataEnSample }
  },
})
class ComponentsIndexRequiredProcess extends Vue {
  @Prop({ type: String, default: '' }) upperResourceName!: string

  test(searchTarget: string): any {
    const datas: { [key: string]: any } = dataEnSample[0]
    const result: any = datas[searchTarget]
    return result
  }
}

export default ComponentsIndexRequiredProcess
</script>
