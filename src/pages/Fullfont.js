import { useNavigate } from "react-router-dom";

const Fullfont = () => {
  const navigate = useNavigate();
    return (
        <div className="App">
        <div class="header">
          WashU Archictectural Font
          <div class="button" onClick={() => navigate("/")}>home</div>
        </div>
        <div id="text-main">
          <img src="./public/images/alphabet.png" alt=" "></img>
        </div>
        <div className="footer">
          Designed by Mac Barnes <br />
          Advanced Interaction Design <br />
          Spring 2025
        </div>
      </div>
    );
  };
  
  export default Fullfont;