import styles from "./categoriesComponent.module.css";

const SubscriptionForm = ({ subscribers, setValue }) => {
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
};

export default SubscriptionForm;
