import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./MyTrainers.css";

import logo from "../assets/YouFit.svg";
import usuario from "../assets/usuario.svg";
import whatsappIcon from "../assets/whatsapp.svg";

import api from "../services/api";

export default function Main({ match }) {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    async function loadTtrainers() {
      const response = await api.get(
        `/trainer/mytrainer/${match.params.id}`,
        {}
      );
      if (trainers == "") setTrainers(response.data);
    }
    loadTtrainers();
  }, []);

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
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty">Sem Trainadores no momento!</div>
      )}
    </div>
  );
}
