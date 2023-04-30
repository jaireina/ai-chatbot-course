import { Configuration, OpenAIApi } from "openai";
const { OPENAI_API_KEY } = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: body.messages || [],
      temperature: body.temperature || 1,
    });
    console.log(completion.data.choices[0].message);
    return completion.data;
  } catch (e) {
    console.log(e);
    return {};
  }
});
