<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/stores'
import Switch from '@/components/ui/switch/Switch.vue'

const settingsStore = useSettingsStore()
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button variant="ghost" size="icon">
        <Settings />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Settings</SheetTitle>
      </SheetHeader>
      <div class="mt-4 space-y-6">
        <div class="grid grid-cols-[min-content_minmax(0,1fr)] items-center gap-4">
          <Label>Autoplay</Label>
          <Select v-model:model-value="settingsStore.autoplay">
            <SelectTrigger>
              <SelectValue placeholder="Select autoplay behaviour" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="always">
                  Always
                </SelectItem>
                <SelectItem value="once">
                  Once
                </SelectItem>
                <SelectItem value="never">
                  Never
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="grid grid-cols-[min-content_minmax(0,1fr)] items-center gap-4">
          <Label class="text-nowrap">Play animations</Label>
          <Switch :checked="settingsStore.playAnimations" @update:checked="settingsStore.playAnimations = !settingsStore.playAnimations" />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
