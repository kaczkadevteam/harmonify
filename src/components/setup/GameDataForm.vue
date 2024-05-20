<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useGameDataStore } from '@/stores'

const gameDataStore = useGameDataStore()
</script>

<template>
  <div class="grid gap-2">
    <h2 class="mb-2 text-2xl font-bold">
      Game settings
    </h2>
    <div class="flex items-center gap-5">
      <Label class="text-base" for="roundCount">Rounds</Label>
      <Input
        id="roundCount"
        v-model="gameDataStore.gameSettings.roundCount"
        class="w-20 border-none text-base"
        type="number"
      />
    </div>
    <div class="flex items-center gap-5">
      <Label for="roundDuration" class="text-base">Round duration</Label>
      <Input
        id="roundDuration"
        v-model="gameDataStore.gameSettings.roundDuration"
        class="w-20 border-none text-base"
        type="number"
      />
    </div>
    <div class="flex items-center gap-5">
      <Label for="trackDuration" class="text-base">Track duration</Label>
      <Input
        id="trackDuration"
        v-model="gameDataStore.gameSettings.trackDuration"
        class="w-20 border-none text-base"
        type="number"
      />
    </div>
  </div>
</template>
