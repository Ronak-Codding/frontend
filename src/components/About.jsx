import Footer from "./Footer";
import "./About.css";
import Navbar from "./Navbar";

const About = () => {
 const teamMembers = [
  {
    name: "John Smith",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    bio: "20+ years in aviation industry",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    }
  },
  {
    name: "Sarah Johnson",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600",
    bio: "Former airline executive",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    }
  },
  {
    name: "Michael Chen",
    role: "Customer Experience Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    bio: "Hospitality expert",
    social: {
      linkedin: "#",
      twitter: "#",
      email: "#"
    }
  }
];

  const values = [
    {
      icon: "fas fa-shield-alt",
      title: "Safety First",
      description:
        "Your safety is our top priority with rigorous maintenance and training standards.",
    },
    {
      icon: "fas fa-clock",
      title: "Punctuality",
      description:
        "We pride ourselves on on-time performance and efficient operations.",
    },
    {
      icon: "fas fa-smile",
      title: "Customer Focus",
      description: "Exceptional service that makes every journey memorable.",
    },
    {
      icon: "fas fa-globe",
      title: "Global Reach",
      description: "Connecting you to destinations across the world.",
    },
  ];

  return (
    <>
      <Navbar/>
      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-overlay"></div>
          <div className="about-container">
            <h1 className="about-hero-title">About Us</h1>
            <p className="about-hero-subtitle">
              Connecting the world with comfort, safety, and excellence since
              2008
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="about-mission">
          <div className="about-container">
            <div className="mission-grid">
              <div className="mission-card" data-aos="fade-right">
                <div className="mission-icon">
                  <i className="fas fa-bullseye"></i>
                </div>
                <h2>Our Mission</h2>
                <p>
                  To provide safe, reliable, and comfortable air travel
                  experiences that connect people and cultures while maintaining
                  the highest standards of service excellence.
                </p>
              </div>
              <div className="mission-card" data-aos="fade-left">
                <div className="mission-icon">
                  <i className="fas fa-eye"></i>
                </div>
                <h2>Our Vision</h2>
                <p>
                  To become the world's most trusted and preferred airline,
                  known for innovation, sustainability, and exceptional customer
                  experiences in every journey.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Our Story */}
        <section className="about-story">
          <div className="about-container">
            <div className="story-content">
              <div className="story-text">
                <h2 className="story-title">Our Journey</h2>
                <p className="story-paragraph">
                  Founded in 2008, SkyJet Airlines began with a simple vision:
                  to make air travel accessible, comfortable, and enjoyable for
                  everyone. What started as a small fleet of 3 aircraft serving
                  regional routes has grown into one of the most respected
                  airlines in the industry.
                </p>
                <p className="story-paragraph">
                  Over the years, we've carried millions of passengers to their
                  dream destinations, built lasting relationships with our
                  customers, and maintained an impeccable safety record. Our
                  commitment to innovation has led us to introduce
                  state-of-the-art aircraft, cutting-edge entertainment systems,
                  and sustainable practices that reduce our environmental
                  footprint.
                </p>
                <div className="story-features">
                  <div className="story-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Modern Fleet</span>
                  </div>
                  <div className="story-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Expert Crew</span>
                  </div>
                  <div className="story-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Global Network</span>
                  </div>
                </div>
              </div>
              <div className="story-image">
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Airplane flying"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="about-values">
          <div className="about-container">
            <h2 className="values-title">Our Core Values</h2>
            <p className="values-subtitle">
              The principles that guide everything we do
            </p>

            <div className="values-grid">
              {values.map((value, index) => (
                <div className="value-card" key={index}>
                  <div className="value-icon">
                    <i className={value.icon}></i>
                  </div>
                  <h3 className="value-title">{value.title}</h3>
                  <p className="value-description">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="about-team">
          <div className="about-container">
            <h2 className="team-title">Meet Our Leadership</h2>
            <p className="team-subtitle">
              Dedicated professionals committed to your comfort and safety
            </p>

            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <div className="team-card" key={index}>
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                    <div className="team-social">
                      <a href={member.social.linkedin} className="social-link">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href={member.social.twitter} className="social-link">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href={member.social.email} className="social-link">
                        <i className="fas fa-envelope"></i>
                      </a>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p>{member.role}</p>
                    <span>{member.bio}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="about-cta">
          <div className="about-container">
            <h2 className="cta-title">Ready to Fly With Us?</h2>
            <p className="cta-text">
              Experience the SkyJet difference. Book your next journey with us.
            </p>
            <button className="cta-button">
              Book Your Flight <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </section> */}
      </div>
      <Footer></Footer>
    </>
  );
};

export default About;
