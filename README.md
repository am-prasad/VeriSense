# VeriSense: AI-Powered Misinformation Detection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

VeriSense is a full-stack web application designed to combat misinformation by providing real-time claim verification. It uses a sophisticated backend powered by FastAPI and a suite of AI and machine learning tools to analyze text and voice inputs, gather evidence from trusted sources, and deliver a reasoned verdict on the authenticity of a claim.

The frontend is a modern and responsive dashboard built with React, Vite, and Shadcn UI, offering a seamless user experience for verifying claims, viewing a live feed of information, and visualizing the "chain of trust" for each verification.

## ✨ Features

* **Claim Extraction**: Automatically identifies verifiable claims from larger blocks of text using Natural Language Processing (NLP).
* **Multi-Source Evidence Gathering**: Fetches data from a wide range of sources to build a comprehensive evidence base, including:
    * **News APIs**: NewsAPI, Newsdata.io, and PIB RSS Feeds.
    * **Social Media**: Reddit and Twitter.
    * **Fact-Checking Services**: Google Fact Check API.
* **AI-Powered Reasoning**: Utilizes Large Language Models via the Groq API to analyze claims against the gathered evidence and provide a clear verdict (`True`, `False`, `Needs Review`) with a confidence score.
* **Voice Input Processing**: Supports audio uploads for verification, with Speech-to-Text (STT) and Text-to-Speech (TTS) capabilities.
* **Interactive Frontend**: A beautiful and intuitive user interface built with React, Vite, Shadcn UI, and Tailwind CSS, featuring:
    * Protected routes and user authentication with Firebase (Email/Password, Google, GitHub).
    * A live feed of claims from news and social media.
    * A "Chain of Trust" visualizer to trace the path of verification.
    * Export verification reports to PDF.

## 🛠️ Tech Stack

| Component      | Technology                                                      |
| :------------- | :-------------------------------------------------------------- |
| **Backend** | Python, FastAPI, Uvicorn, spaCy, PyTorch, Groq API              |
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion |
| **Auth** | Firebase Authentication                                         |
| **Database** | Firestore (for user data)                                       |
| **Deployment** | (Not specified, but ready for containerization)                 |

---

## 🚀 Getting Started

Follow these instructions to get a local copy of VeriSense up and running for development and testing purposes.

### Prerequisites

* **Node.js** (v18.x or later)
* **Python** (v3.9 or later) with `pip`
* **Bun** (for frontend package management)
* **Git**

### 🔑 API Keys

This project relies on several external APIs. You will need to obtain API keys for each and place them in a `.env` file in the `backend/` directory.

1.  Create the environment file:
    ```bash
    touch backend/.env
    ```

2.  Add the following keys to your `backend/.env` file. Click the links to get your own keys.

    ```env
    # News & Fact-Checking APIs
    NEWS_API_KEY="your_key_here"              # Get from: [https://newsapi.org/](https://newsapi.org/)
    NEWSDATA_API_KEY="your_key_here"          # Get from: [https://newsdata.io/](https://newsdata.io/)
    GOOGLE_FACTCHECK_API_KEY="your_key_here"  # Get from: [https://developers.google.com/fact-check/tools/api](https://developers.google.com/fact-check/tools/api)
    
    # Social Media APIs
    REDDIT_CLIENT_ID="your_key_here"          # Get from: [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
    REDDIT_SECRET="your_key_here"             # Get from: [https://www.reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
    TWITTER_BEARER_TOKEN="your_key_here"      # Get from: [https://developer.twitter.com/en/portal/dashboard](https://developer.twitter.com/en/portal/dashboard)
    
    # AI & ML Model APIs
    GROQ_API_KEY="your_key_here"              # Get from: [https://console.groq.com/keys](https://console.groq.com/keys)
    HUGGINGFACE_API_KEY="your_key_here"       # Get from: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
    OPENAI_API_KEY="your_key_here"            # Get from: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    GOOGLE_GEMINI_API_KEY="your_key_here"     # Get from: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
    ```

3.  **Firebase Keys** (for the frontend):
    * Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    * Enable Email/Password, Google, and GitHub sign-in methods in the Authentication section.
    * Create a file named `frontend/.env.local`.
    * Add your Firebase project configuration to it:
        ```env
        VITE_FIREBASE_API_KEY="your_key_here"
        VITE_FIREBASE_AUTH_DOMAIN="your_project_id.firebaseapp.com"
        VITE_FIREBASE_PROJECT_ID="your_project_id"
        VITE_FIREBASE_STORAGE_BUCKET="your_project_id.appspot.com"
        VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
        VITE_FIREBASE_APP_ID="your_app_id"
        ```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/Verisense.git](https://github.com/your-username/Verisense.git)
    cd Verisense
    ```

2.  **Setup the Backend:**
    ```bash
    cd backend
    python -m venv venv
    # Activate the virtual environment
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    # source venv/bin/activate
    pip install -r requirements.txt
    # Download the spaCy model
    python -m spacy download en_core_web_trf
    ```

3.  **Setup the Frontend:**
    ```bash
    cd ../frontend
    bun install
    ```

---

## 🏃‍♂️ Running the Application

You will need to run the backend and frontend servers in two separate terminals.

1.  **Run the Backend Server:**
    * Navigate to the `backend` directory.
    * Make sure your virtual environment is activated.
    * Start the FastAPI server with Uvicorn:
        ```bash
        cd backend
        uvicorn app.main:app --reload --port 8000
        ```
    * The backend will be available at `http://localhost:8000`.

2.  **Run the Frontend Development Server:**
    * Navigate to the `frontend` directory.
    * Start the Vite development server:
        ```bash
        cd frontend
        bun run dev
        ```
    * The frontend application will be available at `http://localhost:8080`.

## 📂 Project Structure

The project is organized into two main directories: `backend` and `frontend`.



```
Verisense/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── endpoints/  # API routes (claims, news, etc.)
│   │   ├── services/       # Business logic for external APIs
│   │   └── utils/          # Core utilities (extractor, verifier, etc.)
│   ├── venv/               # Virtual environment (ignored by Git)
│   ├── .env                # API keys and secrets (ignored by Git)
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/         # Images and other assets
    │   ├── components/     # Reusable UI components (Shadcn UI)
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # Utility functions and API clients
    │   └── pages/          # Main page components for routing
    ├── .env.local          # Firebase keys (ignored by Git)
    └── package.json        # Frontend dependencies
```


---

## 👨‍💻 Meet the Team

* **Prasad A M** - [LinkedIn](https://linkedin.com/in/amprasad18)
* **Ningaraju H S**


## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
