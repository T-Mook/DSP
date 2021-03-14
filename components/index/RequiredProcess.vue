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
        {{ requiredBuildings(upperResourceName) }}
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

  returnObjectFromEachRecipe(arrayOfRecipe: Array<string>): object {
    const result: { [key: string]: any } = {}
    let i: number = 0

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

      result[String(i)] = ingredientsObject
      i += 1
    }

    return result
  }

  requiredBuildings(finalResourceName: string): object {
    const datas: { [key: string]: any } = dataEnSample

    // Handling Recipe
    const totalTextOfRecipe: any = datas[finalResourceName]['recipe']
    const arrayOfRecipe: Array<string> = this.arrayAfterSlice(
      totalTextOfRecipe,
      '&',
    )

    const resultObject: object = this.returnObjectFromEachRecipe(arrayOfRecipe)

    const result: { [key: string]: any } = {
      totalTextOfRecipe,
      arrayOfRecipe,
      resultObject,
    }
    return result
  }
}

export default ComponentsIndexRequiredProcess
</script>
