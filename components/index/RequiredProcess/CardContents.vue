<template>
  <v-card outlined flat class="my-4 pa-4">
    <v-card-title v-if="obj.recipeDetail[objKey][2] !== null">
      '{{ objKey }}' 생산용 '{{ obj.recipeDetail[objKey][2][0] }}'
      {{ obj.recipeDetail[objKey][2][1] }} 개
    </v-card-title>
    <v-card-title v-else>{{ objKey }}는 추출</v-card-title>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title>기본 정보</v-list-item-title>
        <v-list-item-subtitle>
          '{{ objKey }}' 필요 개수 : {{ obj.recipeDetail[objKey][0] }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <div
      v-for="(lowerObjKey, lowerIndex) in Object.keys(
        obj.recipeDetail[objKey][1][0].recipeDetail,
      )"
      :key="lowerIndex"
    >
      <!-- Start: 하위 단계가 있는 경우  -->
      <required-process-card-contents
        v-if="
          obj.recipeDetail[objKey][1][0].recipeDetail[lowerObjKey][2] !== null
        "
        :obj="obj.recipeDetail[objKey][1][0]"
        :obj-key="lowerObjKey"
      />
      <!-- Start: 하위 단계가 없는 경우  -->
      <no-lower-stage v-else />
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import NoLowerStage from '@/components/index/RequiredProcess/NoLowerStage.vue'

@Component({
  /* Recursive Components
  ref: https://stackoverflow.com/questions/62794714/vue-typescript-recursive-component
  */
  name: 'RequiredProcessCardContents',

  components: {
    NoLowerStage,
  },
})
class ComponentsIndexRequiredProcessCardContents extends Vue {
  @Prop({ type: Object, default: '' }) obj!: object
  @Prop({ type: String, default: '' }) objKey!: string
}

export default ComponentsIndexRequiredProcessCardContents
</script>
