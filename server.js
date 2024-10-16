const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (_req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.post(
  "/api/generateAccessToken",
  upload.single("VerifyImage"),
  async (req, res) => {
    let file = null;
    const parameters = JSON.parse(req.body.Parameters);
    const livenessOperationMode = parameters.livenessOperationMode;
    const sendResultsToClient = parameters.sendResultsToClient;
    const deviceCorrelationId = parameters.deviceCorrelationId;
    const action = req.body.Action;

    if (req.file) {
      file = new Blob([req.file.buffer], { name: req.file.originalname });
    }

    if (file == undefined && action == "detectLivenessWithVerify") {
      res.status(400).send({
        message: "VerifyImage not provided for detectLivenessWithVerify",
        token: null,
      });
      return;
    }

    // Ensure parameters are within expectation
    if (!(action == "detectLiveness" || action == "detectLivenessWithVerify")) {
      return res.status(400).send({
        message: "action parameter not expected",
        token: null,
      });
    }
    if (
      !(
        livenessOperationMode == "Passive" ||
        livenessOperationMode == "PassiveActive"
      )
    ) {
      return res.status(400).send({
        message: "livenessOperationMode parameter not expected",
        token: null,
      });
    }
    if (typeof sendResultsToClient != "boolean") {
      return res.status(400).send({
        message: "sendResultsToClient parameter not expected",
        token: null,
      });
    }
    if (typeof deviceCorrelationId != "string") {
      return res.status(400).send({
        message: "deviceCorrelationId parameter not expected",
        token: null,
      });
    }

    let formBody = JSON.stringify({
      livenessOperationMode,
      sendResultsToClient,
      deviceCorrelationId,
    });

    if (action == "detectLivenessWithVerify") {
      formBody = new FormData();
      formBody.append(
        "Parameters",
        JSON.stringify({
          livenessOperationMode,
          sendResultsToClient,
          deviceCorrelationId,
        })
      );
      formBody.append("VerifyImage", file, file.name);
    }

    const result = await fetchTokenOnServer(
      process.env.FACE_ENDPOINT,
      process.env.FACE_KEY,
      action,
      formBody
    );
    res.status(result.hasOwnProperty("error") ? 400 : 200).send(result);
    return;
  }
);

app.use(express.static(`${__dirname}/dist/`));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

// Fetch Token Function
const fetchTokenOnServer = async (
  faceApiEndPoint,
  faceApiKey,
  action,
  formBody
) => {
  try {
    let headers = {
      "Ocp-Apim-Subscription-Key": faceApiKey,
      "X-MS-AZSDK-Telemetry": "sample=vuejs-face-web-sdk",
    };
    if (action === "detectLiveness") {
      headers["Content-Type"] = "application/json";
    }
    const response = await fetch(
      `${faceApiEndPoint}/face/v1.1-preview.1/${action}/singleModal/sessions`,
      {
        method: "POST",
        headers: headers,
        body: formBody,
      }
    );

    const sessions = await response.json();

    if (!response.ok) {
      throw new Error(sessions.error?.message);
    }

    return { authToken: sessions.authToken, message: "success" };
  } catch (error) {
    if (typeof error === "string") {
      return { error: { token: null, message: error } };
    } else if (error instanceof Error) {
      return {
        error: { token: null, message: error.message ?? "Unknown error" },
      };
    }
    return { error: { token: null, message: "Unknown error" } };
  }
};
