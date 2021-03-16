<template>
  <v-card outlined flat class="mt-4 pa-4">
    <v-card-title v-if="obj.recipeDetail[objKey][2] !== null" class="py-0">
      {{ objKey }} 생산용 {{ obj.recipeDetail[objKey][2][0] }}
      {{ Math.ceil(obj.recipeDetail[objKey][2][1]) }} 대
    </v-card-title>
    <v-card-title v-else class="py-0">{{ objKey }}는 추출</v-card-title>
    <v-list-item class="ml-2">
      <v-list-item-content class="py-0">
        <!-- Start: needed number -->
        <v-list-item-subtitle>
          <span class="mr-1">> 요구 {{ objKey }} 개수 :</span>
          <span>
            {{ obj.recipeDetail[objKey][0] }}
          </span>
        </v-list-item-subtitle>
        <!-- Start: lower stage recipe -->
        <v-list-item-subtitle>
          >
          <span
            v-for="(arr, aIndex) in Object.entries(
              obj.recipeDetail[objKey][1][0].recipe,
            )"
            :key="aIndex"
          >
            <span class="mr-1">제조법:</span>
            <span v-if="!Number.isNaN(arr[1])">
              {{ arr[0] }} {{ arr[1] }}개
            </span>
            <span v-else>
              {{ arr[0] }}
            </span>
            <span
              v-if="
                Object.keys(obj.recipeDetail[objKey][1][0].recipe).length -
                  1 !==
                aIndex
              "
              class="mx-1"
            >
              +
            </span>
          </span>
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
