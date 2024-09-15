# Linguist

Linguist is a full-stack application designed to help users understand videos with poor audio quality. By leveraging advanced AI technologies, Linguist enhances the accessibility and comprehension of video content.

![image](https://github.com/user-attachments/assets/2bdf4829-9f41-4d21-a6fe-414135051f7a)

## Features

- Video upload and processing
- Audio enhancement and transcription
- Intelligent summarization of video content
- User-friendly interface for interacting with processed videos

## Technologies Used

- Frontend: React.js
- Backend: Convex
- AI Services:
  - Cohere API for natural language processing
  - Symphony AI for audio enhancement
- Database: Convex's built-in database

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14 or later)
- npm (v6 or later)
- Convex account
- Cohere API key
- Symphony AI API access

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/linguist.git
   cd linguist
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_CONVEX_URL=your_convex_deployment_url
   COHERE_API_KEY=your_cohere_api_key
   SYMPHONY_AI_API_KEY=your_symphony_ai_api_key
   ```

4. Initialize Convex:
   ```
   npx convex dev
   ```

## Usage

1. Start the development server:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

3. Upload a video with poor audio quality.

4. Wait for Linguist to process the video and provide enhanced audio, transcription, and summary.

5. Interact with the processed video content through the user interface.

## Contributing

Contributions to Linguist are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or feedback, please reach out to [Your Name] at [your.email@example.com].

## Acknowledgements

- [Convex](https://www.convex.dev/) for backend and database services
- [Cohere](https://cohere.ai/) for natural language processing capabilities
- [Symphony AI](https://symphonyai.com/) for audio enhancement technology

---

Built during Hack the North 2024.
