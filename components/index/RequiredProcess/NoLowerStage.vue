<template>
  <v-card-text class="d-flex justify-right">
    <small>{{ text }}</small>
  </v-card-text>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
class ComponentsIndexRequiredProcessNoLowerStage extends Vue {
  text: string = '*해당 자원은 광산, 행성 등에서 직접 채집/채굴 합니다'
}
export default ComponentsIndexRequiredProcessNoLowerStage
</script>
