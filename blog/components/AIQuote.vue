<template>
  <div class="ai-generated-excerpt p-4 rounded-lg bg-$va-c-bg-alt">
    <div font="black" flex items-center>
      <div i-ri-robot-2-line mr-1 />
      <div>由 AI 生成的内容</div>
    </div>
    <div op="90" mt-1>
      <slot />
    </div>
  </div>
</template>
