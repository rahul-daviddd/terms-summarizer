# Terms Summarizer

A Chrome extension + Spring Boot backend that extracts Terms & Conditions text from the current page and summarizes it using the Gemini API.

### NOTE: Apache Maven is required to run this project. Download it from https://maven.apache.org/download.cgi and extract the contents to a folder. Add the bin folder to your system PATH. Restart your IDE.

## Step-by-step setup

1\. **Clone the repo**
```bash
git clone https://github.com/rahul-daviddd/terms-summarizer.git
cd terms-summarizer
```

2\. **Set your Gemini API key**

Choose one of the following methods depending on your setup:

**Option A: Temporary (For a single session)**
If you are testing or on a shared PC, load the key directly into your PowerShell session. *You must re-run this command every time you open a new terminal.*
```powershell
$env:GEMINI_API_KEY="your_gemini_key_here"
```

**Option B: Permanent (For trusted PCs, Windows only)**
Add the API key to your system as a User environment variable so you don't have to load it every time:

   1. Press the Windows key, type "Environment Variables", and click "Edit the system environment variables".
   2. Click the "Environment Variables..." button at the bottom.
   3. Under "User variables", click "New..."
   4. Enter the Variable name exactly as `GEMINI_API_KEY` and add your API key as the value.
   5. Save everything, then completely restart your IDE/terminals so the new variable takes effect.

3\. **Run the backend**
```powershell
cd backend
mvn spring-boot:run
```

4\. **Load the Chrome extension**
   1. Open `chrome://extensions`
   2. Enable **Developer mode**
   3. Click **Load unpacked**
   4. Select the `extension` folder from this repo

5\. **Use it**
   1. Open any page with Terms/Privacy text
   2. Click the extension icon
   3. Press **Analyze**

## Troubleshooting

- **500 error**: Check the backend terminal for the exact error message.
- **Missing key**: Make sure the `GEMINI_API_KEY` is loaded in your current terminal session (Option A) or added to your Windows settings and your IDE has been restarted (Option B).
- **Timeouts**: Try analyzing a shorter page or refresh and retry.

