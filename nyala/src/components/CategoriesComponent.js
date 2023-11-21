import styles from "./categoriesComponent.module.css";

const SubscriptionForm = ({ subscribers, setValue }) => {
  try {
    if (!subscribers || !Array.isArray(subscribers)) {
      throw new Error("Invalid or missing subscribers data");
    }

    return (
      <div className="mb-3">
        <label className="form-label">Mail Lijsten</label>
        <ul>
          {subscribers.map((subscription, index) => (
            <li key={index} className={`mb-2 ${styles.customList}`}>
              <label className="d-flex align-items-center">
                <input
                  type="checkbox"
                  name="subscription"
                  value={subscription}
                  className={`me-2 control ${styles.customSelect}`}
                  onChange={setValue}
                />
                {subscription}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    console.error("Error in SubscriptionForm:", error.message);
    return (
      <div className="alert alert-danger" role="alert">
        Oeps! Er is iets foutgegaan met het laten zien van de lijsten.
      </div>
    );
  }
};

export default SubscriptionForm;
