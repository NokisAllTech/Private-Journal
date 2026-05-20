import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
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

export default function Dashboard() {
  const { currentUser } = useAuth();

  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const entriesRef = collection(db, "users", currentUser.uid, "entries");
    const q = query(entriesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setEntries(data);
    });

    return unsubscribe;
  }, [currentUser]);

  async function handleDelete(entryId) {
    const confirmed = window.confirm("Delete this journal entry?");

    if (!confirmed) return;

    await deleteDoc(doc(db, "users", currentUser.uid, "entries", entryId));
  }

  const filteredEntries = entries.filter((entry) => {
    const text = `${entry.title} ${entry.content} ${entry.mood}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <>
      <Navbar />

      <main className="page">
        <section className="prompt-card">
          <p className="eyebrow">Today’s Reflection Prompt</p>
          <h2>{getDailyPrompt()}</h2>
        </section>

        <section className="section-header">
          <div>
            <h1>Your Journal</h1>
            <p>{entries.length} saved entries</p>
          </div>

          <Link className="button primary" to="/new">
            Write new entry
          </Link>
        </section>

        <input
          className="search-input"
          placeholder="Search entries by title, mood, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <section className="entries-grid">
          {filteredEntries.length === 0 ? (
            <div className="empty-card">
              <h3>No entries found</h3>
              <p>Start by writing your first private reflection.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => (
              <article className="entry-card" key={entry.id}>
                <div className="entry-top">
                  <span className="mood">{entry.mood || "No mood"}</span>

                  <span className="date">
                    {entry.createdAt?.toDate
                      ? entry.createdAt.toDate().toLocaleDateString()
                      : "Just now"}
                  </span>
                </div>

                <h3>{entry.title}</h3>

                <p>
                  {entry.content.slice(0, 160)}
                  {entry.content.length > 160 ? "..." : ""}
                </p>

                <div className="card-actions">
                  <Link className="small-button" to={`/edit/${entry.id}`}>
                    Edit
                  </Link>

                  <button
                    className="small-button danger"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
}