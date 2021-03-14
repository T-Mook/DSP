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

  requiredBuildingAndRecipe(finalResourceName: string): object {
    const datas: { [key: string]: any } = dataEnSample
    // const totalNameOfResource: Array<string> = Object.keys(datas)
    // if (finalResourceName in totalNameOfResource) {}

    // Handling Recipe
    const totalTextOfRecipe: any = datas[finalResourceName]['recipe']
    const arrayOfRecipe: Array<string> = this.arrayAfterSlice(
      totalTextOfRecipe,
      '&',
    )

    const recipeList: Array<object> = this.returnObjectFromEachRecipe(
      arrayOfRecipe,
    )

    // Handling Needed Buildings
    const textOfBuildingName: string = datas[finalResourceName]['producedIn']
    const buildingList: Array<string> = this.arrayAfterSlice(
      textOfBuildingName,
      '&',
    )

    // Check Value Number of Each List
    if (recipeList.length !== buildingList.length) {
      alert(
        String(recipeList.length) +
          '개' +
          String(buildingList.length) +
          '개' +
          '목록 숫자가 맞지 않습니다',
      )
    }

    const result: { [key: string]: any } = {
      buildingList,
      recipeList,
    }
    return result
  }
}

export default ComponentsIndexRequiredProcess
</script>
