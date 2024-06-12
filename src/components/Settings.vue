<script setup lang="ts">
import { Settings } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSettingsStore } from '@/stores'

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
      <SheetHeader class="mb-2">
        <SheetTitle>Settings</SheetTitle>
        <div class="mt-2 grid grid-cols-[200px_minmax(0,1fr)] items-center">
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
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
