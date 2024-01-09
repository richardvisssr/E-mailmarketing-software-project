import { cleanup, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { useRouter } from "next/navigation";
import AnalyticsPanelCard from "../components/adminpanel/AnalyticsPanelCard";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: "mockData" }),
  })
);

afterEach(() => {
  fetch.mockClear();
  cleanup();
});

it("should render the analytics panel card component", async () => {
  const div = document.createElement("div");
  const root = createRoot(div);

  await act(async () => {
    useRouter.mockImplementation(() => ({
      pathname: "",
      route: "",
      query: "",
      prefetch: jest.fn(),
    }));
    const mockAnalytics = { id: "mockId" };
    root.render(<AnalyticsPanelCard analytics={mockAnalytics} />);
  });

  expect(root.container).toMatchSnapshot();
});
