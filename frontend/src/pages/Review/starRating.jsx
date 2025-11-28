// StarRating.jsx
import React, { useState, useEffect, useRef } from "react";
import "./starRating.css";

/**
 * props:
 * - value: number (현재 값, 예: 3.5)
 * - onChange(newValue: number): 함수
 * - max (optional): 총 별 개수 (기본 5)
 * - step (optional): 0.5 또는 1 (기본 0.5)
 */
export default function StarRating({ value = 0, onChange, max = 5, step = 0.5 }) {
  const [hoverValue, setHoverValue] = useState(null); // null means no hover
  const containerRef = useRef(null);

  // 보여줄 값: hover가 있으면 hoverValue, 없으면 prop value
  const displayValue = hoverValue !== null ? hoverValue : value;

  // keyboard handling
  const handleKeyDown = (e) => {
    e.preventDefault();
    const increment = step;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const next = Math.min(max, (Math.round((value + 1e-9) / step) * step) + increment);
      onChange && onChange(+(next.toFixed(2)));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const next = Math.max(0, (Math.round((value + 1e-9) / step) * step) - increment);
      onChange && onChange(+(next.toFixed(2)));
    } else if (e.key === "Home") {
      onChange && onChange(0);
    } else if (e.key === "End") {
      onChange && onChange(max);
    }
  };

  // calculate hovered value from mouse position in a star element
  const calcValueFromEvent = (e, starIndex) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    const newVal = isHalf ? starIndex + 0.5 : starIndex + 1;
    return Math.min(max, Math.max(0, +newVal.toFixed(2)));
  };

  // handle click: set final value
  const handleClick = (e, i) => {
    const newVal = calcValueFromEvent(e, i);
    onChange && onChange(newVal);
  };

  // hover handlers
  const handleMouseMove = (e, i) => {
    const newVal = calcValueFromEvent(e, i);
    setHoverValue(newVal);
  };
  const handleMouseLeave = () => setHoverValue(null);

  useEffect(() => {
    // if parent controls value externally, ensure hover cleared
    setHoverValue(null);
  }, [value]);

  // render stars
  const stars = [];
  for (let i = 0; i < max; i++) {
    // determine star fill state: 0 = empty, 0.5 = half, 1 = full
    const diff = displayValue - i;
    const fill = diff >= 1 ? 1 : (diff >= 0.5 ? 0.5 : 0);

    stars.push(
      <button
        key={i}
        type="button"
        className="sr-star-btn"
        onClick={(e) => handleClick(e, i)}
        onMouseMove={(e) => handleMouseMove(e, i)}
        onMouseLeave={handleMouseLeave}
        aria-label={`${i + 1} star`}
        aria-pressed={value >= i + 1}
        title={`${(i + 1)}점`}
      >
        <StarSVG fill={fill} />
      </button>
    );
  }

  return (
    <div
      className="sr-star-wrapper"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      aria-label="별점"
    >
      {stars}
      <div className="sr-value" aria-hidden="true">{value.toFixed(1)}</div>
    </div>
  );
}

function StarSVG({ fill = 0 }) {
  // fill: 0 empty, 0.5 half, 1 full
  // We'll render full star with clip for half.
  return (
    <svg viewBox="0 0 24 24" className="sr-star" aria-hidden="true">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* empty star (outline) */}
      <path
        d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
        className="sr-star-outline"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />

      {/* filled part */}
      {fill === 1 && (
        <path
          d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
          className="sr-star-fill"
          fill="currentColor"
        />
      )}

      {fill === 0.5 && (
        <>
          <clipPath id={`halfClip-${Math.random()}`}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
          <g clipPath="">
            <path
              d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
              className="sr-star-fill"
              fill="currentColor"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </g>
          {/* fallback: draw full but with opacity clip via CSS */}
          <path
            d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z"
            className="sr-star-half"
            fill="currentColor"
          />
        </>
      )}
    </svg>
  );
}
