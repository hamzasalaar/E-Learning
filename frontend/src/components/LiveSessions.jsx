import React from "react";

const LiveSessionManager = ({
  newSession,
  setNewSession,
  onSubmit,
  liveSessions,
  onJoin,
}) => {
  return (
    <section className="live-session-section">
      <h2>Add Live Session</h2>
      <form onSubmit={onSubmit} className="live-session-form">
        <input
          type="text"
          placeholder="Session Title"
          value={newSession.title}
          onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={newSession.description}
          onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
        />
        <input
          type="datetime-local"
          value={newSession.startTime}
          onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={newSession.duration}
          onChange={(e) => setNewSession({ ...newSession, duration: e.target.value })}
        />
        <button type="submit">Create Session</button>
      </form>

      <h2>Live Sessions</h2>
      {liveSessions.length === 0 ? (
        <p>No sessions yet.</p>
      ) : (
        <ul className="session-list">
          {liveSessions.map((session) => (
            <li key={session._id} className="session-item">
              <strong>{session.title}</strong> – {new Date(session.startTime).toLocaleString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              <p>{session.description}</p>
              <button onClick={() => onJoin(session._id)}>Join Session</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default LiveSessionManager;
