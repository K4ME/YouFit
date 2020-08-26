import React, { useEffect, useState } from "react";
//import io from "socket.io-client";
import { Link } from "react-router-dom";

import "./Main.css";

import logo from "../assets/YouFit.svg";
import usuario from "../assets/usuario.svg";
import like from "../assets/like.svg";
import dislike from "../assets/dislike.svg";
//import itsamatch from "../assets/itsamatch.png";
import api from "../services/api";

export default function Main({ match }) {
  const [trainers, setTrainers] = useState([]);
  const [trainersId, setTrainersId] = useState([]);
  // const [matchDev, setMatchDev] = useState(false);

  useEffect(() => {
    async function loadTtrainersID() {
      const responseId = await api.get(`/user/consult/${match.params.id}`, {});
      let newLikes = responseId.data[0].likes;
      console.log(newLikes);
    }

    async function loadTtrainers() {
      const response = await api.get(`/trainer/${match.params.id}`, {});
      if (trainers == "") setTrainers(response.data);
      // else
      //   setTrainers(trainers.filter((trainers) => trainers.id !== trainersId));
    }
    loadTtrainers();
  }, []);
  /*
  useEffect(() => {
    const socket = io("http://localhost:3333", {
      query: {
        user: match.params.id,
      },
    });

    socket.on("match", (dev) => {
      setMatchDev(dev);
    });
  }, [match.params.id]);
*/

  async function handleLike(id) {
    await api.put(`/user/likes/${id}`, {
      studentId: match.params.id,
    });

    //setTrainersId(id);
    setTrainers(trainers.filter((trainers) => trainers.id !== id));
  }

  async function handleDislike(id) {
    await api.put(`/user/dislikes/${id}`, {
      studentId: match.params.id,
    });

    //setTrainersId(id);
    setTrainers(trainers.filter((trainer) => trainer.id !== id));
  }

  return (
    <>
      <Link to={`/myTrainers/${match.params.id}`}>
        <button className="btnTrainers" type="button">
          Meus treinadores
        </button>
      </Link>
      <div className="main-container">
        <Link to="/">
          <img src={logo} alt="Logo YouFit" />
        </Link>

        {trainers.length > 0 ? (
          <ul>
            {trainers.map((trainer) => (
              <li key={trainer.id}>
                {trainer.avatar == "" ? (
                  <img src={usuario} alt={trainer.name} />
                ) : (
                  <img src={trainer.avatar} alt={trainer.name} />
                )}

                <footer>
                  <strong>{trainer.name}</strong>
                  <p>{trainer.biograph}</p>
                </footer>

                <div className="buttons">
                  <button
                    type="button"
                    onClick={() => handleDislike(trainer.id)}
                  >
                    <img src={dislike} alt="Dislike" />
                  </button>

                  <button type="button" onClick={() => handleLike(trainer.id)}>
                    <img src={like} alt="Like" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty">Sem Trainers no momento!</div>
        )}

        {/*matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="" />

          <img className="avatar" src={matchDev.avatar} alt="" />
          <strong>{matchDev.name}</strong>
          <p>{matchDev.bio}</p>

          <button type="button" onClick={() => setMatchDev(false)}>
            Fechar
          </button>
        </div>
      )*/}
      </div>
    </>
  );
}
