<script setup lang="ts">

import "azure-ai-vision-faceanalyzer";
import type * as AzureAIVision from "azure-ai-vision-faceanalyzer";

import { ref, watchEffect, defineProps, defineEmits } from "vue";
import { fetchTokenFromAPI } from "../utils/utils";


const props = defineProps([
  "livenessOperationMode",
  "action",
  "sendResultsToClient",
  "file",
]);

const containerRef = ref<HTMLDivElement | null>(null);
const azureAIVisionFaceAnalyzer = ref<AzureAIVision.AzureAIFaceLiveness | null>(
  null
);
const faceAnalyzedResult = ref<AzureAIVision.FaceAnalyzedResult | undefined>();
const emit = defineEmits(["retryAnalyzer", "displayResult"]);

watchEffect(async () => {
  const fetchResult = await fetchTokenFromAPI(
    props.livenessOperationMode,
    props.sendResultsToClient,
    props.file
  );

  if (fetchResult.token) {
    startFaceLiveness(fetchResult.token);
  } else {
    emit("retryAnalyzer", fetchResult.message);
  }
});


async function startFaceLiveness(authToken: string) {

  azureAIVisionFaceAnalyzer.value = document.querySelector(
    "azure-ai-vision-faceanalyzer"
  );

  if (azureAIVisionFaceAnalyzer.value == null) {
    azureAIVisionFaceAnalyzer.value = document.createElement(
      "azure-ai-vision-faceanalyzer"
    ) as AzureAIVision.AzureAIFaceLiveness;
    customElements.upgrade(azureAIVisionFaceAnalyzer.value);
    azureAIVisionFaceAnalyzer.value.token = authToken;


    azureAIVisionFaceAnalyzer.value.addEventListener(
      "analyzed",
      (event: any) => {
        console.log(event);
       
        faceAnalyzedResult.value =
          event.detail as AzureAIVision.FaceAnalyzedResult;
        if (faceAnalyzedResult.value) {
          // Set Liveness Status Results
          const livenessStatus =
            azureAIVisionFaceAnalyzer.value!.LivenessStatus[
              faceAnalyzedResult.value.livenessResult.status
            ];
          console.log("Success",azureAIVisionFaceAnalyzer.value!.LivenessStatus, faceAnalyzedResult.value.livenessResult.status)
          const livenessCondition = livenessStatus == "Live";

          let livenessText = null;
          if (livenessStatus == "Live") {
            livenessText = "Success";
          } else if (livenessStatus == "Spoof") {
            livenessText = "Failed";
          } else if (livenessStatus == "CompletedResultQueryableFromService") {
            livenessText = "CompletedResultQueryableFromService";
          } else {
            console.log("Failure",azureAIVisionFaceAnalyzer.value!.LivenessFailureReason,faceAnalyzedResult.value.livenessResult.failureReason)
            livenessText =`Retry, ${
              azureAIVisionFaceAnalyzer.value!.LivenessFailureReason[
                faceAnalyzedResult.value.livenessResult.failureReason
              ].replace(/([A-Z])/g, ' $1').trim().replace(/\b\w/g, (char:string) => char.toUpperCase())}`
            if (azureAIVisionFaceAnalyzer.value!.LivenessFailureReason[
                faceAnalyzedResult.value.livenessResult.failureReason
              ] === "EnvironmentNotSupported"){
                livenessText = "Failed, Kindly Increase your phone/laptop brightness and retry."
              }
          }

          let recognitionCondition;
          let recognitionText;
          if (faceAnalyzedResult.value.recognitionResult.status > 0) {
            const recognitionStatus =
              azureAIVisionFaceAnalyzer.value!.RecognitionStatus[
                faceAnalyzedResult.value.recognitionResult.status
              ];
            recognitionCondition = recognitionStatus == "Recognized";

            if (recognitionStatus == "Recognized") {
              recognitionText = "Same Person";
            } else if (recognitionStatus == "NotRecognized") {
              recognitionText = "Not the same person";
            } else if (
              recognitionStatus == "CompletedResultQueryableFromService"
            ) {
              recognitionText = "CompletedResultQueryableFromService";
            } else {
              recognitionText =
              azureAIVisionFaceAnalyzer.value!.RecognitionFailureReason[
                  faceAnalyzedResult.value.recognitionResult.failureReason
                ];
            }
          }

          emit("displayResult", {
            faceAnalyzedResult,
            recognitionCondition,
            recognitionText,
            livenessCondition,
            livenessText,
          });
        }
      }
    );

    containerRef.value?.appendChild(azureAIVisionFaceAnalyzer.value);
  } else {

    azureAIVisionFaceAnalyzer.value.token = authToken;
    await azureAIVisionFaceAnalyzer.value.analyzeOnceAgain();
  }
}
</script>

<template>
  <div id="analyzer-page">
    <div id="container" ref="containerRef"></div>
    <p class="powered-by">
    <span>Powered by </span>
    <img src="../assets/Frame.svg" alt="Logo" class="powered-by-logo">
   </p> 
  </div>
</template>

<style scoped>
div#analyzer-page {
    padding: "0 20px";
    font-size: "14px";
}
.powered-by {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem; 
  font-size: 0.9rem;
  color: #555;
}
.powered-by-logo{
  margin-left: 0.5rem;
  height: 20px;
}
</style>
