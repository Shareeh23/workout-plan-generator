import { useState, useEffect } from "react";
import { getExerciseAnalysis } from "../../api/analysis";
import { getPlanExercises } from "../../api/workoutApi";
import "./Analysis.css";
import { toast } from "sonner";
import Navbar from "../../components/Navbar/Navbar";
import ExerciseList from "../../components/Analysis/ExerciseList/ExerciseList";
import ProgressChart from "../../components/Analysis/ProgressChart/ProgressChart";
import VolumeChart from "../../components/Analysis/VolumeChart/VolumeChart";
import ProgressOverview from "../../components/Analysis/ProgressOverview/ProgressOverview";
import PerformanceMetrics from "../../components/Analysis/PerformanceMetrics/PerformanceMetrics";

const Analysis = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await getPlanExercises();
        setExercises(data);
      } catch (err) {
        toast.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleExerciseClick = async (exerciseName) => {
    try {
      setLoading(true);
      setSelectedExercise(exerciseName);
      const response = await getExerciseAnalysis(exerciseName);

      if (!response) {
        throw new Error("No response from server");
      }

      // Process history data - ensure we have an array
      const history = (Array.isArray(response.history) ? response.history : [])
        .map((item) => ({
          ...item,
          date: new Date(item.date),
          weight: Number(item.weight) || 0,
          volume: Number(item.volume) || 0,
          reps: Number(item.reps) || 0,
        }))
        .filter((item) => !isNaN(item.date.getTime())); // Filter out invalid dates

      if (history.length === 0) {
        setAnalysis({
          progress: {
            weight: { current: 0, change: 0 },
            volume: { current: 0, change: 0 },
          },
          history: [],
          bestSet: null,
          averageWeight: 0,
          totalVolume: 0,
          trendLine: "stable",
          volumeAverage: 0,
        });
        return;
      }

      // Calculate metrics
      const totalVolume = history.reduce((sum, item) => sum + item.volume, 0);
      const totalWeight = history.reduce((sum, item) => sum + item.weight, 0);
      const averageWeight =
        history.length > 0 ? totalWeight / history.length : 0;

      // Find best set (highest weight x reps)
      const bestSet = history.reduce((best, current) => {
        const currentScore = current.weight * current.reps;
        const bestScore = (best?.weight || 0) * (best?.reps || 1);
        return currentScore > bestScore ? current : best;
      }, {});

      const transformedData = {
        progress: {
          weight: {
            current:
              response.metrics?.weight?.current ||
              history[history.length - 1]?.weight ||
              0,
            change: response.metrics?.weight?.change || 0,
          },
          volume: {
            current:
              response.metrics?.volume?.current ||
              history[history.length - 1]?.volume ||
              0,
            change: response.metrics?.volume?.change || 0,
          },
        },
        history,
        bestSet: bestSet.weight
          ? {
              weight: bestSet.weight,
              reps: bestSet.reps || 0,
              date: bestSet.date,
            }
          : null,
        averageWeight,
        totalVolume,
        trendLine:
          response.trends?.weight?.direction === "up"
            ? "increasing"
            : response.trends?.weight?.direction === "down"
            ? "decreasing"
            : "stable",
        volumeAverage:
          response.metrics?.volume?.current ||
          history[history.length - 1]?.volume ||
          0,
      };

      console.log("Transformed Data:", transformedData);

      setAnalysis(transformedData);
    } catch (err) {
      toast.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-page">
      <Navbar user={user} />
      <div className="analysis-page-container">
        <div className="exercises-list">
          {loading && !exercises.length ? (
            <span className="loader"></span>
          ) : (
            <>
              <h3>Select Exercise</h3>
              <ExerciseList
                exercises={exercises}
                selectedExercise={selectedExercise}
                onExerciseClick={handleExerciseClick}
              />
            </>
          )}
        </div>

        {selectedExercise && analysis && (
          <section className="analysis-section">
            <h2 className="analysis-header">{selectedExercise} Analysis</h2>
            <div className="analysis-grid">
              <div className="analysis-grid-left">
                <ProgressOverview progress={analysis.progress} />

                <PerformanceMetrics
                  bestSet={analysis.bestSet}
                  averageWeight={analysis.averageWeight}
                  totalVolume={analysis.totalVolume}
                  history={analysis.history}
                />
              </div>

              <div className="analysis-grid-right">
                <div className="analysis-chart-card">
                  <h3 className="analysis-card-header">Weight Progression</h3>
                  <ProgressChart data={analysis.history} />
                </div>

                <div className="analysis-chart-card">
                  <h3 className="analysis-card-header">Volume Analysis</h3>
                  <VolumeChart
                    data={analysis.history}
                    volumeAverage={analysis.volumeAverage}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Analysis;
