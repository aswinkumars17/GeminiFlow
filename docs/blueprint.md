# **App Name**: GeminiFlow

## Core Features:

- User Authentication: Secure user sign-up and login via Firebase Authentication (Google and email/password).
- Chat Interface: Responsive chat interface with dark theme, displaying messages in a clear, professional layout.
- Message Input: Input field for users to type and send messages.
- Gemini Integration: Use Google's Gemini API as a tool, leveraging mult-turn reasoning and chat memory. Securely process user inputs on the server side (Spring Boot) to generate appropriate responses.
- Chat History: Store and retrieve chat history in Firestore, organized by user ID to persist conversations.
- Real-time Updates: Display messages in real-time using Firebase's Firestore triggers or webhooks for a dynamic chat experience.
- API Security: Secure API calls via Spring Boot backend, preventing direct exposure of the Gemini API key in the client-side code.

## Style Guidelines:

- Background color: Dark gray (#1E1E1E) to establish a professional dark theme.
- Primary color: Soft blue (#64B5F6) for conversational feel, with good contrast against the dark background.
- Accent color: Light blue (#90CAF9) to highlight interactive elements like buttons and links, while maintaining an analogous color scheme.
- Body and headline font: 'Inter', a grotesque sans-serif with a modern, neutral look suitable for both headlines and body text.
- Use minimalist icons from a library like Material Design Icons to represent actions and status, ensuring they are clear and easily recognizable.
- Implement a clean, responsive layout with a clear separation between the chat window, input area, and user information, optimized for both desktop and mobile views.
- Incorporate subtle animations for loading states, message sending, and receiving to enhance the user experience without being distracting.