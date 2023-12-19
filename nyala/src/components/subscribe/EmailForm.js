import React, { useState } from "react";
import styles from "./Subscribe.module.css";
import SubscriptionForm from "../categories/CategoriesComponent";

/**
 * Functional component for an email form.
 * @param {Object} props - Component properties.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {Function} props.handleEmailChange - Function to handle email input change.
 * @param {Object} props.initialValues - Initial values for form data.
 * @param {string} props.labelMessage - Message for the form label.
 * @param {Function} props.handleCheckboxChange - Function to handle checkbox change.
 * @param {Function} props.handleNameChange - Function to handle name input change.
 * @param {Array} props.lists - List of mailing lists.
 * @returns {JSX.Element} The JSX element representing the component.
 */
export default function EmailForm({
  handleSubmit,
  handleEmailChange,
  handleCheckboxChange,
  handleNameChange,
  initialValues,
  labelMessage,
  lists,
}) {
  const { name, email } = initialValues;

  return (
    <form
      className={`input-group ${styles.form} d-flex flex-column`}
      onSubmit={handleSubmit}
    >
      <label htmlFor="form" className={`${styles.label} mb-2 rounded`}>
        {labelMessage}
      </label>
      <input
        type="text"
        className={`form-control ${styles.entry} p-2 mb-3`}
        placeholder="Naam"
        onChange={handleNameChange}
        value={name || ""}
      />

      <input
        type="text"
        className={`form-control ${styles.entry} p-2 mb-3`}
        placeholder="Email"
        aria-describedby="basic-addon1"
        onChange={handleEmailChange}
        value={email || ""}
      />
      {typeof handleCheckboxChange === "function" ? (
        Array.isArray(lists) && lists.length > 0 ? (
          <SubscriptionForm
            subscribers={lists}
            setValue={handleCheckboxChange}
            selectedSubscribers={initialValues.list}
          />
        ) : (
          <p>Er zijn geen maillijsten.</p>
        )
      ) : null}
      <input
        type="submit"
        className={`btn ${styles.buttonPrimary} rounded mt-4`}
        value="Submit"
      />
    </form>
  );
}
