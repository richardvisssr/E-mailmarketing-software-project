import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import HeaderComponent from "@/components/HeaderComponent";
import FooterComponent from "@/components/FooterComponent";

export default function BeheerderLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <HeaderComponent />
      <div>{children}</div>
      <div className="wrapper flex-grow-1"></div>
      <FooterComponent />
    </div>
  );
}
