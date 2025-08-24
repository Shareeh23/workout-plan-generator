import { useState, useEffect } from "react";
import { getNutritionProfile } from "../../api/nutritionProfile";
import Navbar from "../../components/Navbar/Navbar";
import Calculator from "../../components/Stats/Calculator/Calculator";
import NutritionInfo from "../../components/Stats/NutritionInfo/NutritionInfo";
import "./Profile.css";

const Profile = ({ user }) => {
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
      <div className="profile-page">
        <Navbar user={user} />
        <div className="library-spinner-container">
          <span className="spinner"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Navbar user={user} />
        <h2 className="error-message">{error}</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar user={user} />
      <div className="profile-page-container">
        <div className="profile-page-left-section">
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
              <h4 className="no-data">
                Setup your nutrition profile in config see this info
              </h4>
            )}
          </div>
          <div className="nutrition-info-container">
            <NutritionInfo userData={nutritionData} />
          </div>
        </div>
        <div className="profile-page-right-section"></div>
      </div>
    </div>
  );
};

export default Profile;
