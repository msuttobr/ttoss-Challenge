import { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import io from 'socket.io-client';

type VideoRanking = {
  id: string;
  title: string;
  rating: number;
}

const socket = io('http://localhost:5000', {
  transports: ['websocket']
});

function RankingPage() {
  const [videos, setVideos] = useState<VideoRanking[]>([]);

  const fetchRankings = useCallback(async () => {
    try {
      const response = (await axios.get<VideoRanking[]>("http://localhost:5000/api/videos/ranking")).data;
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
    <div>
      <h1>Classificação dos Vídeos</h1>
      {!videos.length ? (
        <p>Carregando vídeos...</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              {video.title} - Classificação: {video.rating}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RankingPage;