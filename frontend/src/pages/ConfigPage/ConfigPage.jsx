import { useState, useEffect } from "react";
import {
  uploadProfilePicture,
  deleteAccount,
  getCurrentUser,
  updateUserProfile,
} from "../../api/auth";
import {
  getNutritionProfile,
  updateNutritionProfile,
  createNutritionProfile,
} from "../../api/nutritionProfile";
import Navbar from "../../components/Navbar/Navbar";
import NutritionProfileForm from "../../components/NutritionProfileForm/NutritionProfileForm";
import UserProfileForm from "../../components/UserProfileForm/UserProfileForm";
import ProfilePicture from "../../components/ProfilePicture/ProfilePicture";
import DeleteAccountForm from "../../components/DeleteAccountForm/DeleteAccountForm";
import FormMessage from "../../components/FormMessage/FormMessage";
import "./ConfigPage.css";
import Image from "../../assets/images/aesthetic.png";

const Config = ({ user, onProfilePictureUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingNutrition, setIsUpdatingNutrition] = useState(false);
  const [hasNutritionProfile, setHasNutritionProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");

  const [nutritionData, setNutritionData] = useState({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
    goal: "maintain",
    macroSplit: "40-30-30",
  });
  const [messages, setMessages] = useState({
    userProfile: { text: "", type: "" },
    nutritionProfile: { text: "", type: "" },
    profilePicture: { text: "", type: "" },
    deleteAccount: { text: "", type: "" },
  });

  // Helper function to update messages
  const updateMessage = (formName, text, type) => {
    setMessages((prev) => ({
      ...prev,
      [formName]: { text, type },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userResult = await getCurrentUser();

        if (userResult.success && userResult.data) {
          // User data is now received via props
        } else {
          const errorMessage = userResult.error || "Failed to load user data";
          console.error("Error loading user data:", errorMessage);
          updateMessage("userProfile", errorMessage, "error");
        }

        const nutritionResult = await getNutritionProfile();
        if (nutritionResult.data) {
          setHasNutritionProfile(true);
          setNutritionData({
            gender: nutritionResult.data.gender || "male",
            age: nutritionResult.data.age || "",
            height: nutritionResult.data.height || "",
            weight: nutritionResult.data.currentWeight || "",
            activityLevel: nutritionResult.data.activityLevel || "moderate",
            goal: nutritionResult.data.goal || "maintain",
            macroSplit:
              nutritionResult.data.macroTarget?.macroSplit || "40-30-30",
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status !== 404) {
          updateMessage(
            "nutritionProfile",
            "An error occurred while loading data",
            "error"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdateProfile = async (formData) => {
    try {
      setIsUpdatingProfile(true);
      updateMessage("userProfile", "", "");

      const response = await updateUserProfile(formData);

      if (response.success) {
        // Notify parent component about the profile update
        if (onProfilePictureUpdate && response.data.user?.profilePicture) {
          onProfilePictureUpdate(response.data.user.profilePicture);
        }

        updateMessage(
          "userProfile",
          "Profile updated successfully!",
          "success"
        );
        return true;
      } else {
        updateMessage(
          "userProfile",
          response.error || "Failed to update profile",
          "error"
        );
        return false;
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      updateMessage(
        "userProfile",
        "An error occurred while updating your profile",
        "error"
      );
      return false;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle nutrition profile update
  const handleUpdateNutrition = async (formData, hasProfile) => {
    try {
      setIsUpdatingNutrition(true);
      updateMessage("nutritionProfile", "", "");

      const apiCall = hasProfile
        ? updateNutritionProfile
        : createNutritionProfile;
      const response = await apiCall(formData);

      if (response.success) {
        setNutritionData({
          ...formData,
          weight: formData.weight,
          height: formData.height,
          age: formData.age,
        });

        if (!hasProfile) {
          setHasNutritionProfile(true);
        }

        updateMessage(
          "nutritionProfile",
          hasProfile
            ? "Nutrition profile updated successfully!"
            : "Nutrition profile created successfully!",
          "success"
        );
        return true;
      } else {
        const errorMessage =
          response.error || "Failed to update nutrition profile";
        updateMessage("nutritionProfile", errorMessage, "error");
        return false;
      }
    } catch (err) {
      console.error("Error updating nutrition profile:", err);
      updateMessage(
        "nutritionProfile",
        "An error occurred while updating your nutrition profile",
        "error"
      );
      return false;
    } finally {
      setIsUpdatingNutrition(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      updateMessage(
        "profilePicture",
        "Please select a valid image file (JPEG, PNG, WebP, or AVIF)",
        "error"
      );
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      updateMessage(
        "profilePicture",
        "Image size should be less than 5MB",
        "error"
      );
      return;
    }

    try {
      setIsUploading(true);
      updateMessage("profilePicture", "", "");

      const result = await uploadProfilePicture(file);

      if (result.success) {
        // Notify parent component about the profile picture update
        if (onProfilePictureUpdate && result.user?.profilePicture) {
          const pictureUrl = result.user.profilePicture;
          if (typeof pictureUrl === "string" && pictureUrl.trim() !== "") {
            onProfilePictureUpdate(pictureUrl);
          }
        }

        updateMessage(
          "profilePicture",
          "Profile picture updated successfully",
          "success"
        );
      } else {
        updateMessage(
          "profilePicture",
          result.error || "Failed to upload profile picture",
          "error"
        );
      }
    } catch (err) {
      updateMessage("profilePicture", "An unexpected error occurred", "error");
      console.error("Error uploading profile picture:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      setIsDeleting(true);
      updateMessage("deleteAccount", "", "");

      const result = await deleteAccount(password);

      if (result.success) {
        window.location.href = "/login";
      } else {
        updateMessage(
          "deleteAccount",
          result.error || "Failed to delete account",
          "error"
        );
      }
    } catch (err) {
      updateMessage("deleteAccount", "An unexpected error occurred", "error");
      console.error("Error deleting account:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="config-page">
      <Navbar user={user} />
      <div className="config-page-container">
        <section className="personal-info-section">
          {isLoading ? (
            <div className="spinner-container">
              <span className="spinner"></span>
            </div>
          ) : (
            <>
              <div className="top-section">
                <ProfilePicture
                  imageUrl={user?.profilePicture || Image}
                  name={user?.name || "User"}
                  email={user?.email || ""}
                  onFileChange={handleFileChange}
                  isUploading={isUploading}
                />
              </div>

              <div className="bottom-section">
                <DeleteAccountForm
                  onDelete={handleDeleteAccount}
                  isDeleting={isDeleting}
                  message={messages.deleteAccount}
                  setMessage={(msg) =>
                    updateMessage("deleteAccount", msg.text, msg.type)
                  }
                />
              </div>
            </>
          )}
        </section>

        <section className="profile-form-container">
          <h2>Nutrition Profile</h2>
          <NutritionProfileForm
            initialData={nutritionData}
            onSubmit={handleUpdateNutrition}
            isSubmitting={isUpdatingNutrition}
            hasProfile={hasNutritionProfile}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </section>

        <section className="profile-form-container">
          <h2>User Profile</h2>
          <UserProfileForm
            initialData={{
              name: user?.name || "",
              email: user?.email || "",
            }}
            onSubmit={handleUpdateProfile}
            isSubmitting={isUpdatingProfile}
            onResetSuccess={() => {}}
          />
        </section>
      </div>
    </div>
  );
};

export default Config;
