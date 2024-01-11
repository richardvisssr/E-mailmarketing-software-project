import { cleanup, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/";
import userEvent from "@testing-library/user-event";
import React from "react";
import TemplateCard from "../components/adminpanel/templateCardComponent";
import MailEditor from "../components/templateEditor/MailEditor";
import AlertComponent from "../components/alert/AlertComponent";

let template;
let onDelete;

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

  template = {
    id: 589743,
    title: "Test Template",
  };

  onDelete = jest.fn();
});

afterEach(() => cleanup());

describe("TemplateCardComponent", () => {
  it("TemplateCard should render without problems", () => {
    render(<TemplateCard template={template} onDelete={onDelete} />);

    expect(screen.getByText("Test Template")).toBeInTheDocument();
  });

  it("should call onDelete when 'Verwijderen' button is clicked and deletion is confirmed", async () => {
    const onDeleteMock = jest.fn();
    const mockNotification = {
      message: "Template is succesvol verwijderd.",
      type: "success",
    };

    render(<TemplateCard template={template} onDelete={() => onDeleteMock} />);

    userEvent.click(screen.getByText("Verwijderen"));

    await waitFor(() => {
      expect(screen.getByText("Bevestig Verwijderen")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Bevestigen"));

    await waitFor(() => {
      render(<AlertComponent notification={mockNotification} />);
      expect(
        screen.getByText("Template is succesvol verwijderd.")
      ).toBeInTheDocument();
    });
  });

  it("should not call onDelete when 'Verwijderen' button is clicked and deletion is not confirmed", async () => {
    render(<TemplateCard template={template} onDelete={onDelete} />);
    userEvent.click(screen.getByText("Verwijderen"));

    await waitFor(() => {
      expect(screen.getByText("Bevestig Verwijderen")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Annuleren"));

    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(0));
  });

  it("should send template ", async () => {
    render(<TemplateCard template={template} onDelete={onDelete} />);

    userEvent.click(screen.getByText("Versturen"));

    await waitFor(() => {
      expect(
        screen.getByText(`Wil je '${template.title}' versturen?`)
      ).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Mail versturen"));

    await waitFor(() => expect(onDelete).toHaveBeenCalledTimes(0));
  });

  it("should edit template", async () => {
    const mockNotification = {
      message: "Design is succesvol opgeslagen!",
      type: "success",
    };
    render(<TemplateCard template={template} onDelete={onDelete} />);

    userEvent.click(screen.getByText("Aanpassen"));

    await waitFor(() => {
      render(<MailEditor id={template.id} />);
      expect(screen.getByText("Mail Editor")).toBeInTheDocument();
    });

    userEvent.click(screen.getByText("Design Opslaan"));

    await waitFor(() => {
      render(<AlertComponent notification={mockNotification} />);
      expect(
        screen.getByText("Design is succesvol opgeslagen!")
      ).toBeInTheDocument();
    });
  });
});
