import React, { useRef } from 'react';
import './ProfilePicture.css';
import defaultAvatar from '../../assets/images/aesthetic.png';

const ProfilePicture = ({ 
  imageUrl, 
  name, 
  email, 
  onFileChange, 
  isUploading 
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="profile-picture-container">
      <div className="profile-picture">
        {imageUrl ? (
          <img 
            src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:3000${imageUrl}`} 
            alt="Profile" 
            onError={(e) => {
              console.error('Error loading profile image:', imageUrl);
              e.target.src = defaultAvatar;
            }}
          />
        ) : (
          <img 
            src={defaultAvatar} 
            alt="Default Profile" 
            className="default-avatar"
          />
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="file-input"
          accept="image/jpeg, image/png, image/webp, image/avif"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        {isUploading && <div className="uploading-overlay text-lg">Uploading...</div>}
      </div>
      <div 
        className="change-picture-link text-md" 
        onClick={handleClick}
      >
        Change profile picture
      </div>
      <h3 className="profile-name">{name}</h3>
      <h5 className="profile-email">{email}</h5>
    </div>
  );
};

export default ProfilePicture;
