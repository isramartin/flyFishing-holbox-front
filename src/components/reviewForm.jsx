import React, { useState } from "react";
import imagen1 from '../assets/image/image1.png';
import "../styles/review.css";



const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [group, setGroup] = useState(null);



  const groups = [ "Parejas", "Familia", "Amigos", "Solo"];
  const ratingLabels = ["Pésimo", "Malo", "Bueno", "Muy bueno", "Excelente"];

  const handleRating = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    if (!review.trim() || !title.trim() || !date || !group) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newReview = {
      rating,
      title,
      review,
      date,
      group,
    };

    onSubmit(newReview);

    setRating(0);
    setReview("");
    setTitle("");
    setDate("");
    setGroup(null);
  };

  return (
  
      <div className="review-box">
        <h2>¿Cómo calificarías tu experiencia?</h2>
        <div className="star-rating">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={index < (hover || rating) ? "star selected" : "star"}
              onClick={() => handleRating(index)}
              onMouseEnter={() => setHover(index + 1)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
          <p className="rating-text">
            {hover > 0 ? ratingLabels[hover - 1] : rating > 0 ? ratingLabels[rating - 1] : "Selecciona una calificación"}
          </p>
        </div>

        <label>¿Cuándo fuiste?</label>
        <select value={date} onChange={(e) => setDate(e.target.value)}>
          <option value="">Seleccione una opción</option>
          <option value="Enero">Enero</option>
          <option value="Febrero">Febrero</option>
          <option value="Marzo">Marzo</option>
        </select>

        <label>¿Con quién fuiste?</label>
        <div className="group-selection">
          {groups.map((g) => (
            <button
              key={g}
              className={group === g ? "selected" : ""}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <label>Título de tu opinión</label>
        <input
          type="text"
          placeholder="Cuéntanos un poco sobre tu experiencia"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Escribe tu opinión</label>
        <textarea
          placeholder="Escribe tu reseña..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <button onClick={handleSubmit}>Enviar Reseña</button>
      </div>
     
  );
};

export default ReviewForm;
