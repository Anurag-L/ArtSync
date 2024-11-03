// src/app/question/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { CSSProperties } from 'react';

const totalImages = 10; // Total number of images

export default function Question() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  
  const [userInput, setUserInput] = useState<string>(''); // Track text input
  const [currentImage, setCurrentImage] = useState(1); // Track current image
  const [responses, setResponses] = useState<any[]>([]); // Store responses for each image

  const handleNext = () => {
    if (userInput) {
      // Save response for the current image
      setResponses((prevResponses) => [
        ...prevResponses,
        { userId, pictureId: currentImage, userInput }
      ]);
      setUserInput(''); // Clear the input for the next image
    }

    // Move to the next image or submit if on the last image
    if (currentImage < totalImages) {
      setCurrentImage(currentImage + 1);
    } else {
      handleSubmit(); // Submit all responses
    }
  };

  const handleSubmit = async () => {
    try {
      // Send the collected responses to the backend
      await axios.post('/api/submit-responses', { responses });
      alert('Responses submitted successfully!');
      router.push('/thank-you'); // Redirect to a thank-you page or wherever you like
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome, {name}!</h1>
      <p style={styles.subtitle}>Your unique ID: {userId}</p>
      <div style={styles.imageContainer}>
        <Image
          src={`/data/picture${currentImage}.jpeg`} // Display the current image
          alt={`Artwork ${currentImage}`}
          width={500}
          height={500}
          style={styles.image}
        />
      </div>
      <p style={styles.instruction}>What do you feel when you see this?</p>

      {/* Text Input Section */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your response here"
          style={styles.textInput}
        />
      </div>

      <button onClick={handleNext} style={styles.button}>
        {currentImage === totalImages ? 'Submit' : 'Next'}
      </button>

      {/* Display all responses */}
      <div style={styles.responsesContainer}>
        <h2>Responses so far:</h2>
        {responses.map((response, index) => (
          <p key={index}>
            Picture {response.pictureId}: {response.userInput}
          </p>
        ))}
      </div>
    </div>
  );
}

// Define styles with CSSProperties for TypeScript compatibility
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column' as CSSProperties['flexDirection'],
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#1a1a2e',
    color: '#ffcc00',
    fontFamily: 'Press Start 2P, cursive',
    minHeight: '100vh',
  },
  title: {
    fontSize: '2rem',
    margin: '20px 0',
    textShadow: '4px 4px #ff0055',
  },
  subtitle: {
    fontSize: '1rem',
    marginBottom: '20px',
  },
  imageContainer: {
    border: '5px solid #ffcc00',
    padding: '10px',
    margin: '20px',
  },
  image: {
    borderRadius: '8px',
  },
  instruction: {
    fontSize: '1.2rem',
    marginTop: '20px',
    textAlign: 'center' as CSSProperties['textAlign'],
  },
  inputContainer: {
    marginTop: '20px',
    textAlign: 'center' as CSSProperties['textAlign'],
  },
  textInput: {
    padding: '10px',
    fontSize: '1rem',
    width: '80%',
    maxWidth: '400px',
    borderRadius: '5px',
    border: '2px solid #ffcc00',
    outline: 'none',
    color: '#1a1a2e',
    backgroundColor: '#fff',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#1a1a2e',
    backgroundColor: '#ffcc00',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textShadow: '2px 2px #000',
    marginTop: '20px',
  },
  responsesContainer: {
    marginTop: '30px',
    width: '80%',
    color: '#ffffff',
    backgroundColor: '#333',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'left' as CSSProperties['textAlign'],
  },
};
