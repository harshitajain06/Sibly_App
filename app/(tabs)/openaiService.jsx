// openaiService.js
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // import your Firestore instance

let cachedApiKey = null;

const getApiKeyFromFirestore = async () => {
  if (cachedApiKey) return cachedApiKey;

  const docRef = doc(db, 'config', 'openai');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    cachedApiKey = docSnap.data().apiKey;
    return cachedApiKey;
  } else {
    throw new Error("API key not found in Firestore.");
  }
};

export const createCompletion = async (messages) => {
  try {
    const apiKey = await getApiKeyFromFirestore();

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages,
        temperature: 0.5,
        max_tokens: 500,
        top_p: 1,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error('Error creating completion:', error);
    throw error;
  }
};
