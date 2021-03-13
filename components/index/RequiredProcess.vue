<template>
  <v-card>{{ resourceName }}</v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
class ComponentsIndexRequiredProcess extends Vue {
  @Prop({ type: String, default: 'Electric Motor' }) resourceName!: string
}

export default ComponentsIndexRequiredProcess
</script>
