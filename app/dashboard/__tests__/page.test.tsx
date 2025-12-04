import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "../page";
import { useData } from "@/contexts/data-context";
import { useToast } from "@/hooks/use-toast";


jest.mock("@/contexts/data-context");
jest.mock("@/hooks/use-toast");


jest.mock("@/components/layout-with-sidebar", () => ({
    LayoutWithSidebar: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="layout-with-sidebar">{children}</div>
    ),
}));

jest.mock("@/components/user-detail-modal", () => ({
    UserDetailModal: ({ user, isOpen }: any) =>
        isOpen ? (
            <div data-testid="user-detail-modal">
                <h3>{user.name}</h3>
            </div>
        ) : null,
}));

jest.mock("@/components/ui/toaster", () => ({
    Toaster: () => null,
}));

const mockToast = jest.fn();
const mockDeleteUser = jest.fn();
const mockGetUserOnboardings = jest.fn();

const mockUsers = [
    {
        id: 1,
        name: "Juan Pérez",
        email: "juan@example.com",
        entry_date: "2024-01-15",
        role_id: 2,
    },
    {
        id: 2,
        name: "María García",
        email: "maria@example.com",
        entry_date: "2024-02-20",
        role_id: 2,
    },
    {
        id: 3,
        name: "Carlos López",
        email: "carlos@example.com",
        entry_date: "2024-03-10",
        role_id: 2,
    },
];

const mockOnboardingsJuan = [
    {
        id: 1,
        name: "Onboarding General",
        onboarding_type: "Onboarding de Bienvenida General",
        state: 1,
        start_date: "2024-01-15",
        end_date: "2024-01-30",
        description: "Test",
        color: "#003DA5",
    },
    {
        id: 2,
        name: "Onboarding Técnico",
        onboarding_type: "Onboarding Técnico",
        state: 0,
        start_date: "2024-02-01",
        end_date: "2024-02-15",
        description: "Test",
        color: "#003DA5",
    },
];

const mockOnboardingsMaria = [
    {
        id: 3,
        name: "Onboarding General",
        onboarding_type: "Onboarding de Bienvenida General",
        state: 1,
        start_date: "2024-02-20",
        end_date: "2024-03-05",
        description: "Test",
        color: "#003DA5",
    },
    {
        id: 4,
        name: "Onboarding Técnico",
        onboarding_type: "Onboarding Técnico",
        state: 1,
        start_date: "2024-03-06",
        end_date: "2024-03-20",
        description: "Test",
        color: "#003DA5",
    },
];

describe("DashboardPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
        mockGetUserOnboardings.mockImplementation((userId: number) => {
            if (userId === 1) return Promise.resolve(mockOnboardingsJuan);
            if (userId === 2) return Promise.resolve(mockOnboardingsMaria);
            return Promise.resolve([]);
        });
        (useData as jest.Mock).mockReturnValue({
            users: mockUsers,
            deleteUser: mockDeleteUser,
            getUserOnboardings: mockGetUserOnboardings,
        });
    });

    describe("Renderizado inicial", () => {
        it("debe renderizar el dashboard correctamente", async () => {
            render(<DashboardPage />);

            expect(
                screen.getByRole("heading", { name: /dashboard/i })
            ).toBeInTheDocument();
            expect(
                screen.getByText("Gestión de colaboradores y onboardings")
            ).toBeInTheDocument();
            expect(screen.getByText("Nombre")).toBeInTheDocument();

            await waitFor(() => {
                expect(mockGetUserOnboardings).toHaveBeenCalled();
            });
        });

        it("debe mostrar el estado de carga inicial", () => {
            render(<DashboardPage />);

            expect(
                screen.getByText("Cargando información...")
            ).toBeInTheDocument();
        });

        it("debe cargar y mostrar la lista de usuarios", async () => {
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
                expect(screen.getByText("María García")).toBeInTheDocument();
                expect(screen.getByText("Carlos López")).toBeInTheDocument();
            });
        });

        it("debe mostrar los estados correctos de onboardings", async () => {
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("1/2 completados")).toBeInTheDocument();
                expect(screen.getByText("Completado")).toBeInTheDocument();
                expect(screen.getByText("Sin asignar")).toBeInTheDocument();
            });
        });
    });

    describe("Filtros de búsqueda", () => {
        it("debe filtrar usuarios por nombre", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText("Buscar por nombre");
            await user.type(nameInput, "Juan");

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
                expect(
                    screen.queryByText("María García")
                ).not.toBeInTheDocument();
            });
        });

        it("debe filtrar usuarios por correo", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("María García")).toBeInTheDocument();
            });

            const emailInput = screen.getByPlaceholderText("Buscar por correo");
            await user.type(emailInput, "maria@");

            await waitFor(() => {
                expect(screen.getByText("María García")).toBeInTheDocument();
                expect(
                    screen.queryByText("Juan Pérez")
                ).not.toBeInTheDocument();
            });
        });

        it("debe filtrar usuarios por fecha", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const dateInput = screen.getByPlaceholderText("dd/mm/yyyy");
            await user.type(dateInput, "15/01/2024");

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
                expect(
                    screen.queryByText("María García")
                ).not.toBeInTheDocument();
            });
        });








    });

    describe("Acciones sobre usuarios", () => {
        it("debe abrir el modal de detalles al hacer clic en Ver", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const verButtons = screen.getAllByRole("button", { name: /ver/i });
            await user.click(verButtons[0]);

            await waitFor(() => {
                expect(
                    screen.getByTestId("user-detail-modal")
                ).toBeInTheDocument();
            });
        });

        it("debe abrir el diálogo de confirmación al intentar eliminar", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole("button", {
                name: "",
            });
            const trashButton = deleteButtons.find(
                (btn) => btn.querySelector("svg") !== null
            );
            if (trashButton) await user.click(trashButton);

            await waitFor(() => {
                expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
                expect(
                    screen.getByText(/esta acción no se puede deshacer/i)
                ).toBeInTheDocument();
            });
        });



        it("debe mostrar error al fallar la eliminación", async () => {
            const user = userEvent.setup();
            mockDeleteUser.mockRejectedValue(new Error("Error"));
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole("button", {
                name: "",
            });
            const trashButton = deleteButtons.find(
                (btn) => btn.querySelector("svg") !== null
            );
            if (trashButton) await user.click(trashButton);

            await waitFor(() => {
                expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
            });

            const confirmButton = screen.getByRole("button", {
                name: /eliminar/i,
            });
            await user.click(confirmButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Error",
                    description: "No se pudo eliminar el usuario",
                    variant: "destructive",
                });
            });
        });

        it("debe cancelar la eliminación", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const deleteButtons = screen.getAllByRole("button", {
                name: "",
            });
            const trashButton = deleteButtons.find(
                (btn) => btn.querySelector("svg") !== null
            );
            if (trashButton) await user.click(trashButton);

            await waitFor(() => {
                expect(screen.getByText("¿Estás seguro?")).toBeInTheDocument();
            });

            const cancelButton = screen.getByRole("button", {
                name: /cancelar/i,
            });
            await user.click(cancelButton);

            await waitFor(() => {
                expect(
                    screen.queryByText("¿Estás seguro?")
                ).not.toBeInTheDocument();
            });
            expect(mockDeleteUser).not.toHaveBeenCalled();
        });
    });

    describe("Casos extremos", () => {
        it("debe mostrar mensaje cuando no hay usuarios", async () => {
            (useData as jest.Mock).mockReturnValue({
                users: [],
                deleteUser: mockDeleteUser,
                getUserOnboardings: mockGetUserOnboardings,
            });

            render(<DashboardPage />);

            await waitFor(() => {
                expect(
                    screen.queryByText("Cargando información...")
                ).not.toBeInTheDocument();
            });
        });

        it("debe mostrar mensaje cuando los filtros no coinciden", async () => {
            const user = userEvent.setup();
            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText("Buscar por nombre");
            await user.type(nameInput, "NoExiste");

            await waitFor(() => {
                expect(
                    screen.getByText("No se encontraron colaboradores")
                ).toBeInTheDocument();
            });
        });



        it("debe ordenar usuarios alfabéticamente", async () => {
            render(<DashboardPage />);

            await waitFor(() => {
                const rows = screen.getAllByRole("row");
                const userRows = rows.filter((row) =>
                    row.textContent?.includes("@example.com")
                );

                expect(userRows[0].textContent).toContain("Carlos López");
                expect(userRows[1].textContent).toContain("Juan Pérez");
                expect(userRows[2].textContent).toContain("María García");
            });
        });

        it("debe excluir usuarios con role_id 1", async () => {
            const usersWithAdmin = [
                ...mockUsers,
                {
                    id: 4,
                    name: "Admin User",
                    email: "admin@example.com",
                    entry_date: "2024-01-01",
                    role_id: 1,
                },
            ];

            (useData as jest.Mock).mockReturnValue({
                users: usersWithAdmin,
                deleteUser: mockDeleteUser,
                getUserOnboardings: mockGetUserOnboardings,
            });

            render(<DashboardPage />);

            await waitFor(() => {
                expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
            });

            expect(screen.queryByText("Admin User")).not.toBeInTheDocument();
        });
    });

    describe("Tipos de onboarding", () => {


        it("debe mostrar N/A cuando no hay onboardings asignados", async () => {
            render(<DashboardPage />);

            await waitFor(() => {
                const carlosRow = screen
                    .getByText("Carlos López")
                    .closest("tr");
                if (carlosRow) {
                    expect(
                        within(carlosRow).getByText("N/A")
                    ).toBeInTheDocument();
                }
            });
        });
    });
});
