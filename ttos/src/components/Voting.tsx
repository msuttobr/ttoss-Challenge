import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/apiClient";
import styles from './videoCard.module.css';
import { Link } from "react-router-dom";

type VideoBattle = {
  id: string;
  title: string;
  url: string;
  rating: number;
  probability: number;
  disputedWinLoser: number[];
};

const VideoCard = ({ video, index, onVote }: { video: VideoBattle, index: number, onVote: (index: number) => void }) => (
  <div className={styles.videoCard}>
    <iframe
      className={styles.iframe}
      src={`https://www.youtube.com/embed/${video.url}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
    <div className={styles.content}>
      <h3 className={styles.h3}>{video.title}</h3>
      <p>Probabilidade: {(video.probability * 100).toFixed(2)}%</p>
      <p>Avaliação: {video.rating}&nbsp;
        <span style={{ color: "green" }}>+{video.disputedWinLoser[0]}</span>&nbsp;
        <span style={{ color: "red" }}>-{video.disputedWinLoser[1]}</span>
      </p>
    </div>
    <button className={styles.button} onClick={() => onVote(index)}>Votar</button>
  </div>
);

const VotingPage = () => {
  const [videos, setVideos] = useState<VideoBattle[]>([]);
  const [nextBattle, setNextBattle] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    setError(null);
    try {
      const response = await apiClient.get<VideoBattle[]>('battle');
      setVideos(response.data);
    } catch (err) {
      setError("Erro ao buscar vídeos. Tente novamente.");
      console.error("Erro ao buscar vídeos", err);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [nextBattle, fetchVideos]);

  const handleVote = async (index: number) => {
    let result = [0, 0];
    result[index] = 1;

    try {
      await apiClient.post('vote', {
        result: result,
        videos: videos
      });
      setNextBattle(!nextBattle);
    } catch (err) {
      setError("Erro ao registrar voto. Tente novamente.");
      console.error("Erro ao registrar voto", err);
    }
  };

  return (
    <div className={styles.center}>
      <h1>Vote no Melhor Vídeo</h1>
      <Link to="/ranking" style={{ color: 'red' }}>Clique aqui para ver o Ranking</Link>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!videos.length ? (
        <p>Carregando vídeos...</p>
      ) : (
        <div className={styles.container}>
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} onVote={handleVote} />
          ))}
        </div>
      )}
    </div>
  );
}

export default VotingPage;