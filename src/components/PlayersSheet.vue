<script setup lang="ts">
import Player from '@/components/Player.vue'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useGameDataStore } from '@/stores'
import { Users } from 'lucide-vue-next'

const gameDataStore = useGameDataStore()
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button variant="ghost" size="icon" class="w-fit gap-1 px-1">
        <Users />
        <div>{{ gameDataStore.players.length }}</div>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="mb-2">
        <SheetTitle>Players</SheetTitle>
      </SheetHeader>
      <ScrollArea class="h-[calc(100%_-_30px)]">
        <div class="space-y-3">
          <Player
            v-for="player of gameDataStore.players" :key="player.guid"
            :is-self="player.guid === gameDataStore.selfPlayer.guid"
            :editable="player.guid === gameDataStore.selfPlayer.guid"
            :player
          />
        </div>
      </ScrollArea>
    </SheetContent>
  </Sheet>
</template>
