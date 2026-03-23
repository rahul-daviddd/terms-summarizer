# Terms Summarizer

A Chrome extension + Spring Boot backend that extracts Terms & Conditions text from the current page and summarizes it using the Gemini API.

## NOTE: Apache Maven is required to run this project. Download it from https://maven.apache.org/download.cgi and extract the contents to a folder. Add the bin folder to your system PATH. Restart your IDE.

## Step-by-step setup

1. Clone the repo
```bash
git clone https://github.com/rahul-daviddd/terms-summarizer.git
cd terms-summarizer
```

2. Set your Gemini API key (PowerShell)
API key must be loaded everytime you open a new terminal.
```powershell
$env:GEMINI_API_KEY="your_gemini_key_here"

3. Run the backend
```powershell
cd backend
mvn spring-boot:run
```

4. Load the Chrome extension
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension` folder from this repo

5. Use it
1. Open any page with Terms/Privacy text
2. Click the extension icon
3. Press **Analyze**

## Troubleshooting

- **500 error**: Check the backend terminal for the exact error message.
- **Missing key**: Make sure `GEMINI_API_KEY` is set in the same terminal where you run Maven.
- **Timeouts**: Try analyzing a shorter page or refresh and retry.

