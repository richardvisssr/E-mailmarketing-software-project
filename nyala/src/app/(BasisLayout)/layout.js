import BasicHeaderComponent from "@/components/BasicHeaderComponent";
import FooterComponent from "@/components/FooterComponent";

export default function BasisLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <BasicHeaderComponent />
      <div>{children}</div>
      <div className="wrapper flex-grow-1"></div>
      <FooterComponent />
    </div>
  );
}
