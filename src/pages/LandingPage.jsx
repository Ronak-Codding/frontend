import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import FlightSearchForm from "./FlightSearchForm";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NewLandingPage = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    alert("Redirecting to booking page...");
  };

  const handleNavigationClick = (e, action) => {
    e.preventDefault();

    switch (action) {
      case "signin":
        navigate("/login");
        break;
      case "book":
        handleBookNow();
        break;

      default:
        break;
    }
  };

  return (
    <div className="new-landing-page">
      <Header />

      {/* Hero Section */}
      <section className="new-hero" id="home">
        <div className="new-container">
          <div className="new-hero-content">
            <div className="new-hero-text">
              <h6 className="new-hero-subtitle">Premium Airline Experience</h6>
              <h1 className="new-hero-title">
                Discover The World <br />
                <span className="new-hero-highlight">With Comfort</span>
              </h1>
              <p className="new-hero-description">
                Experience luxury air travel with SkyJet. We connect you to over
                150 destinations worldwide with premium service, comfort, and
                safety.
              </p>

              <div className="new-hero-buttons">
                <button
                  className="new-btn new-btn-primary new-btn-lg"
                  onClick={(e) => handleNavigationClick(e, "book")}
                >
                  <i className="fas fa-ticket-alt"></i>
                  Book Flight
                </button>
                <button
                  className="new-btn new-btn-secondary new-btn-lg"
                  onClick={(e) => handleNavigationClick(e, "explore")}
                >
                  <i className="fas fa-map-marked-alt"></i>
                  Explore Destinations
                </button>
              </div>
            </div>
            <FlightSearchForm></FlightSearchForm>
          </div>
        </div>
      </section>

      {/* About Section */}

      <Footer />
    </div>
  );
};

export default NewLandingPage;
