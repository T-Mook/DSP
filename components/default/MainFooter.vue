<template>
  <v-footer :color="color" padless>
    <v-row justify="center" no-gutters>
      <v-col class="py-4 text-center grey--text" cols="12">
        {{ contact }}
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'nuxt-property-decorator'
@Component({})
class ComponentsDefaultMainFooter extends Vue {
  @Provide() contact: string = 'contact : msp770@gmail.com'
  @Provide() color: string = 'rgba(21,31,32,1)'
}
export default ComponentsDefaultMainFooter
</script>
