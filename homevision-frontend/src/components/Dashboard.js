import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import './Dashboard.css'; 
import logo from './images/home vision1.png';
import about1 from './images/hlogo.webp';
import { FaUserCircle, FaSignOutAlt, FaUserEdit } from 'react-icons/fa'; // Import necessary icons

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const [formData, setFormData] = useState({ name: '', email: '',subject: '', message: '' });
  

  useEffect(() => {
    const fetchUser = async () => {
      try {
          const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/';
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        window.location.href = '/';
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible); 
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);
      if (response.status === 200) {
        alert('Message sent successfully!');
        setFormData({ name: '', email: '',subject: '', message: '' }); // Clear the form
      }
    } catch (error) {
      console.error('There was an error sending the message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="home-page">
      <header>
        <div className="container">
          <a href="/">
            <img src={logo} alt="Home Vision Logo" className="logo" />
          </a>
          <nav>
            <ul>
              <li><Link to="/properties">Property</Link></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </nav>
          {user && (
            <div className="user-dropdown">
              <FaUserCircle onClick={toggleDropdown} className="user-icon" />
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <Link to="/update-profile">
                    <FaUserEdit className="dropdown-icon" /> Update 
                  </Link>
                  <button type="button" className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <section className="hero" id="home">
        <div className="container">
          {user && (
            <div className="user-info">
              <h2>Welcome {user.username}</h2>
            </div>
          )}
          <a href="/properties" className="btn">Property</a>
        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <h2>Our Services</h2>
          <div className="service-cards">
            <div className="service-card">
              <h3>Custom Home Design</h3>
              <p>Receive personalized home design suggestions from our experts. Whether you're renovating or building from scratch, our tailored designs ensure your vision becomes a reality.</p>
            </div>
            <div className="service-card">
              <h3>Home Renovation Services</h3>
              <p>Revitalize your living spaces with our comprehensive renovation services. From kitchens to bathrooms, we transform outdated areas into modern, functional spaces.</p>
            </div>
            <div className="service-card">
              <h3>New Home Search</h3>
              <p>Find your dream home with our advanced search tools. Explore a curated selection of properties that match your desired location, style, and budget.</p>
            </div>
            <div className="service-card">
              <h3>Builder Connections</h3>
              <p>Connect with top-rated builders in your area. Whether you're planning a major renovation or a new construction, our trusted partners deliver quality results.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-us" id="about">
        <div className="container">
          <h2>About Us</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                At Home Vision, we are passionate about transforming the way people interact with their living spaces. Our platform integrates cutting-edge technology with user-friendly interfaces to offer a comprehensive solution for home renovation, new home search, and builder connections.
              </p><br></br>
              <p>
                Founded with the mission to simplify and enhance the home buying and renovation process, Home Vision provides a seamless experience for homeowners and homebuyers. Our expert team is dedicated to delivering high-quality service and support, ensuring that every project meets our rigorous standards of excellence.
              </p><br></br>
              <p>
                From personalized design suggestions to connecting you with trusted builders, we strive to make every step of your home journey enjoyable and stress-free. Explore our platform to discover how Home Vision can help you create the perfect living space.
              </p>
            </div>
            <div className="about-image">
              <img src={about1} alt="About Us" />
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject:</label>
              <input 
                type="text" 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <textarea 
                id="message" 
                name="message" 
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn">Send Message</button>
          </form>
          <p>Email: info@homevision.com | Phone: (+91) 7481986785</p>
          <p>&copy; 2024 Home Vision. All rights reserved.</p>
        </div>
      </footer>

      {/* <footer id="contact">
        <div className="container">
          <h2>Contact Us</h2>
          <p>Email: info@homevision.com | Phone: (+91) 97236 18239</p>
          <p>&copy; 2024 Home Vision. All rights reserved.</p>
        </div>
      </footer> */}
    </div>
  );
};

export default Dashboard;
