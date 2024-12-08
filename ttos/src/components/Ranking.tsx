import { useState, useEffect, useCallback } from "react";
import io from 'socket.io-client';
import apiClient from "../services/apiClient";
import styles from "./ranking.module.css";

type VideoRanking = {
  id: string;
  title: string;
  rating: number;
  url: string;
}

const socket = io('http://localhost:5000', {
  transports: ['websocket']
});

function RankingPage() {
  const [videos, setVideos] = useState<VideoRanking[]>([]);

  const fetchRankings = useCallback(async () => {
    try {
      const response = (await apiClient.get<VideoRanking[]>("ranking")).data;
      setVideos(response);
    } catch (error) {
      console.error("Erro ao buscar classificações", error);
    }
  }, [])

  useEffect(() => {
    fetchRankings();

    socket.on('rankingUpdate', (newVideos: VideoRanking[]) => {
      setVideos(newVideos);
    });

    return () => {
      socket.off('rankingUpdate');
    };
  }, []);

  return (
    <div className={styles.center}>
      <h1>Classificação dos Vídeos</h1>
      {!videos.length ? (
        <p>Carregando vídeos...</p>
      ) : (
        <div className={styles.card}>
          {videos.map((video, index) => (
            <div key={video.id}>
              <a href={`https://www.youtube.com/embed/${video.url}`} className={styles.cardItem}>
                <img className={styles.image} src={`https://i.ytimg.com/vi/${video.url}/hqdefault.jpg`} alt="" />
                <div className={styles.text}>
                  <div className={styles.rank} style={{
                    backgroundColor: index === 0 ? 'darkgoldenrod' : index === 1 ? 'hsl(0deg 0% 40%)' : index === 2 ? '#7b4c1e' : 'hsl(0 0% 50% / 1)',
                  }}>
                    <p>Rating: {video.rating}</p>
                    <p>{index + 1}° Lugar</p>
                  </div>
                  <div className={styles.title}>{video.title}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RankingPage;