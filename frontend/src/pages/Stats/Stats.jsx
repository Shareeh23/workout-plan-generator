import { useState, useEffect } from "react";
import { getNutritionProfile } from "../../api/nutritionProfile";
import Navbar from "../../components/Navbar/Navbar";
import Calculator from "../../components/Calculator/Calculator";
import "./Stats.css";

const Stats = ({ user }) => {
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        const result = await getNutritionProfile();

        if (result?.data) {
          setNutritionData(result.data);
        } else {
          setError("No nutrition data available");
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, []);

  if (loading) {
    return (
      <div className="stats-page">
        <Navbar user={user} />
        <div className="library-spinner-container">
          <span className="spinner"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-page">
        <Navbar user={user} />
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <Navbar user={user} />
      <div className="stats-page-container">
        <div className="calculators-container">
          {nutritionData?.macroTarget ? (
            <Calculator
              title="Your Macro Breakdown"
              macros={{
                calorieTarget: nutritionData.calorieTarget,
                split: nutritionData.macroTarget.macroSplit,
                carbs: nutritionData.macroTarget.carbs,
                protein: nutritionData.macroTarget.protein,
                fat: nutritionData.macroTarget.fat,
              }}
            />
          ) : (
            <h4 className="no-data">No nutrition data available</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
