import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const prompts = [
  "What is one thing you learned about yourself today?",
  "What emotion showed up the strongest today, and why?",
  "What is something you handled better than your old self would have?",
  "What are you avoiding, and what is one small step toward facing it?",
  "What made you feel calm, proud, or grateful today?",
  "What is one thought you want to release before tomorrow?",
  "What choice today moved you closer to the person you want to become?",
  "Where did you show patience, courage, or discipline today?",
  "What would make tomorrow meaningful?",
  "What do you need to forgive yourself for today?",
];

function getDailyPrompt() {
  const today = new Date().toISOString().split("T")[0];

  let hash = 0;

  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % prompts.length;

  return prompts[index];
}

export default function NewEntry() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [entry, setEntry] = useState({
    title: "",
    mood: "",
    content: "",
    prompt: getDailyPrompt(),
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    await addDoc(collection(db, "users", currentUser.uid, "entries"), {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    navigate("/dashboard");
  }

  return (
    <>
      <Navbar />

      <main className="page narrow">
        <form className="editor-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Today’s Prompt</p>
          <h2>{entry.prompt}</h2>

          <label>Title</label>
          <input
            name="title"
            value={entry.title}
            onChange={handleChange}
            required
          />

          <label>Mood</label>
          <input
            name="mood"
            value={entry.mood}
            onChange={handleChange}
            placeholder="Calm, focused, stressed..."
          />

          <label>Journal Entry</label>
          <textarea
            name="content"
            value={entry.content}
            onChange={handleChange}
            rows="12"
            required
            placeholder="Write what is on your mind..."
          />

          <button className="button primary full" disabled={loading}>
            {loading ? "Saving..." : "Save Entry"}
          </button>
        </form>
      </main>
    </>
  );
}