import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { songs } from "../data/songs";

function Player() {
    const location = useLocation();
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const touchStartX = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(location.state?.index || 0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.5);

    const currentSong = songs[currentIndex];

    // Progress update
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };

        audio.addEventListener("timeupdate", updateProgress);
        return () => audio.removeEventListener("timeupdate", updateProgress);
    }, [currentIndex]);

    // Autoplay new song
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.pause();
        audio.load();
        audio.volume = volume;

        audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Autoplay blocked:", err));
    }, [currentIndex]);

    // Play/pause toggle
    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
        } else {
        audio.play();
        setIsPlaying(true);
        }
    };

    // Seek
    const handleSeek = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = (e.target.value / 100) * audio.duration;
        setProgress(e.target.value);
    };

    // Volume
    const handleVolume = (e) => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = e.target.value;
        setVolume(e.target.value);
    };

    // Swipe handlers
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchEndX - touchStartX.current;

        if (diff > 50) playPrevious();
        else if (diff < -50) playNext();

        touchStartX.current = null;
    };

    const playNext = () => setCurrentIndex((prev) => (prev + 1) % songs.length);
    const playPrevious = () => setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);

    return (
        <section id="Mplayer">
        <button id="backBTN" onClick={() => navigate("/")}>Go back</button>

        <h2 id="Songname">{currentSong.name}</h2>

        <div
            id="album"
            onClick={togglePlay}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img src={currentSong.cover || "/images/cover.jpg"} alt={currentSong.name} />
        </div>

        <audio ref={audioRef} src={currentSong.file}></audio>

        <div className="slider">
            <label>Progress:</label>
            <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            />
        </div>

        <div className="slider">
            <label>Volume:</label>
            <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            />
        </div>
        </section>
    );
}

export default Player;