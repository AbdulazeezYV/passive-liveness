<script setup lang="ts">
/* NOTE: This is an EXAMPLE retry page for displaying errors from generating face liveness session. To see how to use the SDK in your application please see face-vuejs/src/components/AnalyzerView.vue */

import { ref, defineProps } from "vue";

const props = defineProps(["error"]);

const errorMessage = ref<string>(props.error);
</script>

<template>
  <div class="feedback">
    <div class="feedback-message">
      <span>{{ errorMessage }}</span>
    </div>
    <div class="item">
      <button
        class="action-button"
        id="continueButton"
        @click="$emit('retry')"
        >Retry</button
      >
    </div>
    <p class="powered-by">
    <span>Powered by </span>
    <img src="../assets/Frame.svg" alt="Logo" class="powered-by-logo">
</p>
  </div>
</template>

<style scoped>
@import "../assets/page_styles.css";

.feedback-column {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
}

.feedback {
  --height: 30px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  padding: 2em 0;
  position: absolute;
  background: white;
  width: 100%;
  place-content: center;
  row-gap: 18vh;
}

.feedback .item {
  font-weight: 500;
  font-size: 1.2em;
  padding: 5px;
  width: max-content;
  display: flex;
  position: relative;
  justify-content: center;
}

.feedback .item img {
  width: var(--height);
  height: var(--height);
}

.feedback .item span {
  line-height: var(--height);
  padding: 0 10px;
  display: inline-block;
}

.feedback-message {
    width: 80%;
    text-wrap: wrap;
  }

  .action-button {
  background-color: #46b2c8;
  color: white;
  padding: 1rem 3rem; /* Increased padding */
  font-size: 1.2rem; /* Increased font size */
  border: 2px solid #3698a9; /* Added border */
  border-radius: 10px; /* Slightly larger border radius */
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Added transition for transform */
}
.powered-by {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem; /* Add space above */
  font-size: 0.9rem; /* Slightly smaller font size */
  color: #555; /* Make the text color a bit softer */
}
.powered-by-logo{
  margin-left: 0.5rem;
  height: 20px;
}
</style>
