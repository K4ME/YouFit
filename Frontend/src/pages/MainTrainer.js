import React, { useEffect, useState } from "react";
//import io from "socket.io-client";
import { Link } from "react-router-dom";

import "./Main.css";

import logo from "../assets/YouFit.svg";
import usuario from "../assets/usuario.svg";
import like from "../assets/like.svg";
import dislike from "../assets/dislike.svg";
import whatsappIcon from "../assets/whatsapp.svg";

//import itsamatch from "../assets/itsamatch.png";
import api from "../services/api";

export default function Main({ match }) {
  const [trainers, setTrainers] = useState([]);
  const [likes, setLikes] = useState([like]);

  useEffect(() => {
    async function loadTrainers() {
      const response = await api.get(`/user/${match.params.id}`, {});
      if (trainers == "") setTrainers(response.data);
      console.log(response.data);
    }
    loadTrainers();
  }, []);

  async function handleLike(id) {
    await api.put(`/trainer/addstudent/${match.params.id}`, {
      id: `${id}`,
    });

    setLikes(dislike);
  }

  return (
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
                <button type="button">
                  <a
                    target="_blank"
                    href={`https://wa.me/${trainer.phone}?text=Fomos%20conectados!%20Que%20tipo%20de%20treino%20deseja?`}
                  >
                    <img src={whatsappIcon} alt="Whatsapp" />
                  </a>
                </button>

                <button type="button" onClick={() => handleLike(trainer.id)}>
                  <img src={likes} alt="Like" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Sem Alunos no momento!</div>
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
  );
}
