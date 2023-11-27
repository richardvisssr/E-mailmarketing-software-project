import HeaderComponent from "@/components/layout/headerComponent";
import FooterComponent from "@/components/layout/FooterComponent";

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
