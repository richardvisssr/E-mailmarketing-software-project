import { cleanup, render } from "@testing-library/react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import TemplateCard from "../components/adminpanel/templateCardComponent";
import { useRouter } from "next/navigation";

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

it("should render the template card component", async () => {
  // make the function async
  const div = document.createElement("div");
  const root = createRoot(div);

  await act(async () => {
    // use await act(async () => { ... })
    useRouter.mockImplementation(() => ({
      pathname: "",
      route: "",
      query: "",
      prefetch: jest.fn(),
    }));
    const mockTemplate = { id: "mockId" /* other properties as needed */ };
    root.render(<TemplateCard template={mockTemplate} />);
  });

  expect(root.container).toMatchSnapshot();
});
