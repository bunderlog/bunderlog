<script setup lang="ts">
import './styles/tailwind.css'
import { iButton } from '@/shared/ui'
</script>
<template>
  <h1 class="bg-blue-900 text-white p-5">Hello Bunderlog!</h1>
  <div class="p-5">
    <iButton variant="default">Hello Button</iButton>
    <iButton variant="destructive">Destructive Button</iButton>
    <iButton variant="outline">Outline Button</iButton>
    <iButton variant="secondary">Secondary Button</iButton>
    <iButton variant="ghost">Ghost Button</iButton>
    <iButton variant="link">Link Button</iButton>
  </div>
</template>
