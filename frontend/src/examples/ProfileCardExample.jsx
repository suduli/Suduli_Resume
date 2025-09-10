/**
 * Example of how to use the Profile model in a component
 * 
 * This is for demonstration purposes only and is not meant to be included in the actual project.
 */

import React from 'react';
import { createProfile, getFormattedName, getSocialLinks, formatContactLink } from './models/Profile';

/**
 * ProfileCard component that displays profile information
 */
const ProfileCard = () => {
  // Create a profile instance with default data
  const profile = createProfile();
  
  // Get formatted name for display (used in responsive views)
  const formattedName = getFormattedName(profile);
  // We'll use this in our component below
  
  // Get social media links
  const socialLinks = getSocialLinks(profile);
  
  // Format contact links
  const emailLink = formatContactLink('email', profile.contact.email);
  const phoneLink = formatContactLink('phone', profile.contact.phone);
  
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img src={profile.photo} alt={profile.name} className="profile-photo" />
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <h2>{profile.title}</h2>
          <p className="profile-location">{profile.location}</p>
          <p className="profile-short-name">Known as: {formattedName}</p>
        </div>
      </div>
      
      <div className="profile-contact">
        {emailLink && (
          <a href={emailLink} className="contact-link">
            <i className="icon-email"></i>
            {profile.contact.email}
          </a>
        )}
        
        {phoneLink && (
          <a href={phoneLink} className="contact-link">
            <i className="icon-phone"></i>
            {profile.contact.phone}
          </a>
        )}
        
        <div className="social-links">
          {socialLinks.map(link => (
            <a 
              key={link.platform} 
              href={link.url} 
              className="social-link"
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className={`icon-${link.icon}`}></i>
              <span className="sr-only">{link.platform}</span>
            </a>
          ))}
        </div>
      </div>
      
      <div className="profile-about">
        <h3>About Me</h3>
        <p>{profile.about}</p>
      </div>
      
      <div className="profile-objective">
        <h3>Objective</h3>
        <p>{profile.objective}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
