export default function Rating({
  className,
  rating,
}: {
  className?: string;
  rating: string;
}) {
  return (
    <div
      data-testid="ratingContainer"
      className={`ratingContainer ${className}`}
    >
      <div
        data-testid="rating"
        className={`rating ${rating.toLocaleLowerCase()}`}
      >
        <div data-testid="ratingText" className="ratingText">
          {rating}
        </div>
      </div>
    </div>
  );
}
