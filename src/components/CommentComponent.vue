<script>
export default {
  name: "CommentComponent",
  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <div>
    <div class="mb-5">
      <div class="font-bold">{{ comment.name }}</div>
      <time>{{ comment.createdAt }}</time>
    </div>

    <p>
      {{ comment.content }}
    </p>
  </div>
</template>

<style scoped lang="scss"></style>
