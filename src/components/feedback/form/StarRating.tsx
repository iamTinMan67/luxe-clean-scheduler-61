
import { Star } from "lucide-react";
import React from "react";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  setFormValue?: (value: number) => void;
}

const StarRating = ({ rating, setRating, setFormValue }: StarRatingProps) => {
  const [hoveredRating, setHoveredRating] = React.useState<number>(0);

  const getRatingText = (rating: number): string => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  return (
    <div className="mb-8 text-center">
      <div className="mt-6 flex justify-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => {
              setRating(star);
              if (setFormValue) setFormValue(star);
            }}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="focus:outline-none transition duration-150"
          >
            <Star
              className={`h-10 w-10 transition-colors ${
                (hoveredRating ? star <= hoveredRating : star <= rating)
                  ? "fill-gold text-gold"
                  : "text-gray-500"
              }`}
            />
          </button>
        ))}
      </div>
      <p className="mt-2 text-gold">
        {getRatingText(rating)}
      </p>
    </div>
  );
};

export default StarRating;
