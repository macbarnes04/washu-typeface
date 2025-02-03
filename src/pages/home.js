import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
      <div className="App">
        <div class="header">
          WashU Archictectural Font
          <div class="button" onClick={() => navigate("/fullfont")}>Specimen</div>
        </div>
        <div id="text-main">
          <img src="/images/hambergevons.png" alt="Hambergevons" />
          <div class="text-box-container">
            <input type="text" id="input" name="input" placeholder="Type something..."/>
          </div>
        </div>
        <div className="footer">
          Designed by Mac Barnes <br />
          Advanced Interaction Design <br />
          Spring 2025
        </div>
      </div>
    );
};

export default Home;
