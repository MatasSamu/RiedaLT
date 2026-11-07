
const STORAGE_KEY = "riedalt_reviews";

export function getReviews() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
}

export function addReview(review) {
  const reviews = getReviews();

  const newReview = {
    ...review,
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
  };

  saveReviews([newReview, ...reviews]);
  return newReview;
}

export function updateReview(id, userId, changes) {
  const reviews = getReviews();
  const review = reviews.find((r) => r.id === id);

  if (!review || String(review.userId) !== String(userId)) {
    throw new Error("Negalite redaguoti šio atsiliepimo.");
  }

  saveReviews(
    reviews.map((r) =>
      r.id === id
        ? { ...r, rating: changes.rating, comment: changes.comment }
        : r
    )
  );
}

export function deleteReview(id, userId) {
  const reviews = getReviews();
  const review = reviews.find((r) => r.id === id);

  if (!review || String(review.userId) !== String(userId)) {
    throw new Error("Negalite ištrinti šio atsiliepimo.");
  }

  saveReviews(reviews.filter((r) => r.id !== id));
}
