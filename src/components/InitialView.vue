<script setup lang="ts">
import { ref } from "vue";

const verifyImage = ref<File | undefined>(undefined);
const verifyImageUrl = ref("");

function onFileChange(e: Event) {
  const elem = e.target as HTMLInputElement;
  if (elem.files) {
    verifyImageUrl.value = URL.createObjectURL(elem.files[0]);
    verifyImage.value = elem.files[0];
  } else {
    verifyImage.value = undefined;
  }
}
</script>

<template>
  <div class="page ms-Fabric">
    <div class="layout">
      <iframe
        id="splash"
        title="splash"
        src="splash.html"
        height="700px"
        role="status"
      ></iframe>
      <div class="content">
        <div class="feedback" id="feedbackContainer" role="status" hidden></div>
        <div id="container"></div>

        <div class="row" id="verifyImageRow">
          <label class="verify-input">
            <input
              type="file"
              id="useVerifyImageFileInput"
              accept="image/*"
              @change="onFileChange"
            />
            Select Verify Image
          </label>
        </div>

        <img v-if="verifyImage" :src="verifyImageUrl" id="verify-image-preview" />

        <div class="row button-row">
          <button
            class="ms-fontSize-l action-button"
            id="startPassiveButton"
            @click="
              $emit('initFaceAnalyzer', {
                file: verifyImage,
                livenessOperationMode: 'Passive',
              })
            "
          >Start Passive</button>

          <button
            class="ms-fontSize-l action-button"
            id="startPassiveActiveButton"
            @click="
              $emit('initFaceAnalyzer', {
                file: verifyImage,
                livenessOperationMode: 'PassiveActive',
              })
            "
          >Start Passive Active</button>
        </div>
        <div></div>
      </div>
    </div>

    <p class="powered-by">
      <span>Powered by </span>
      <img src="../assets/Frame.svg" alt="Logo" class="powered-by-logo">
    </p>
  </div>
</template>

<style scoped>
@import "../assets/page_styles.css";

/* General Layout */
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f4f4f4;
  height: 100vh;
}

.layout {
  display: flex;
  width: 100%;
  max-width: 1200px;
}

iframe {
  flex: 1;
  min-width: 300px;
  height: 1900px;
  border: none;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.row {
  margin: 1.5rem 0;
  display: flex; 
  flex-direction: column;
  align-items: center;
}

img#verify-image-preview {
  max-width: 40vw;
  max-height: 200px;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

input#useVerifyImageFileInput {
  display: none;
}

/* File input button styling */
.verify-input {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #46b2c8;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.verify-input:hover {
  background-color: #3698a9;
}

/* Action buttons styling */
.button-row {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  justify-content: center;
  align-items: center; /* Center buttons */
  gap: 1rem; /* Add gap between buttons */
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

iframe {
  flex: 1; /* Allow iframe to take available space */
  min-width: 300px; /* Minimum width for iframe */
  height: 1000px; /* Set height to auto to fit content */
  border: none; /* Remove border */
  /* padding: 20px; Added padding around iframe content */
  box-sizing: border-box; /* Ensure padding does not affect width */
}

.action-button:hover {
  background-color: #3698a9;
}

.action-button:focus {
  outline: none;
  box-shadow: none;
}

/* Center the powered by line */
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

@media screen and (max-width: 767px) {
  .layout {
    flex-direction: column; /* Stack iframe and content on small screens */
  }

  iframe {
    max-width: 100%; /* Ensure iframe does not overflow */
    height: auto; /* Maintain auto height for responsive */
  }

  .verify-input,
  .action-button {
    font-size: 0.9rem;
    padding: 0.75rem 1.5rem;
  }

  .verify-input {
    width: 100%;
    justify-content: center;
  }
}

@media screen and (max-width: 640px) {
  img#verify-image-preview {
    max-width: 70vw;
    max-height: 150px;
  }
}
</style>
