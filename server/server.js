const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateImage = async (prompt) => {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = response.data.data[0].b64_json;
    return image;
  } catch (error) {
    console.error("Error generating image:", error.message);
    throw error;
  }
};

app.post("/generateImage", async (req, res) => {
  try {
    const image = await generateImage(req.body.prompt);
    res.send({ image });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});
