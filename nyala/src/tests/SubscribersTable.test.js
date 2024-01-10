import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import { createRoot } from "react-dom/client";

import SubscribersTable from "../components/views/SubscribersTable";

jest.mock("next/navigation");

jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mockedToken"),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

describe("SubscribersTable", () => {
  it("should render the subscribers table component with no subscribers", async () => {
    const div = document.createElement("div");
    const root = createRoot(div);

    await act(async () => {
      useRouter.mockImplementation(() => ({
        pathname: "",
        route: "",
        query: "",
        prefetch: jest.fn(),
      }));

      root.render(<SubscribersTable />);
    });

    expect(root.container).toMatchSnapshot();
  });

  it("should render the subscribers table component with subscribers", async () => {
    const div = document.createElement("div");
    const root = createRoot(div);

    await act(async () => {
      useRouter.mockImplementation(() => ({
        pathname: "",
        route: "",
        query: "",
        prefetch: jest.fn(),
      }));

      const mockSubscribers = [
        {
          name: "John Doe",
          email: "john@example.com",
          subscription: ["A", "B"],
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          subscription: ["C", "D"],
        },
      ];

      global.fetch.mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.resolve(mockSubscribers),
        })
      );

      root.render(<SubscribersTable />);
    });

    expect(root.container).toMatchSnapshot();
  });
});
