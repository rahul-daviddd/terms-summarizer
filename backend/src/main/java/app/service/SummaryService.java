package app.service;

import java.time.Duration;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class SummaryService {

    private static final String GEMINI_API_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    private static final MediaType JSON = MediaType.parse("application/json");

    private final OkHttpClient client = new OkHttpClient.Builder()
            .callTimeout(Duration.ofSeconds(60))
            .connectTimeout(Duration.ofSeconds(10))
            .readTimeout(Duration.ofSeconds(60))
            .writeTimeout(Duration.ofSeconds(30))
            .build();

    public String summarize(String text) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Missing GEMINI_API_KEY environment variable.");
        }

        String prompt = """
        Analyze the following Terms and Conditions and respond in this exact format:

        Summary:
        - (3 short bullets max, 1 line each)

        Red flags:
        - (only list items found, 1 line each; if none, write "None")

        Risk: LOW / MEDIUM / HIGH

        Keep it short and straight to the point. No extra paragraphs.

        Text:
        """ + trimInput(text, 8000);

        JSONObject requestBody = new JSONObject();

        JSONObject systemInstruction = new JSONObject();
        systemInstruction.put("parts", new JSONArray()
                .put(new JSONObject().put("text", "You summarize legal terms for normal users.")));
        requestBody.put("system_instruction", systemInstruction);

        JSONArray contents = new JSONArray();
        JSONObject content = new JSONObject();
        content.put("parts", new JSONArray().put(new JSONObject().put("text", prompt)));
        contents.put(content);
        requestBody.put("contents", contents);

        Request request = new Request.Builder()
                .url(GEMINI_API_URL)
                .addHeader("x-goog-api-key", apiKey)
                .addHeader("Content-Type", "application/json")
                .post(RequestBody.create(requestBody.toString(), JSON))
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "";
                throw new RuntimeException("OpenAI API error: " + response.code() + " " + errorBody);
            }

            String responseBody = response.body() != null ? response.body().string() : "";
            JSONObject json = new JSONObject(responseBody);
            return extractGeminiText(json);
        } catch (Exception e) {
            throw new RuntimeException("Failed to summarize terms.", e);
        }
    }

    private String trimInput(String text, int maxChars) {
        if (text == null) {
            return "";
        }
        if (text.length() <= maxChars) {
            return text;
        }
        return text.substring(0, maxChars) + "\n\n[TRUNCATED]";
    }

    private String extractGeminiText(JSONObject json) {
        JSONArray candidates = json.optJSONArray("candidates");
        if (candidates == null || candidates.isEmpty()) {
            return "";
        }

        JSONObject first = candidates.getJSONObject(0);
        JSONObject content = first.optJSONObject("content");
        if (content == null) {
            return "";
        }

        JSONArray parts = content.optJSONArray("parts");
        if (parts == null || parts.isEmpty()) {
            return "";
        }

        StringBuilder result = new StringBuilder();
        for (int i = 0; i < parts.length(); i++) {
            JSONObject part = parts.getJSONObject(i);
            String text = part.optString("text", "");
            if (!text.isBlank()) {
                if (result.length() > 0) {
                    result.append("\n");
                }
                result.append(text);
            }
        }

        return result.toString().trim();
    }
}
