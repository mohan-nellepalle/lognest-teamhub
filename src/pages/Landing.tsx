import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero bg-dark text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">Empowering Businesses with Cutting-Edge IT Solutions</h1>
              <p className="lead">Transform your business with our innovative technology solutions</p>
              <button className="btn btn-danger btn-lg mt-3">Get Started</button>
            </div>
            <div className="col-lg-6">
              <img src="/placeholder.svg" alt="Hero" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Our IT Solutions</h2>
          <div className="row g-4">
            {['Cloud Solutions', 'Cybersecurity', 'Digital Transformation', 'AI & ML', 'DevOps', 'Data Analytics'].map((service, index) => (
              <div key={index} className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-danger">{service}</h5>
                    <p className="card-text">Innovative solutions to drive your business forward</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="industries py-5 bg-dark text-white">
        <div className="container">
          <h2 className="text-center mb-5">Industries We Serve</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="industry-card p-4 bg-danger bg-opacity-10 rounded">
                <h3>Finance</h3>
                <p>Secure and scalable solutions for financial institutions</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="industry-card p-4 bg-danger bg-opacity-10 rounded">
                <h3>Healthcare</h3>
                <p>Digital transformation for healthcare providers</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="industry-card p-4 bg-danger bg-opacity-10 rounded">
                <h3>Manufacturing</h3>
                <p>Smart solutions for modern manufacturing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio py-5">
        <div className="container">
          <h2 className="text-center mb-5">Our Creative Portfolio</h2>
          <div className="row g-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-md-4">
                <div className="portfolio-item position-relative">
                  <img src="/placeholder.svg" alt={`Portfolio ${item}`} className="img-fluid rounded" />
                  <div className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                    <h4 className="text-white">Project {item}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2>Let's Discuss Your Requirements</h2>
              <p className="mb-4">Get in touch with our experts to explore how we can help your business grow</p>
              <div className="mb-3">
                <i className="bi bi-geo-alt text-danger me-2"></i>
                123 Business Avenue, Tech City
              </div>
              <div className="mb-3">
                <i className="bi bi-envelope text-danger me-2"></i>
                contact@example.com
              </div>
              <div className="mb-3">
                <i className="bi bi-phone text-danger me-2"></i>
                +1 234 567 890
              </div>
            </div>
            <div className="col-lg-6">
              <form className="p-4 bg-white rounded shadow-sm">
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Your Name" />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Your Email" />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" rows={4} placeholder="Your Message"></textarea>
                </div>
                <button type="submit" className="btn btn-danger">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <p className="mb-0">© 2024 Your Company. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-end">
              <a href="#" className="text-white me-3">Privacy Policy</a>
              <a href="#" className="text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;