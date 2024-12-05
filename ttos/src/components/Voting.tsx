import { useState, useEffect } from "react";
import axios from "axios";

type VideoBattle = {
  id: string;
  title: string;
  url: string;
  rating: number;
  probability: number;
};

const VotingPage = () => {
  const [videos, setVideos] = useState<VideoBattle[]>([]);
  const [nextBattle, setNextBattle] = useState(true);

  const fetchVideos = async () => {
    try {
      const response = (await axios.get<VideoBattle[]>("http://localhost:5000/api/videos/battle")).data;
      setVideos(response);

    } catch (error) {
      console.error("Erro ao buscar vídeos", error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [nextBattle]);

  const handleVote = async (index: number) => {
    let result = [0, 0];

    result[index] = 1;
    try {
      await axios.post("http://localhost:5000/api/videos/vote", {
        result: result,
        videos: videos
      });
      setNextBattle(!nextBattle)
    } catch (error) {
      console.error("Erro ao registrar voto", error);
    }
  };

  return (
    <div>
      <h1>Vote no Melhor Vídeo</h1>
      {!videos.length ? (
        <p>Carregando vídeos...</p>
      ) : (
        <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
          {videos.map((video, index) => (
            <div key={video.id} style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
              <h3>{video.title}</h3>
              <div>probabilidade: {(video.probability * 100).toFixed(2)}%</div>
              <div>rating: {video.rating}</div>
              <iframe
                width="400"
                height="300"
                src={`${video.url}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen></iframe>
              <button onClick={() => handleVote(index)}>Vencedor</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VotingPage;