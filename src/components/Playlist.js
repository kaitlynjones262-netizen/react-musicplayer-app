import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { songs } from "../data/songs";

export default function Playlist() {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const songsPerPage = 10;

  // ✅ Filter FIRST
  const filteredSongs = songs.filter((song) =>
    song.name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Then paginate
  const startIndex = page * songsPerPage;
  const endIndex = startIndex + songsPerPage;
  const currentSongs = filteredSongs.slice(startIndex, endIndex);

  const handleSongClick = (index) => {
    navigate("/player", { state: { index } });
  };

  const handleNext = () => {
    if (endIndex < filteredSongs.length) {
      setPage(page + 1);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div id="playlist">
      <div className="searchbar">
        <input
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0); // ✅ reset page when searching
          }}
        />
      </div>

      <h2>Playlist</h2>

      {/* ✅ No results message */}
      {filteredSongs.length === 0 && (
        <p style={{ color: "white", padding: "10px" }}>
          No songs found
        </p>
      )}

      <ul>
        {currentSongs.map((song, idx) => (
          <li
            key={startIndex + idx}
            className="item"
            onClick={() => handleSongClick(startIndex + idx)}
          >
            {song.name}
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button onClick={handlePrev} disabled={page === 0}>
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={endIndex >= filteredSongs.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}