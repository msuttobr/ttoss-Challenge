import { useState, useEffect } from "react";
import axios from "axios";

type VideoRanking = {
  id: string;
  title: string;
  rating: number;
}

function RankingPage() {
  const [videos, setVideos] = useState<VideoRanking[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number>(5);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRankings();
      setTimeRemaining(5);
    }, 5000);

    const countdown = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  async function fetchRankings() {
    try {
      const response = (await axios.get<VideoRanking[]>("http://localhost:5000/api/videos")).data;
      setVideos(response);
    } catch (error) {
      console.error("Erro ao buscar classificações", error);
    }
  }

  return (
    <div>
      <h1>Classificação dos Vídeos</h1>
      {!videos.length ? (
        <p>Carregando vídeos...</p>
      ) : (
        <>
          <p>Próxima atualização em: {timeRemaining} segundo{timeRemaining !== 1 ? 's' : ''}</p>
          <ul>
            {videos.map((video) => (
              <li key={video.id}>
                {video.title} - Classificação: {video.rating}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default RankingPage;