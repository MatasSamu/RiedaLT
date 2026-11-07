
import { useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../../services/authService";
import { getCars } from "../../services/carService";
import {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} from "../../services/reviewService";
import "./Reviews.css";

function Reviews() {
  const user = getCurrentUser();
  const [cars] = useState(getCars);
  const [reviews, setReviews] = useState(getReviews);

  const [carId, setCarId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  function refreshReviews() {
    setReviews(getReviews());
  }

  function resetForm() {
    setCarId("");
    setRating(5);
    setComment("");
    setEditingId(null);
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Norėdami palikti atsiliepimą, prisijunkite.");
      return;
    }

    if (!editingId && !carId) {
      setError("Pasirinkite automobilį.");
      return;
    }

    if (!comment.trim()) {
      setError("Įrašykite atsiliepimą.");
      return;
    }

    try {
      if (editingId) {
        updateReview(editingId, user.id, {
          rating: Number(rating),
          comment: comment.trim(),
        });
      } else {
        addReview({
          userId: user.id,
          userName:
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            user.email ||
            "Klientas",
          carId: Number(carId),
          rating: Number(rating),
          comment: comment.trim(),
        });
      }

      refreshReviews();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEdit(review) {
    setEditingId(review.id);
    setCarId(String(review.carId));
    setRating(Number(review.rating));
    setComment(review.comment);
    setError("");

    document
      .getElementById("reviews-form")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleDelete(review) {
    if (!window.confirm("Ar tikrai norite ištrinti atsiliepimą?")) {
      return;
    }

    try {
      deleteReview(review.id, user.id);
      refreshReviews();

      if (editingId === review.id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    }
  }

  function getCarName(id) {
    const car = cars.find((item) => String(item.id) === String(id));

    return car
      ? `${car.manufacturer || car.brand} ${car.model}`
      : "Automobilis";
  }

  function renderStars(value) {
    return (
      <span className="reviews-stars" aria-label={`${value} iš 5 žvaigždučių`}>
        {"★".repeat(Number(value))}
        <span className="reviews-stars-empty">
          {"☆".repeat(5 - Number(value))}
        </span>
      </span>
    );
  }

  return (
    <main className="page-container reviews-page">
      <section className="page-heading">
        <p className="home-subtitle">KLIENTŲ PATIRTYS</p>
        <h1>Atsiliepimai</h1>
        <p className="page-description">
          Sužinokite, ką apie RiedaLT automobilius mano mūsų klientai.
          Pasidalinkite ir savo patirtimi.
        </p>
      </section>

      <section className="reviews-summary">
        <div className="reviews-summary-score">
          <strong>{average}</strong>
          <div>
            {renderStars(Math.round(Number(average)))}
            <p>Vidutinis klientų įvertinimas</p>
          </div>
        </div>

        <div className="reviews-summary-count">
          <strong>{reviews.length}</strong>
          <span>
            {reviews.length === 1 ? "Atsiliepimas" : "Atsiliepimai"}
          </span>
        </div>
      </section>

      <section className="reviews-form-card" id="reviews-form">
        <div className="reviews-section-heading">
          <p className="home-subtitle">PASIDALINKITE PATIRTIMI</p>
          <h2>
            {editingId ? "Redaguoti atsiliepimą" : "Palikti atsiliepimą"}
          </h2>
        </div>

        {!user ? (
          <div className="reviews-login-message">
            <p>
              Norėdami parašyti atsiliepimą, pirmiausia prisijunkite
              prie savo paskyros.
            </p>
            <Link to="/login" className="primary-button">
              Prisijungti
            </Link>
          </div>
        ) : (
          <form className="reviews-form" onSubmit={handleSubmit}>
            <div className="reviews-form-row">
              <div className="reviews-field">
                <label htmlFor="review-car">Automobilis</label>
                <select
                  id="review-car"
                  value={carId}
                  onChange={(e) => setCarId(e.target.value)}
                  disabled={editingId !== null}
                  required
                >
                  <option value="">Pasirinkite automobilį</option>
                  {cars.map((car) => (
                    <option key={car.id} value={car.id}>
                      {car.manufacturer || car.brand} {car.model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="reviews-field">
                <label htmlFor="review-rating">Įvertinimas</label>
                <select
                  id="review-rating"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={5}>★★★★★ – Puikiai</option>
                  <option value={4}>★★★★☆ – Labai gerai</option>
                  <option value={3}>★★★☆☆ – Gerai</option>
                  <option value={2}>★★☆☆☆ – Vidutiniškai</option>
                  <option value={1}>★☆☆☆☆ – Prastai</option>
                </select>
              </div>
            </div>

            <div className="reviews-field">
              <label htmlFor="review-comment">Jūsų atsiliepimas</label>
              <textarea
                id="review-comment"
                rows={5}
                maxLength={1000}
                placeholder="Papasakokite apie savo patirtį..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <span className="reviews-character-count">
                {comment.length}/1000
              </span>
            </div>

            {error && <p className="reviews-error">{error}</p>}

            <div className="reviews-form-actions">
              <button type="submit" className="primary-button">
                {editingId ? "Išsaugoti pakeitimus" : "Paskelbti atsiliepimą"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="reviews-cancel-button"
                  onClick={resetForm}
                >
                  Atšaukti
                </button>
              )}
            </div>
          </form>
        )}
      </section>

      <section className="reviews-list-section">
        <div className="reviews-section-heading">
          <p className="home-subtitle">KĄ SAKO KLIENTAI</p>
          <h2>Visi atsiliepimai</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="reviews-empty">
            <span>☆</span>
            <h3>Atsiliepimų dar nėra</h3>
            <p>Būkite pirmieji, kurie pasidalins savo patirtimi!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => {
              const isOwner =
                user && String(user.id) === String(review.userId);

              return (
                <article className="review-card" key={review.id}>
                  <div className="review-card-top">
                    <div className="review-author">
                      <div className="review-avatar">
                        {(review.userName || "K").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3>{review.userName || "Klientas"}</h3>
                        <span>
                          {new Date(review.date).toLocaleDateString("lt-LT")}
                        </span>
                      </div>
                    </div>

                    {renderStars(review.rating)}
                  </div>

                  <div className="review-car">
                    {getCarName(review.carId)}
                  </div>

                  <p className="review-comment">{review.comment}</p>

                  {isOwner && (
                    <div className="review-actions">
                      <button
                        type="button"
                        onClick={() => handleEdit(review)}
                      >
                        Redaguoti
                      </button>
                      <button
                        type="button"
                        className="review-delete-button"
                        onClick={() => handleDelete(review)}
                      >
                        Ištrinti
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Reviews;
