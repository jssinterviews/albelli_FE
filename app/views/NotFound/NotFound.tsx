import { Button, Spacer, ViewLayout } from "../../components/commons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const locales = {
  pageNotFound: "Page not found",
  goHome: "Go home",
};

function NotFound() {
  const navigate = useNavigate();
  return (
    <ViewLayout>
      <Button
        label={locales.goHome}
        icon={<FontAwesomeIcon icon={faArrowLeft} />}
        onClick={() => navigate("/")}
      />
      <Spacer spacing={0.5} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        {locales.pageNotFound}
      </div>
    </ViewLayout>
  );
}

export default NotFound;
