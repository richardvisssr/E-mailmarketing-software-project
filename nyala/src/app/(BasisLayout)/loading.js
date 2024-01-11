import Spinner from "@/components/spinner/Spinner";

export default function Loading() {
  return (
    <div
      className={`d-flex flex-column justify-conten-center align-items-center py-5`}
    >
      <h3>Aan het laden...</h3>
      <Spinner />
    </div>
  );
}
