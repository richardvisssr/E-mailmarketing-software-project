import { cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";
import userEvent from "@testing-library/user-event";
import TemplateCard from "../components/adminpanel/templateCardComponent";

jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mockedToken"),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    prefetch: () => {},
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

afterEach(cleanup);

it("TemplateCard should render without problems", () => {
  render(
    <TemplateCard
      template={{ id: 589743, title: "Test Template" }}
      onDelete={() => {}}
    />
  );

  expect(screen.getByText("Test Template")).toBeInTheDocument();
});

it("should delete template", async () => {
  const onDelete = jest.fn();

  render(
    <TemplateCard
      template={{ id: 589743, title: "Test Template" }}
      onDelete={onDelete}
    />
  );

  userEvent.click(screen.getByText("Verwijderen"));

  await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(1));
});
