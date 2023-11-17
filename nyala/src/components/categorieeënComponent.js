import styles from "./categorieeënComponent.module.css";

const AbonnementenFormulier = ({ abonnees, setValue }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Abonnementen</label>
      <ul>
        {abonnees.map((abonnement, index) => (
          <li key={index} className={`mb-2 ${styles.customList}`}>
            <label className="d-flex align-items-center">
              <input
                type="checkbox"
                name="abonnement"
                value={abonnement}
                className={`me-2 control ${styles.customSelect} `}
                onChange={setValue}
              />
              {abonnement}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AbonnementenFormulier;
