<template>
  <v-card tile flat color="rgba(0,0,0,0)">
    <v-card-text class="d-flex justify-center">{{ formulaText }}</v-card-text>
    <!-- Start : Print Required Building name And Recipe-->
    <v-card
      v-for="(obj, index) in requiredBuildingAndRecipe(upperResourceName)"
      :key="index"
      outlined
      flat
      class="my-4 pa-4"
    >
      <v-card-title>
        {{ upperResourceName }} 생산 위한 {{ obj.building }} 1대당 적정 하위
        건물수
      </v-card-title>
      <v-card-text>
        <p>
          {{ obj.second }}초당 {{ obj.output }}개의 {{ upperResourceName }} 생산
        </p>
      </v-card-text>
      <!-- Start : Print Building and Number Of Lower Production-->
      <v-card
        v-for="(key, lowerIndex) in Object.keys(obj.recipeDetail)"
        :key="lowerIndex"
        outlined
        flat
        class="my-4"
      >
        <v-card-title v-if="obj.recipeDetail[key][2] !== null">
          '{{ key }}' 생산용 '{{ obj.recipeDetail[key][2][0] }}'
          {{ obj.recipeDetail[key][2][1] }} 개
        </v-card-title>
        <v-card-title v-else>{{ key }}는 추출</v-card-title>
        <v-card-text>
          <p>필요 재료 개수 : {{ obj.recipeDetail[key][0] }}</p>
          <p>전체 레시피 상세 : {{ obj.recipeDetail[key][1] }}</p>
        </v-card-text>
      </v-card>
      <v-divider class="ma-1" />
      <v-card outlined flat class="my-4">
        <v-card-actions>
          {{ obj }}
        </v-card-actions>
      </v-card>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import { Component, Provide, Prop, Vue } from 'nuxt-property-decorator'
import dataEnSample from '~/static/data/dataEn.json'

@Component({
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
        // console.log(lowerNeededList[0])
        const condition1: boolean = mNumber !== null
        const condition2: boolean = lowerNeededList[0] !== undefined
        const condition3: boolean = !arrayOfRecord.includes(mName)

        // Run recursive function in specific condition
        if (condition1 && condition2 && condition3) {
          arrayOfRecord.push(mName) // recording for prevent to infinite loop

          lowerNeededList = this.inputLowerMaterialProductionInfoArray(
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
