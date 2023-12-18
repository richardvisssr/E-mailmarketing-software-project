export default function ProgressBar({ text, count, total }) {
  const calculatePercentage = (part, everything) => {
    return (part / everything) * 100;
  };

  return (
    <div>
      <div>
        <h1> {text} </h1>
      </div>
      <ProgressBar
        className="w-100"
        now={count}
        label={`${calculatePercentage(count, total)}%`}
      />
    </div>
  );
}
