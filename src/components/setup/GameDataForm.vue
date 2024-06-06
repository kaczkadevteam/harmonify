<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useGameDataStore } from '@/stores'

const gameDataStore = useGameDataStore()
</script>

<template>
  <div class="grid h-full auto-rows-min items-start gap-2 rounded-lg border px-5 py-4">
    <h2 class="mb-2 text-center text-xl font-bold lg:text-3xl">
      Game settings
    </h2>
    <div class="flex items-center justify-between gap-5">
      <Label class="text-base" for="roundCount">Rounds</Label>
      <Input
        id="roundCount"
        v-model="gameDataStore.gameSettings.roundCount"
        class="w-20 text-base"
        type="number"
        min="1"
      />
    </div>
    <div class="flex items-center justify-between gap-5">
      <Label for="roundDuration" class="text-base">Round duration</Label>
      <Input
        id="roundDuration"
        v-model="gameDataStore.gameSettings.roundDuration"
        class="w-20 text-base"
        type="number"
        min="1"
      />
    </div>
    <div class="flex items-center justify-between gap-5">
      <Label for="trackDuration" class="text-base">Track duration</Label>
      <Input
        id="trackDuration"
        v-model="gameDataStore.gameSettings.trackDuration"
        class="w-20 text-base"
        type="number"
        min="1"
        max="30"
      />
    </div>
    <div class="flex items-center justify-between gap-5">
      <Label for="breakDurationBetweenRounds" class="text-base">Time between rounds</Label>
      <Input
        id="breakDurationBetweenRounds"
        v-model="gameDataStore.gameSettings.breakDurationBetweenRounds"
        class="w-20 text-base"
        type="number"
        min="2"
      />
    </div>
  </div>
</template>
