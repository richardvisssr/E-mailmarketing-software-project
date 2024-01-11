import React from "react";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/";
import userEvent from "@testing-library/user-event";

import SubscriptionForm from "../components/categories/CategoriesComponent";

jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mockedToken"),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    prefetch: () => {},
    push: jest.fn(),
  }),
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

describe("SubscriptionForm", () => {
  const mockSubscriptions = ["test1", "test2", "test3"];
  const mockSetValue = jest.fn();
  const mockSelectedSubscribers = [];

  it("SubscriptionForm should render without problems", () => {
    render(
      <SubscriptionForm
        subscribers={mockSubscriptions}
        setValue={mockSetValue}
        selectedSubscribers={mockSelectedSubscribers}
      />
    );

    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
    expect(screen.getByText("test3")).toBeInTheDocument();
  });
});
