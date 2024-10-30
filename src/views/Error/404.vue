<template>
  <Error @error-click="push('/')" />
</template>
<script lang="ts" setup name="Error404">
const { push } = useRouter()
</script>
