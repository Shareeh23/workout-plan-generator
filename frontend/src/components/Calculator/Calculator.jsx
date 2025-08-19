import { useState, useEffect } from "react";
import "./Calculator.css";

const Calculator = ({ title, macros = {} }) => {
  const [progress, setProgress] = useState({ carbs: 0, fat: 0, protein: 0 });

  useEffect(() => {
    if (!macros) return;

    const duration = 1000;
    const start = Date.now();

    const [carbsPct, proteinPct, fatPct] = macros.split.split("-").map(Number);

    const target = {
      carbs: carbsPct,
      protein: proteinPct,
      fat: fatPct,
    };

    const animate = () => {
      const now = Date.now();
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      setProgress({
        carbs: target.carbs * progress,
        fat: target.fat * progress,
        protein: target.protein * progress,
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [macros]);

  const renderRing = (type) => {
    const value = Math.round(progress[type]);
    const displayValue = macros[type] || 0;
    const label = type.charAt(0).toUpperCase() + type.slice(1);

    return (
      <div className="ring" key={type}>
        <div className="outer-ring">
          <div className="value-ring" style={{ "--progress": value }} />
          <div className="inner-ring">
            <span className="text-lg">{value}%</span>
          </div>
        </div>
        <div className="ring-value text-lg">
          {displayValue}g {label}
        </div>
      </div>
    );
  };

  return (
    <div className="calculator">
      <h3 className="calculator-title">{title}</h3>
      <span className="calorie-target text-lg">Calorie Target: {macros.calorieTarget} kcal</span>
      <div className="rings-container">
        {renderRing("carbs")}
        {renderRing("fat")}
        {renderRing("protein")}
      </div>
    </div>
  );
};

export default Calculator;
