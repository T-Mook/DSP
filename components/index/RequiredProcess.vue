<template>
  <v-card tile flat color="rgba(0,0,0,0)">
    <v-card-title>
      {{ upperResourceName }}
    </v-card-title>
    <v-card-text>
      {{ test(upperResourceName) }}
    </v-card-text>
    <v-card outlined dark>
      <v-card-actions>
        {{ requiredBuildingAndRecipe(upperResourceName) }}
      </v-card-actions>
    </v-card>
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
    const datas: { [key: string]: any } = dataEnSample
    const result: any = datas[searchTarget]
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
      // recipe Infos
      const recipe: object = obj['recipe']
      const resourceEntries: Array<any> = Object.entries(recipe)

      const mNameObject: { [key: string]: any } = {}

      for (const materialInfo of resourceEntries) {
        const mName: string = materialInfo[0]
        const mNumber: number = materialInfo[1]

        let lowerNeededList: Array<{
          [key: string]: any
        }> = this.returnNeededList(mName)

        // Conditions to prevent RangeError: Maximum call stack size exceeded
        // console.log(lowerNeededList[0])
        const condition1: boolean = mNumber !== null
        const condition2: boolean = lowerNeededList[0] !== undefined
        const condition3: boolean = !arrayOfRecord.includes(mName)

        if (condition1 && condition2 && condition3) {
          arrayOfRecord.push(mName) // recording for prevent to infinite loop

          lowerNeededList = this.inputLowerMaterialProductionInfoArray(
            lowerNeededList,
            arrayOfRecord,
          )
          mNameObject[mName] = [mNumber, lowerNeededList]
        } else {
          mNameObject[mName] = [mNumber, lowerNeededList]
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
