import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function EditEntry() {
  const { currentUser } = useAuth();
  const { entryId } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState({
    title: "",
    mood: "",
    content: "",
    prompt: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntry() {
      const entryRef = doc(db, "users", currentUser.uid, "entries", entryId);
      const snapshot = await getDoc(entryRef);

      if (snapshot.exists()) {
        setEntry(snapshot.data());
      }

      setLoading(false);
    }

    loadEntry();
  }, [currentUser, entryId]);

  function handleChange(e) {
    setEntry({
      ...entry,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const entryRef = doc(db, "users", currentUser.uid, "entries", entryId);

    await updateDoc(entryRef, {
      title: entry.title,
      mood: entry.mood,
      content: entry.content,
      updatedAt: serverTimestamp(),
    });

    navigate("/dashboard");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page">
          <p>Loading entry...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page narrow">
        <form className="editor-card" onSubmit={handleSubmit}>
          <p className="eyebrow">Original Prompt</p>
          <h2>{entry.prompt || "No prompt saved"}</h2>

          <label>Title</label>
          <input
            name="title"
            value={entry.title}
            onChange={handleChange}
            required
          />

          <label>Mood</label>
          <input name="mood" value={entry.mood} onChange={handleChange} />

          <label>Journal Entry</label>
          <textarea
            name="content"
            value={entry.content}
            onChange={handleChange}
            rows="12"
            required
          />

          <button className="button primary full">Update Entry</button>
        </form>
      </main>
    </>
  );
}