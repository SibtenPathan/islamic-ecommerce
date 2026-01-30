'use client';

import { useState } from 'react';
import Image from 'next/image';
import './contact.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-image">
          <Image src="/images/Contact/roman-kraft-0EVKn3-5JSU-unsplash 1-1.png" alt="Contact Us" fill style={{ objectFit: 'cover' }} priority />
          <div className="image-overlay">
            <span className="hashtag">#stayconnected</span>
            <h2>Contact</h2>
            <p>We really appreciate the time and input you give us, help us to continue to provide the best service.</p>
          </div>
        </div>

        <div className="contact-form-section">
          <h1>What can we help?</h1>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group"><input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required /></div>
            <div className="form-group"><input type="email" name="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required /></div>
            <div className="form-group"><textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} rows={5} required /></div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
