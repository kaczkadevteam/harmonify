<script setup lang="ts">
import { computed } from 'vue'
import type { CurvedText } from './CircularText.vue'
import CircularText from './CircularText.vue'

export interface HslColor {
  hue: number
  saturation: number
  lightness: number
}

const props = defineProps<{
  baseColor: HslColor
  size: number
  centerX: number
  centerY: number
  title: CurvedText
  subtitle: CurvedText
  example: CurvedText
}>()

const cssSize = computed(() => `${props.size}px`)
</script>

<template>
  <div class="outer-base outer-background">
    <div class="inner grid size-full justify-center overflow-hidden font-sans *:col-start-1 *:row-start-1">
      <CircularText
        path-id="title"
        class="font-bold"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="650"
        :font-size="90"
        :text="title"
      />
      <CircularText
        path-id="subtitle"
        class="font-bold italic text-white/80"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="480"
        :font-size="40"
        :text="subtitle"
      />
      <CircularText
        path-id="example"
        class="font-bold italic text-white/80"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="280"
        :font-size="36"
        :text="example"
      />
      <CircularText
        path-id="type"
        class="font-bold"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="80"
        :font-size="32"
        :text="{
          value: 'MOVIES',
          offsetCorrection: -10,
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.outer-base {
  width: v-bind(cssSize);
  height: v-bind(cssSize);
  --h: v-bind('baseColor.hue');
  --s: v-bind('baseColor.saturation');
  --l: v-bind('`${baseColor.lightness}%`');
}

.outer-background {
  --primary-color: hsl(var(--h) var(--s) var(--l));
  --pattern-color: hsl(var(--h) var(--s) calc(var(--l) + 10%));
  --pattern-color-2: hsl(var(--h) var(--s) calc(var(--l) + 5%));
  --secondary-color: hsl(var(--h) var(--s) calc(var(--l) - 10%));
  --border-color: hsl(var(--h) var(--s) calc(var(--l) - 12%));
  --muted-color: hsl(var(--h) var(--s) 90%);

  background: conic-gradient(
    from 180deg at bottom,
    var(--primary-color) 100deg,
    var(--pattern-color) 115deg,
    var(--pattern-color-2) 125deg,
    var(--pattern-color) 135deg 140deg,
    var(--primary-color) 160deg 180deg,
    var(--pattern-color) 220deg,
    var(--primary-color) 240deg
  );
}

.outer-meme-background {
  --primary-color: hsl(var(--h) var(--s) var(--l));
  --pattern-color: hsl(calc(var(--h) + 240) var(--s) var(--l));
  --pattern-color-2: hsl(var(--h) var(--s) calc(var(--l) + 5%));
  --secondary-color: hsl(0deg 0% 0% / 35%);
  --border-color: hsl(0deg 0% 0% / 60%);
  --muted-color: #d9f99d;

  background:
    url('@/assets/pepe.png') 50% 60% / 50%,
    conic-gradient(
      from 180deg at bottom in hsl longer hue,
      var(--primary-color) 90deg,
      var(--pattern-color) 270deg
    );
}

.inner {
  --inside-color: hsl(240deg 6% 10%);
  --inside-path-color: hsl(240deg 6% 40%);

  background: radial-gradient(
    circle at bottom,
    white 2%,
    var(--inside-color) 2% 20%,
    transparent 20% 40%,
    var(--secondary-color) 40% 41%,
    transparent 41% 60%,
    var(--secondary-color) 60% 61%,
    transparent 61% 80%,
    var(--border-color) 80% 81%,
    var(--muted-color) 81%
  );
  background-position: center;
  background-size: 142%;
}
</style>
