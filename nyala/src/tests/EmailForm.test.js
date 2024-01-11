import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmailForm from "../components/subscribe/EmailForm";

describe("EmailForm Component", () => {
  const mockSubmit = jest.fn();
  const mockHandleEmailChange = jest.fn();
  const mockHandleCheckboxChange = jest.fn();
  const mockHandleNameChange = jest.fn();

  const initialProps = {
    handleSubmit: mockSubmit,
    handleEmailChange: mockHandleEmailChange,
    handleCheckboxChange: mockHandleCheckboxChange,
    handleNameChange: mockHandleNameChange,
    initialValues: {},
    labelMessage:
      "Vul een naam en email in, om toe te voegen aan een emaillijst",
    lists: ["Nieuwsbrief"],
  };

  let expectedName = "John Doe";
  let expectedEmail = "john@example.com";

  it("renders EmailForm component with empty initial values", () => {
    const { getByPlaceholderText, getByText } = render(
      <EmailForm {...initialProps} />
    );

    expect(getByPlaceholderText(/naam/i).value).toBe("");
    expect(getByPlaceholderText(/email/i).value).toBe("");
    expect(
      getByText(
        /Vul een naam en email in, om toe te voegen aan een emaillijst/i
      )
    ).toBeInTheDocument();
  });

  it("calls handleEmailChange when email input changes", () => {
    const { getByPlaceholderText } = render(<EmailForm {...initialProps} />);
    const emailInput = getByPlaceholderText(/email/i);

    fireEvent.change(emailInput, { target: { value: expectedEmail } });

    expect(mockHandleEmailChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("calls handleSubmit when the form is submitted", async () => {
    const { getByPlaceholderText, getByText } = render(
      <EmailForm {...initialProps} />
    );
    const submitButton = getByText(/submit/i);

    fireEvent.change(getByPlaceholderText(/naam/i), {
      target: { value: expectedName },
    });
    fireEvent.change(getByPlaceholderText(/email/i), {
      target: { value: expectedEmail },
    });

    fireEvent.submit(submitButton);

    expect(mockSubmit).toHaveBeenCalled();
  });
});
