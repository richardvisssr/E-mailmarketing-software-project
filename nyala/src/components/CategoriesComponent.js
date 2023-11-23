import styles from "./categoriesComponent.module.css";

/**
 * SubscriptionForm component displays a list of checkboxes for mail subscriptions.
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<string>} props.subscribers - An array of strings representing mail subscriptions.
 * @param {function} props.setValue - A callback function to handle checkbox value changes.
 * @param {Array<string>} props.list - An array of selected subscriptions.
 * @returns {JSX.Element} React component.
 */
const SubscriptionForm = ({ subscribers, setValue, list }) => {
  try {
    if (!subscribers || !Array.isArray(subscribers)) {
      throw new Error("Invalid or missing subscribers data");
    }

    /**
     * Checks if a subscription is selected.
     * @param {string} subscription - The subscription to check.
     * @returns {boolean} True if the subscription is selected, false otherwise.
     */
    function isSelected(subscription) {
      return list.includes(subscription);
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
                  checked={isSelected(subscription)}
                />
                {subscription}
              </label>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    return (
      <div className="alert alert-danger" role="alert">
        Oeps! Er is iets foutgegaan met het laten zien van de lijsten.
      </div>
    );
  }
};

export default SubscriptionForm;
