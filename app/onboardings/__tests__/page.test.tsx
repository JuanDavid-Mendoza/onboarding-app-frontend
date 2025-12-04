import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OnboardingsPage from "../page";
import { useData } from "@/contexts/data-context";
import { useToast } from "@/hooks/use-toast";


jest.mock("@/contexts/data-context");
jest.mock("@/hooks/use-toast");


jest.mock("@/components/layout-with-sidebar", () => ({
    LayoutWithSidebar: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout-with-sidebar">{children}</div>
    ),
}));

jest.mock("@/components/ui/toaster", () => ({
    Toaster: () => null,
}));

jest.mock("@/components/create-onboarding-modal", () => ({
    CreateOnboardingModal: ({ isOpen }: any) =>
        isOpen ? (
            <div data-testid="create-onboarding-modal">Create Modal</div>
        ) : null,
}));

jest.mock("@/components/edit-onboarding-modal", () => ({
    EditOnboardingModal: ({ onboarding, isOpen }: any) =>
        isOpen ? (
            <div data-testid="edit-onboarding-modal">
                Edit Modal: {onboarding.name}
            </div>
        ) : null,
}));

const mockToast = jest.fn();
const mockDeleteOnboarding = jest.fn();

const mockOnboardings = [
    {
        id: 1,
        name: "Onboarding General 2024",
        description: "Proceso de bienvenida para nuevos colaboradores",
        onboarding_type: "Onboarding de Bienvenida General",
        start_date: "2024-01-15",
        end_date: "2024-01-30",
        color: "#003DA5",
    },
    {
        id: 2,
        name: "Onboarding Técnico Backend",
        description: "Capacitación técnica para desarrolladores backend",
        onboarding_type: "Onboarding Técnico",
        start_date: "2024-02-01",
        end_date: "2024-02-28",
        color: "#28A745",
    },
    {
        id: 3,
        name: "Onboarding Frontend",
        description: "Capacitación para desarrolladores frontend",
        onboarding_type: "Onboarding Técnico",
        start_date: "2024-03-01",
        end_date: "2024-03-15",
        color: "#FFC107",
    },
];

describe("OnboardingsPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
        (useData as jest.Mock).mockReturnValue({
            onboardings: mockOnboardings,
            deleteOnboarding: mockDeleteOnboarding,
        });
    });

    describe("Renderizado inicial", () => {
        it("debe renderizar la página de onboardings correctamente", () => {
            render(<OnboardingsPage />);

            expect(
                screen.getByRole("heading", { name: /gestión de onboardings/i })
            ).toBeInTheDocument();
            expect(
                screen.getByText("Administra todos los programas de onboarding")
            ).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /crear onboarding/i })
            ).toBeInTheDocument();
        });

        it("debe mostrar todos los onboardings", () => {
            render(<OnboardingsPage />);

            expect(
                screen.getByText("Onboarding General 2024")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Onboarding Técnico Backend")
            ).toBeInTheDocument();
            expect(screen.getByText("Onboarding Frontend")).toBeInTheDocument();
        });

        it("debe mostrar la sección de filtros", () => {
            render(<OnboardingsPage />);

            expect(
                screen.getByPlaceholderText("Buscar por nombre")
            ).toBeInTheDocument();
            expect(screen.getAllByPlaceholderText("dd/mm/yyyy")).toHaveLength(
                2
            );
            expect(screen.getByRole("combobox")).toBeInTheDocument();
        });

        it("debe mostrar las tarjetas con la información correcta", () => {
            render(<OnboardingsPage />);


            expect(
                screen.getByText(
                    "Proceso de bienvenida para nuevos colaboradores"
                )
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Capacitación técnica para desarrolladores backend"
                )
            ).toBeInTheDocument();


            expect(screen.getByText("15/01/2024")).toBeInTheDocument();
            expect(screen.getByText("01/02/2024")).toBeInTheDocument();
        });
    });

    describe("Filtros de búsqueda", () => {
        it("debe filtrar onboardings por nombre", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const nameInput = screen.getByPlaceholderText("Buscar por nombre");
            await user.type(nameInput, "Frontend");

            await waitFor(() => {
                expect(
                    screen.getByText("Onboarding Frontend")
                ).toBeInTheDocument();
                expect(
                    screen.queryByText("Onboarding General 2024")
                ).not.toBeInTheDocument();
                expect(
                    screen.queryByText("Onboarding Técnico Backend")
                ).not.toBeInTheDocument();
            });
        });

        it("debe filtrar onboardings por fecha de inicio", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const startDateInput =
                screen.getAllByPlaceholderText("dd/mm/yyyy")[0];
            await user.type(startDateInput, "15/01/2024");

            await waitFor(() => {
                expect(
                    screen.getByText("Onboarding General 2024")
                ).toBeInTheDocument();
                expect(
                    screen.queryByText("Onboarding Técnico Backend")
                ).not.toBeInTheDocument();
            });
        });

        it("debe filtrar onboardings por fecha de fin", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const endDateInput =
                screen.getAllByPlaceholderText("dd/mm/yyyy")[1];
            await user.type(endDateInput, "28/02/2024");

            await waitFor(() => {
                expect(
                    screen.getByText("Onboarding Técnico Backend")
                ).toBeInTheDocument();
                expect(
                    screen.queryByText("Onboarding General 2024")
                ).not.toBeInTheDocument();
            });
        });








    });

    describe("Modal de creación", () => {
        it("debe abrir el modal al hacer clic en Crear Onboarding", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const createButton = screen.getByRole("button", {
                name: /crear onboarding/i,
            });
            await user.click(createButton);

            await waitFor(() => {
                expect(
                    screen.getByTestId("create-onboarding-modal")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Modal de edición", () => {
        it("debe abrir el modal de edición al hacer clic en el botón editar", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const editButtons = screen.getAllByRole("button", { name: "" });
            const editButton = editButtons.find(
                (btn) =>
                    btn.querySelector("svg") &&
                    btn.className.includes("outline")
            );

            if (editButton) await user.click(editButton);

            await waitFor(() => {
                expect(
                    screen.getByTestId("edit-onboarding-modal")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Eliminación de onboardings", () => {







    });

    describe("Visualización de información", () => {




        it("debe mostrar todos los detalles de un onboarding", () => {
            render(<OnboardingsPage />);


            expect(
                screen.getAllByText("Onboarding de Bienvenida General")
            ).toBeTruthy();
            expect(screen.getAllByText("Onboarding Técnico")).toBeTruthy();


            expect(screen.getByText("15/01/2024")).toBeInTheDocument();
            expect(screen.getByText("30/01/2024")).toBeInTheDocument();


            expect(screen.getByText("#003DA5")).toBeInTheDocument();
            expect(screen.getByText("#28A745")).toBeInTheDocument();
        });
    });

    describe("Casos extremos", () => {
        it("debe mostrar mensaje cuando no hay onboardings", () => {
            (useData as jest.Mock).mockReturnValue({
                onboardings: [],
                deleteOnboarding: mockDeleteOnboarding,
            });

            render(<OnboardingsPage />);

            expect(
                screen.getByText("No se encontraron onboardings")
            ).toBeInTheDocument();
        });

        it("debe mostrar mensaje cuando los filtros no coinciden", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const nameInput = screen.getByPlaceholderText("Buscar por nombre");
            await user.type(nameInput, "NoExisteEsteOnboarding");

            await waitFor(() => {
                expect(
                    screen.getByText("No se encontraron onboardings")
                ).toBeInTheDocument();
            });
        });

        it("debe ordenar onboardings por fecha de inicio descendente", () => {
            render(<OnboardingsPage />);

            const titles = screen
                .getAllByText(/^Onboarding/i)
                .filter((el) => el.tagName === "H3");

            expect(titles[0].textContent).toBe("Onboarding Frontend");
            expect(titles[1].textContent).toBe("Onboarding Técnico Backend");
            expect(titles[2].textContent).toBe("Onboarding General 2024");
        });

        it("debe truncar descripciones largas con line-clamp", () => {
            render(<OnboardingsPage />);

            const descriptions = screen.getAllByText(
                /Proceso de bienvenida|Capacitación técnica|Capacitación para/i
            );
            descriptions.forEach((desc) => {
                expect(desc.className).toContain("line-clamp-2");
            });
        });

        it("debe manejar búsqueda case-insensitive", async () => {
            const user = userEvent.setup();
            render(<OnboardingsPage />);

            const nameInput = screen.getByPlaceholderText("Buscar por nombre");
            await user.type(nameInput, "FRONTEND");

            await waitFor(() => {
                expect(
                    screen.getByText("Onboarding Frontend")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Accesibilidad", () => {
        it("debe tener labels correctos en los inputs", () => {
            render(<OnboardingsPage />);

            expect(screen.getByText("Nombre")).toBeInTheDocument();
            expect(screen.getByText("Fecha Inicio")).toBeInTheDocument();
            expect(screen.getByText("Fecha Fin")).toBeInTheDocument();
            expect(screen.getByText("Tipo")).toBeInTheDocument();
        });

        it("debe tener iconos en los botones para mejor UX", () => {
            render(<OnboardingsPage />);

            const createButton = screen.getByRole("button", {
                name: /crear onboarding/i,
            });
            expect(createButton.querySelector("svg")).toBeInTheDocument();
        });
    });
});
