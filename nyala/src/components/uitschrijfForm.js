export default function UitschrijfForm() {
  return (
    <div>
      <form>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input type="email" className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Geef hier uw reden op</label>
          <textarea className="form-control" rows="3"></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Verstuur
        </button>
      </form>
    </div>
  );
}
