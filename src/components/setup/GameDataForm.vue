<script setup lang="ts">
import { Slash } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { useGameDataStore } from '@/stores'
import { NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput } from '@/components/ui/number-field'

const gameDataStore = useGameDataStore()
</script>

<template>
  <div class="grid h-full auto-rows-min items-start gap-2 rounded-lg border px-5 py-4">
    <h2 class="mb-2 text-center text-xl font-bold lg:text-3xl">
      Game settings
    </h2>
    <div class="grid grid-cols-1 items-center justify-start justify-items-start gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-1">
      <Label class="grow text-base" for="roundCount">Rounds</Label>
      <NumberField
        id="roundCount"
        v-model:model-value="gameDataStore.gameSettings.roundCount"
        class="mb-2 flex w-full items-stretch gap-0 justify-self-end sm:w-56 lg:w-full"
        :min="1"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput class="rounded-r-none" />
          <NumberFieldIncrement />
        </NumberFieldContent>
        <div class="flex w-max items-center rounded-r-md border border-l-0 bg-muted pr-3 text-muted-foreground">
          <Slash class="size-5 rotate-[-32deg]" />
          <span class="mr-1">{{ 0 }}</span>
          <span>tracks</span>
        </div>
      </NumberField>

      <Label for="roundDuration" class="text-base">Round duration</Label>
      <NumberField
        id="roundDuration"
        v-model:model-value="gameDataStore.gameSettings.roundDuration"
        class="mb-2 flex w-full items-stretch gap-0 justify-self-end sm:w-40 lg:w-full"
        :min="1"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput class="rounded-r-none" />
          <NumberFieldIncrement />
        </NumberFieldContent>
        <div class="flex w-max items-center rounded-r-md border border-l-0 bg-muted px-3 text-muted-foreground">
          <span>s</span>
        </div>
      </NumberField>

      <Label for="trackDuration" class="text-base">Track duration</Label>
      <NumberField
        id="trackDuration"
        v-model:model-value="gameDataStore.gameSettings.trackDuration"
        class="mb-2 flex w-full items-stretch gap-0 justify-self-end sm:w-40 lg:w-full"
        :min="1"
        :max="30"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput class="rounded-r-none" />
          <NumberFieldIncrement />
        </NumberFieldContent>
        <div class="flex w-max items-center rounded-r-md border border-l-0 bg-muted px-3 text-muted-foreground">
          <span>s</span>
        </div>
      </NumberField>

      <Label for="breakDurationBetweenRounds" class="text-base">Time between rounds</Label>
      <NumberField
        id="trackDuration"
        v-model:model-value="gameDataStore.gameSettings.breakDurationBetweenRounds"
        class="mb-2 flex w-full items-stretch gap-0 justify-self-end sm:w-40 lg:w-full"
        :min="2"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput class="rounded-r-none" />
          <NumberFieldIncrement />
        </NumberFieldContent>
        <div class="flex w-max items-center rounded-r-md border border-l-0 bg-muted px-3 text-muted-foreground">
          <span>s</span>
        </div>
      </NumberField>
    </div>
  </div>
</template>
