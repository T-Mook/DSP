<template>
  <v-card flat color="rgba(0,0,0,0)">
    <!-- Start : Print Required Building name And Recipe-->
    <v-card
      v-for="(obj, index) in requiredBuildingAndRecipe(upperResourceName)"
      :key="index"
      outlined
      flat
      color="rgba(0,0,0,0)"
      class="my-4 px-0 pb-4"
    >
      <!-- Start: 필요 건물 수 표시 -->
      <v-card-title class="pb-2">
        <!-- Start: img -->
        <!--
        <v-avatar>
          <v-img
            height="20"
            width="20"
            src="https://dsp-wiki.com/images/2/2a/Icon_Crystal_Silicon.png"
            contain
          />
        </v-avatar>
        -->
        <span class="goal-text">
          #{{ index + 1 }}. {{ upperResourceName }} 생산용
          {{ obj.building }} 1대당 <br v-if="$vuetify.breakpoint.xsOnly" />
          필요 하위 건물수
        </span>
      </v-card-title>

      <!-- Start : 상세 정보 표시 -->
      <v-list-item two-line class="ml-1 mb-4">
        <v-list-item-content>
          <v-list-item-subtitle>
            <span class="goal-subtitle-text">> 필요 재료:</span>
            <span
              v-for="(r, rIndex) in Object.entries(obj.recipe)"
              :key="rIndex"
              class="goal-subtitle-text mr-1"
            >
              <span>{{ r[0] }}</span>
              <span v-if="!Number.isNaN(r[1])">{{ r[1] }}개</span>
              <span v-else class="ml-1">필요</span>
              <span
                v-if="Object.entries(obj.recipe).length - 1 !== rIndex"
                class="ml-1"
                >+
              </span>
            </span>
          </v-list-item-subtitle>
          <v-list-item-subtitle>
            <span class="goal-subtitle-text">
              > 생산 정보 : {{ obj.building }}에서 {{ obj.second }}초당
              {{ obj.output }}개의 {{ upperResourceName }} 생산
            </span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <!-- Start : Print Building and Number Of Lower Production-->
      <div
        v-for="(objKey, lowerIndex) in Object.keys(obj.recipeDetail)"
        :key="lowerIndex"
      >
        <card-contents :obj="obj" :obj-key="objKey" />
      </div>
    </v-card>
    <!-- Using Formula -->
    <v-card-text class="d-flex justify-center px-12">
      {{ formulaText }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Provide, Prop, Vue } from 'nuxt-property-decorator'
import CardContents from '@/components/index/RequiredProcess/CardContents.vue'
import NoLowerStage from '@/components/index/RequiredProcess/NoLowerStage.vue'
import dataEnSample from '~/static/data/dataEn.json'

@Component({
  components: {
    CardContents,
    NoLowerStage,
  },
  asyncData() {
    return { dataEnSample }
  },
})
class ComponentsIndexRequiredProcess extends Vue {
  @Prop({ type: String, default: '' }) upperResourceName!: string

  @Provide() formulaText: string =
    '*생산 공장 1개당 재료 공장 수 = (필요 재료 수 * 재료 생산 시간<초>) / (최종물 생산시간<초> * 재료 생산 개수)'

  test(searchTarget: string): any {
    const datas: { [key: string]: any } = dataEnSample
    const result: any = datas[searchTarget]
    return result
  }

  calculatorForoptimalBuildingNumber(obj: { [key: string]: number }): number {
    // 원하는 생산물 생산에 필요한 재료 수를 계속 수급하는데 필요한 공장 수
    // 필요 재료 수 / 최종물 생산시간<초> = (재료 생산 개수 / 재료 생산 시간<초>) * 재료 공장 수
    // > 생산 공장 1개당 재료 공장 수 = (필요 재료 수 * 재료 생산 시간<초>) / (최종물 생산시간<초> * 재료 생산 개수)
    const neededResourceNumber: number = obj['neededResourceNumber']
    const neededResourceProductionSecond: number =
      obj['neededResourceProductionSecond']
    const neededResourceProductionNumber: number =
      obj['neededResourceProductionNumber']
    const targetProductionSecond: number = obj['targetProductionSecond']

    const buildingNumber: number =
      (neededResourceNumber * neededResourceProductionSecond) /
      (targetProductionSecond * neededResourceProductionNumber)

    const result: number = buildingNumber
    return result
  }

  arrayAfterSlice(text: string, sep: string): Array<string> {
    const result: Array<string> = text.split(sep)
    return result
  }

  splitResourceNameAndNumber(text: string): { [key: string]: number } {
    const re = /(\D+)\((\d{1,2})\)/gi
    const resourceName: string = text.replace(re, '$1')
    const resourceNumber: number = Number(text.replace(re, '$2'))

    const result: { [key: string]: number } = {}
    result[resourceName] = resourceNumber

    return result
  }

  returnObjectFromEachRecipe(arrayOfRecipe: Array<string>): Array<object> {
    const result: Array<object> = []

    for (const recipe of arrayOfRecipe) {
      const arrayOfEachResource: Array<string> = this.arrayAfterSlice(
        recipe,
        ',',
      )

      const ingredientsObject: { [key: string]: number } = {}
      for (const resourceInfo of arrayOfEachResource) {
        const objectOfResourceInfo: {
          [key: string]: number
        } = this.splitResourceNameAndNumber(resourceInfo)

        const eachResourceName: string = Object.keys(objectOfResourceInfo)[0]
        const eachResourceNumber: number = Object.values(
          objectOfResourceInfo,
        )[0]

        ingredientsObject[eachResourceName] = eachResourceNumber
      }

      result.push(ingredientsObject)
    }

    return result
  }

  makeEachRecipeArray(arrayOfLists: { [key: string]: any }): Array<object> {
    const buildingList: Array<any> = arrayOfLists['buildingList']
    const recipeList: Array<any> = arrayOfLists['recipeList']
    const outputList: Array<any> = arrayOfLists['outputList']
    const secondList: Array<any> = arrayOfLists['secondList']

    const resultArray: Array<object> = []
    let i: number = 0

    while (i < buildingList.length) {
      const tempObject: object = {
        building: buildingList[i],
        recipe: recipeList[i],
        output: outputList[i],
        second: secondList[i],
      }

      resultArray.push(tempObject)
      i += 1
    }

    return resultArray
  }

  inputLowerMaterialProductionInfoArray(
    higherStageResourceName: string,
    neededList: Array<{ [key: string]: any }>,
    arrayOfRecord: Array<string>,
  ): Array<object> {
    const resultNeededList: Array<object> = []

    for (const obj of neededList) {
      // Target Production Infos
      const targetProductionSecond: number = Number(obj['second'])

      // Recipe Infos
      const recipe: object = obj['recipe']
      const resourceEntries: Array<any> = Object.entries(recipe) // [ 재료 이름, 필요 재료 개수 ]

      const mNameObject: { [key: string]: any } = {}

      for (const materialInfo of resourceEntries) {
        const mName: string = materialInfo[0] // 재료 이름
        const mNumber: number = materialInfo[1] // 필요 재료 개수

        let lowerNeededList: Array<{
          [key: string]: any
        }> = this.returnNeededList(mName)

        // Conditions to prevent RangeError: Maximum call stack size exceeded
        const condition1: boolean = mNumber !== null
        const condition2: boolean = lowerNeededList[0] !== undefined

        // Black List : Same Higher & Lower Stage Resource Name
        const wordsForRestrict: string = higherStageResourceName + '&' + mName
        const condition3: boolean = !arrayOfRecord.includes(wordsForRestrict)

        // Run recursive function in specific condition
        if (condition1 && condition2 && condition3) {
          arrayOfRecord.push(wordsForRestrict) // recording for prevent to infinite loop

          lowerNeededList = this.inputLowerMaterialProductionInfoArray(
            mName,
            lowerNeededList,
            arrayOfRecord,
          )

          // Calculate Optimal Building Number for Producing a Resource
          const lowerBuildingName: string = lowerNeededList[0]['building']
          const lowerProductionOutput: number = Number(
            lowerNeededList[0]['output'],
          )
          const lowerProducedSecond: number = Number(
            lowerNeededList[0]['second'],
          )
          const targetObject: { [key: string]: any } = {
            neededResourceNumber: mNumber,
            neededResourceProductionSecond: lowerProducedSecond,
            neededResourceProductionNumber: lowerProductionOutput,
            targetProductionSecond,
          }

          const optimalBuildingNumberForResource: number = this.calculatorForoptimalBuildingNumber(
            targetObject,
          )

          const buildingNameAndOptimalNumber: Array<string | number> = [
            lowerBuildingName,
            optimalBuildingNumberForResource,
          ]

          mNameObject[mName] = [
            mNumber,
            lowerNeededList,
            buildingNameAndOptimalNumber,
          ]
        } else {
          const buildingNameAndOptimalNumber: null = null

          mNameObject[mName] = [
            mNumber,
            lowerNeededList,
            buildingNameAndOptimalNumber,
          ]
        }
      }

      obj['recipeDetail'] = mNameObject
      resultNeededList.push(obj)
    }

    return resultNeededList
  }

  returnNeededList(targetResourceName: string): Array<object> {
    const datas: { [key: string]: any } = dataEnSample

    const totalNameOfResource: Array<string> = Object.keys(datas)
    if (totalNameOfResource.includes(targetResourceName)) {
      const totalTextOfRecipe: any = datas[targetResourceName]['recipe']
      const arrayOfRecipe: Array<string> = this.arrayAfterSlice(
        totalTextOfRecipe,
        '&',
      )
      const recipeList: Array<object> = this.returnObjectFromEachRecipe(
        arrayOfRecipe,
      )
      // Handling Needed Buildings
      const textOfBuildingName: string = datas[targetResourceName]['producedIn']
      const buildingList: Array<string> = this.arrayAfterSlice(
        textOfBuildingName,
        '&',
      )
      // Handling Output
      const textOfOutputNumber: string = datas[targetResourceName]['output']
      const outputList: Array<string> = this.arrayAfterSlice(
        textOfOutputNumber,
        '&',
      )
      // Handling Produce Time
      const textOfProducedSecond: string =
        datas[targetResourceName]['producedSecond']
      const secondList: Array<string> = this.arrayAfterSlice(
        textOfProducedSecond,
        '&',
      )
      // Check Value Number of Each List
      const ArrayOfListsLength: Array<number> = [
        recipeList.length,
        buildingList.length,
        outputList.length,
        secondList.length,
      ]
      if (ArrayOfListsLength.every((v) => v !== ArrayOfListsLength[0])) {
        // Check total condition in array
        const text: string = '목록 숫자가 맞지 않습니다'
        throw text
      }
      // Change Array to Each Building-Recipe-Output-Second Array
      const arrayOfLists: { [key: string]: any } = {
        buildingList,
        recipeList,
        outputList,
        secondList,
      }
      const neededList = this.makeEachRecipeArray(arrayOfLists)

      return neededList
    } else {
      return []
    }
  }

  requiredBuildingAndRecipe(targetResourceName: string): object | undefined {
    try {
      const neededList = this.returnNeededList(targetResourceName)
      const resultArray = this.inputLowerMaterialProductionInfoArray(
        targetResourceName,
        neededList,
        [],
      )

      return resultArray
    } catch (e) {
      alert(e)
    }
  }
}

export default ComponentsIndexRequiredProcess
</script>

<style scoped>
.goal-text {
  font-weight: 500;
  font-size: 1.1rem;
}
.goal-subtitle-text {
  font-weight: 300;
  font-size: 0.9rem;
  color: lightgray;
}
</style>
