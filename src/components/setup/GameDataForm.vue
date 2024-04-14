<script setup lang="ts">
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useGameDataStore } from '@/stores/gameData'

const gameDataStore = useGameDataStore()
</script>

<template>
  <div class="grid gap-2">
    <div class="flex items-center gap-5">
      <Label class="text-base" for="roundCount">Rounds</Label>
      <Input
        id="roundCount"
        v-model="gameDataStore.roundCount"
        class="w-20 border-none text-base"
        type="number"
      />
    </div>
    <div class="flex items-center gap-5">
      <Label for="roundDuration" class="text-base">Round duration</Label>
      <Input
        id="roundDuration"
        v-model="gameDataStore.roundDuration"
        class="w-20 border-none text-base"
        type="number"
      />
    </div>
    <div class="flex items-center gap-5">
      <Label for="trackDuration" class="text-base">Track duration</Label>
      <Input
        id="trackDuration"
        v-model="gameDataStore.trackDuration"
        class="w-20 border-none text-base"
        type="number"
      />
    </div>
  </div>
</template>
