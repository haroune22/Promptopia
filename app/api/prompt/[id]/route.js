import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });

    return new Response(JSON.stringify(prompt), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();
    await Prompt.findByIdAndRemove(params.id);

    return new Response("Propt Deleted Succesufuly", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
export const PATCH = async (request, { params }) => {
    const {prompt,tag} = await request.json()
    try {
        await connectToDB();
        const newPrompt = await Prompt.findByIdAndUpdate(
          params.id,
          {
            $set:
           { prompt: prompt,
            tag: tag}
          },
          { new: true }
        );
        await newPrompt.save()
        return new Response(JSON.stringify(newPrompt), { status: 200 });
    } catch (error) {
         return new Response("Internal Server Error", { status: 500 });
    }
}
