import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Amplify } from "aws-amplify";

// Import component CSS
import "./components/ItemEditor.css";
import "./components/ExamItemsList.css";

// Configure Amplify
Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://example.com/graphql',
      apiKey: 'example-api-key',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey'
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
