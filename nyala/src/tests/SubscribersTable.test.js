import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/";
import userEvent from "@testing-library/user-event";

import SubscribersTable from "../components/views/SubscribersTable";
import AlertComponent from "../components/alert/AlertComponent";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mockedToken"),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

afterEach(() => cleanup());

describe("SubscribersTable", () => {
  const testSubscribers = [
    {
      id: 1,
      email: "Matthias@gmail.com",
      name: "Matthias",
      subscription: ["test", "test2"],
    },
    {
      id: 2,
      email: "Jules@outlook.com",
      name: "Jules",
      subscription: ["test"],
    },
  ];

  it("should render without problems", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => testSubscribers,
    });

    render(<SubscribersTable />);

    await waitFor(() => {
      expect(screen.getByText("Matthias@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Jules@outlook.com")).toBeInTheDocument();
    });
  });

  it("should render without problems when there are no subscribers", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<SubscribersTable />);

    await waitFor(() => {
      expect(screen.getByText("Geen abonnees gevonden")).toBeInTheDocument();
    });
  });

  it("should render without problems when a subscriber is deleted", async () => {
    const mockNotification = {
      message: "De gebruiker is verwijderd.",
      type: "success",
    };

    global.fetch.mockResolvedValueOnce({
      json: async () => testSubscribers,
    });

    render(<SubscribersTable />);

    await waitFor(() => {
      expect(screen.getByText("Matthias@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Jules@outlook.com")).toBeInTheDocument();
    });

    const deleteIcon = screen.getAllByPlaceholderText("Verwijderen");
    userEvent.click(deleteIcon[0]);

    await waitFor(() => {
      expect(screen.getByText(`Annuleren`)).toBeInTheDocument();
    });

    const confirmDelete = screen.getAllByText("Verwijderen");
    userEvent.click(confirmDelete[1]);

    await waitFor(() => {
      expect(
        screen.getByText("De gebruiker is verwijderd")
      ).toBeInTheDocument();
    });
  });

  it("should render when someone gets deleted but admin changed theire mind", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => testSubscribers,
    });

    render(<SubscribersTable />);

    await waitFor(() => {
      expect(screen.getByText("Matthias@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Jules@outlook.com")).toBeInTheDocument();
    });

    const deleteIcon = screen.getAllByPlaceholderText("Verwijderen");
    userEvent.click(deleteIcon[0]);

    await waitFor(() => {
      expect(screen.getByText(`Annuleren`)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Annuleren"));

    await waitFor(() => {
      expect(screen.getByText("Matthias@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Jules@outlook.com")).toBeInTheDocument();
    });
  });

  it("should render when admin changes someone's data and changes their mind", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => testSubscribers,
    });

    render(<SubscribersTable />);

    await waitFor(() => {
      expect(screen.getByText("Matthias@gmail.com")).toBeInTheDocument();
      expect(screen.getByText("Jules@outlook.com")).toBeInTheDocument();
    });

    const editIcon = screen.getAllByPlaceholderText("Wijzigen");
    userEvent.click(editIcon[1]);

    await waitFor(() => {
      expect(screen.getByText(`Wijzigen`)).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Annuleren"));

    await waitFor(() => {
      expect(screen.getByText("Jules@outlook.com")).toBeInTheDocument();
    });
  });
});
