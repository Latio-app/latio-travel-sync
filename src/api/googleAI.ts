import axios from "axios";

const API_KEY = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;

interface AIRecommendationParams {
  location: string;
  budget?: number;
  duration?: number;
  preferences?: string[];
}

export const generateTravelRecommendations = async (
  params: AIRecommendationParams
) => {
  if (!API_KEY) {
    throw new Error(
      "Google AI API key is not configured. Please add VITE_GOOGLE_GENAI_API_KEY to your .env file."
    );
  }

  try {
    const prompt = `Generate travel recommendations for ${params.location} with the following details:
      ${params.budget ? `Budget: ${params.budget} USD` : ""}
      ${params.duration ? `Duration: ${params.duration} days` : ""}
      ${params.preferences ? `Preferences: ${params.preferences.join(", ")}` : ""}
      
      Please include:
      1. Top attractions
      2. Local cuisine recommendations
      3. Budget-friendly tips
      4. Transportation options
      5. Safety considerations
      
      Format the response in a clear, organized way with sections and bullet points.`;

    // 🔄 **Construct API URL and Request Body**
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    console.log("🚀 Sending request to Google AI:");
    console.log(JSON.stringify(requestBody, null, 2));

    // 🔄 **Perform API Call with Axios**
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(
      "✅ Response received:",
      JSON.stringify(response.data, null, 2)
    );

    // ✅ **Extract the Text from the Correct Path**
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts[0]
    ) {
      return response.data.candidates[0].content.parts[0].text;
    } else {
      console.error(
        "❌ Missing 'content' in response:",
        JSON.stringify(response.data, null, 2)
      );
      throw new Error("No response received from Google AI.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ API Call Failed:", error.message);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    }
    throw new Error(
      "An unexpected error occurred while generating recommendations."
    );
  }
};
