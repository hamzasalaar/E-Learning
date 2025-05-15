import React, { useEffect, useState } from "react";
import { FaPlay } from "react-icons/fa";
import axios from "axios";

const RecordingList = ({ liveSessions = [] }) => {
  const [recordingList, setRecordingList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecordings = async () => {
      setLoading(true);
      try {
        const all = await Promise.all(
          liveSessions
            .filter((session) => session.willBeRecorded)
            .map(async (session) => {
              const res = await axios.get(
                `http://localhost:3000/api/teacher/recordings/${session.meetingID}`,
                { withCredentials: true }
              );
              return res.data.recordings.map((rec) => ({
                ...rec,
                sessionTitle: session.title,
                playbackUrl: rec.playback?.format?.url || "#",
                startTime: new Date(Number(rec.startTime)).toLocaleString(),
                endTime: new Date(Number(rec.endTime)).toLocaleString(),
              }));
            })
        );
        setRecordingList(all.flat());
        setLoading(false);
      } catch (err) {
        console.error("Error fetching recordings", err);
      }
    };

    if (liveSessions && liveSessions.length > 0) {
      fetchRecordings();
    }
  }, [liveSessions]);

  return (
    <section className="recordings-section">
      <h2>Recorded Sessions</h2>
      {loading ? (
        <p>Loading recordings...</p>
      ) : recordingList.length === 0 ? (
        <p>No recordings available yet.</p>
      ) : (
        <ul className="recordings-list">
          {recordingList.map((rec) => (
            <li key={rec.recordID} className="recording-item">
              <strong>{rec.sessionTitle}</strong>
              <p>
                🕒 {rec.startTime} → {rec.endTime}
              </p>
              <a
                href={rec.playbackUrl}
                target="_blank"
                rel="noreferrer"
                className="playback-link"
              >
                <FaPlay /> Watch Recording
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default RecordingList;
