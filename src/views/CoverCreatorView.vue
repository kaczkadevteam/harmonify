<script setup lang="ts">
import { COVERS } from '@/consts'
import CircularText from '@/components/coverCreator/CircularText.vue'

const size = 800
const cssSize = `${size}px`
const centerX = size / 2
const centerY = size

const currentTrack = COVERS.animated
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
        :text="currentTrack.title"
        :offset-correction="currentTrack.titleOffset"
      />
      <CircularText
        path-id="subtitle"
        class="font-bold italic text-white/80"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="480"
        :font-size="40"
        :text="currentTrack.subtitle"
        :offset-correction="currentTrack.subtitleOffset"
      />
      <CircularText
        path-id="example"
        class="font-bold italic text-white/80"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="280"
        :font-size="36"
        :text="currentTrack.example"
        :offset-correction="currentTrack.exampleOffset"
      />
      <CircularText
        path-id="type"
        class="font-bold"
        :size="size"
        :center-x="centerX"
        :center-y="centerY"
        :radius="80"
        :font-size="32"
        text="MOVIES"
        :offset-correction="-10"
      />
    </div>
  </div>
</template>

<style scoped>
.outer-base {
  width: v-bind(cssSize);
  height: v-bind(cssSize);
  --h: v-bind('currentTrack.hue');
  --s: v-bind('currentTrack.saturation');
  --l: v-bind('`${currentTrack.lightness}%`');
  --lightness-offset: v-bind('`${currentTrack.lightnessOffset}%`');
}

.outer-background {
  --primary-color: hsl(var(--h) var(--s) var(--l));
  --pattern-color: hsl(var(--h) var(--s) calc(var(--l) + 10%));
  --pattern-color-2: hsl(var(--h) var(--s) calc(var(--l) + 5%));
  --secondary-color: hsl(
    var(--h) var(--s) calc(var(--l) - 10% + var(--lightness-offset, 0))
  );
  --border-color: hsl(
    var(--h) var(--s) calc(var(--l) - 12% + var(--lightness-offset, 0))
  );
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
