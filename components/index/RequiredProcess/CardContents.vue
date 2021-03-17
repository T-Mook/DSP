<template>
  <div>
    <!-- Start: 하위 없는 경우 -->
    <v-expansion-panels v-if="obj.recipeDetail[objKey][2] === null" flat>
      <v-expansion-panel>
        <v-expansion-panel-header
          hide-actions
          class="lower-stage-goal-header-text"
        >
          {{ objKey }} 생산
          <small class="ml-1 grey--text">(직접 채집/채굴)</small>
        </v-expansion-panel-header>

        <!--
        <v-expansion-panel-content v-if="obj.recipeDetail[objKey][1] === []">
          {{ obj.recipeDetail[objKey][1] }}
        </v-expansion-panel-content>

        <v-expansion-panel-content v-else>
          {{ obj.recipeDetail[objKey][1][0] }}
        </v-expansion-panel-content>
        -->
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- Start: 하위 있는 경우 -->
    <v-expansion-panels v-else flat>
      <v-expansion-panel>
        <v-expansion-panel-header class="lower-stage-goal-header-text">
          {{ objKey }} 생산용 <br v-if="$vuetify.breakpoint.xsOnly" />
          {{ obj.recipeDetail[objKey][2][0] }}
          {{ Math.ceil(obj.recipeDetail[objKey][2][1]) }} 대
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat outlined class="mt-0 pt-2 px-0 px-sm-4">
            <v-list-item class="ml-2">
              <v-list-item-content class="py-0">
                <!-- Start: needed number -->
                <v-list-item-subtitle>
                  <span class="lower-stage-goal-subtitle-text mr-1">
                    > 요구 {{ objKey }} 개수 :
                  </span>
                  <span class="lower-stage-goal-subtitle-text">
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
                    <span class="lower-stage-goal-subtitle-text mr-1">
                      제조법:
                    </span>
                    <span
                      v-if="!Number.isNaN(arr[1])"
                      class="lower-stage-goal-subtitle-text"
                    >
                      {{ arr[0] }} {{ arr[1] }}개
                    </span>
                    <span v-else class="lower-stage-goal-subtitle-text">
                      {{ arr[0] }} 추출
                    </span>
                    <span
                      v-if="
                        Object.keys(obj.recipeDetail[objKey][1][0].recipe)
                          .length -
                          1 !==
                        aIndex
                      "
                      class="lower-stage-goal-subtitle-text mx-1"
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
              <v-divider class="ma-1" />
              <required-process-card-contents
                :obj="obj.recipeDetail[objKey][1][0]"
                :obj-key="lowerObjKey"
              />
            </div>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
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

<style scoped>
.lower-stage-goal-header-text {
  line-height: 20px;
}
.lower-stage-goal-subtitle-text {
  font-weight: 300;
  font-size: 0.9rem;
  color: lightgray;
  line-height: 0.8rem;
}
</style>
