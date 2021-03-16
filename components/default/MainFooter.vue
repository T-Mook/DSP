<template>
  <v-footer :color="color" padless>
    <v-row justify="center" no-gutters>
      <v-col class="footer-text pt-2 text-center grey--text" cols="12">
        본 서비스 사용 이미지의 출처 :
        <a href="https://dsp-wiki.com/" target="_blank">DSP-Wiki</a>
      </v-col>
      <v-col class="footer-text pb-2 text-center grey--text" cols="12">
        제작 (somebody hel..p!!):
        <a href="https://www.youtube.com/c/TMook" target="_blank">{{
          contact
        }}</a>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import { Component, Provide, Vue } from 'nuxt-property-decorator'
@Component({})
class ComponentsDefaultMainFooter extends Vue {
  @Provide() contact: string = 'TMook'
  @Provide() color: string = 'rgba(21,31,32,1)'
}
export default ComponentsDefaultMainFooter
</script>

<style scoped>
.footer-text {
  font-size: 14px;
  font-weight: 400;
}
</style>
