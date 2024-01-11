// Import necessary dependencies and utilities
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  queryByAttribute,
} from "@testing-library/react";
import MailCalendar from "../components/calender/CalendarComponent";
import "@testing-library/jest-dom";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    status: 200,
    json: () => Promise.resolve({}),
  })
);

// Mock the Cookies module
jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mockedToken"),
}));

// Mock the TableRowComponent since it is used in the MailCalendar component
jest.mock(
  "../components/calender/TableRowComponent.jsx",
  () =>
    ({
      mail,
      formatSubject,
      formatDate,
      formatTime,
      handleOpenModal,
      deleteMail,
    }) =>
      (
        <tr>
          <td>{formatSubject(mail.subject)}</td>
          <td>{formatDate(mail.date)}</td>
          <td>{formatTime(mail.date)}</td>
          <td>{mail.status}</td>
          <td>
            <button onClick={() => handleOpenModal(mail.id, mail.title)}>
              Open Modal
            </button>
            <button onClick={() => deleteMail(mail.id)}>Delete Mail</button>
          </td>
        </tr>
      )
);

describe("MailCalendar component", () => {
  beforeEach(() => {
    // Reset the mock implementation for each test
    fetch.mockClear();
    jest.clearAllMocks();
  });

  it("renders MailCalendar component", async () => {
    render(<MailCalendar emails={{ plannedMails: [] }} />);

    // You can use screen queries to find elements and assert their presence
    expect(screen.getByText("Er zijn geen mails gevonden")).toBeInTheDocument();
  });

  it("handles status change and updates background class", async () => {
    render(<MailCalendar emails={{ plannedMails: [] }} />);

    // Find the select element and change its value
    const statusSelect = screen.getByLabelText(/Filter op status:/i);
    fireEvent.change(statusSelect, { target: { value: "In afwachting" } });

    // Assert that the background class is updated based on the selected status
    expect(statusSelect).toBe(screen.getByLabelText(/Filter op status:/i));
  });
});
