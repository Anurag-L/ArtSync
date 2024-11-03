// src/app/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { CSSProperties } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleStart = () => {
    const userId = uuidv4();
    router.push(`/question?userId=${userId}&name=${name}&artworkId=1`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🎮 Art Affinity Arcade 🎮</h1>
      <p style={styles.subtitle}>Enter your name to start</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        style={styles.input}
      />
      <button onClick={handleStart} style={styles.button}>
        Start
      </button>
    </div>
  );
}

// TypeScript-compatible style definitions
const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#ffcc00',
    fontFamily: 'Press Start 2P, cursive',
  },
  title: {
    fontSize: '3rem',
    margin: '20px 0',
    textShadow: '4px 4px #ff0055',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '1rem',
    textAlign: 'center' as CSSProperties['textAlign'],  // Specify TextAlign type
    marginBottom: '20px',
    borderRadius: '5px',
    border: '2px solid #ffcc00',
    outline: 'none',
  },
  button: {
    padding: '10px 20px',
    fontSize: '1.2rem',
    color: '#1a1a2e',
    backgroundColor: '#ffcc00',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textShadow: '2px 2px #000',
  },
};
