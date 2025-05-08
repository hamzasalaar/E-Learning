import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can later connect to backend or email service here
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-left">
          <h2>Contact Us</h2>
          <p>
            Have questions, suggestions, or need help? Feel free to reach out — our team is here to support
            you.
          </p>
          <ul>
            <li><strong>Email:</strong> support@example.com</li>
            <li><strong>Phone:</strong> +123 456 7890</li>
            <li><strong>Location:</strong> Kigali, Rwanda</li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send a Message</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">Send Message</button>
          {submitted && <p className="success">Thank you! Your message has been sent.</p>}
        </form>
      </div>

      <style>{`
        .contact-page {
          background-color: #f2f6fa;
          padding: 60px 20px;
          font-family: 'Segoe UI', sans-serif;
        }

        .contact-container {
          display: flex;
          flex-wrap: wrap;
          max-width: 1000px;
          margin: auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .contact-left {
          flex: 1 1 40%;
          background-color: #008080;
          color: white;
          padding: 40px;
        }

        .contact-left h2 {
          margin-bottom: 20px;
        }

        .contact-left ul {
          list-style: none;
          padding: 0;
          margin-top: 20px;
        }

        .contact-left li {
          margin-bottom: 10px;
        }

        .contact-form {
          flex: 1 1 60%;
          padding: 40px;
        }

        .contact-form h3 {
          margin-bottom: 20px;
          color: #333;
        }

        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }

        .contact-form button {
          background-color: #008080;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
        }

        .contact-form button:hover {
          background-color: #006666;
        }

        .success {
          margin-top: 10px;
          color: green;
        }

        @media (max-width: 768px) {
          .contact-container {
            flex-direction: column;
          }

          .contact-left, .contact-form {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
