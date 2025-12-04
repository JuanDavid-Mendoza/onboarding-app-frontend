import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

jest.mock("@/contexts/auth-context");

const mockPush = jest.fn();
const mockLogin = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

const mockToast = jest.fn();
jest.mock("@/hooks/use-toast", () => ({
    useToast: () => ({
        toast: mockToast,
        toasts: [],
    }),
}));

describe("LoginPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        (useAuth as jest.Mock).mockReturnValue({
            login: mockLogin,
            isAuthenticated: false,
            user: null,
            loading: false,
        });

        Storage.prototype.getItem = jest.fn();
        Storage.prototype.setItem = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Renderizado inicial", () => {
        it("debe renderizar el formulario de login correctamente", () => {
            render(<LoginPage />);

            expect(
                screen.getByText("Iniciar Sesión", {
                    selector: '[class*="font-bold"]',
                })
            ).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Ingresa tus credenciales para acceder al sistema"
                )
            ).toBeInTheDocument();
            expect(screen.getByLabelText(/correo/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /iniciar sesión/i })
            ).toBeInTheDocument();
        });

        it("debe mostrar el logo del Banco de Bogotá", () => {
            render(<LoginPage />);

            const logo = screen.getByAltText("Banco de Bogotá");
            expect(logo).toBeInTheDocument();
        });

        it("debe mostrar enlaces de navegación", () => {
            render(<LoginPage />);

            expect(
                screen.getByText(/¿No tienes una cuenta?/i)
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: /regístrate aquí/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: /volver al inicio/i })
            ).toBeInTheDocument();
        });

        it("debe renderizar el botón de cambio de tema", () => {
            render(<LoginPage />);

            const themeButtons = screen.getAllByRole("button");
            expect(themeButtons.length).toBeGreaterThan(1);
        });
    });

    describe("Estado de carga", () => {
        it("debe mostrar pantalla de carga cuando loading es true", () => {
            (useAuth as jest.Mock).mockReturnValue({
                login: mockLogin,
                isAuthenticated: false,
                user: null,
                loading: true,
            });

            render(<LoginPage />);

            expect(
                screen.getByText("Verificando sesión...")
            ).toBeInTheDocument();
        });

        it("no debe renderizar el formulario cuando ya está autenticado", () => {
            (useAuth as jest.Mock).mockReturnValue({
                login: mockLogin,
                isAuthenticated: true,
                user: { role_id: 1, name: "Test User" },
                loading: false,
            });

            const { container } = render(<LoginPage />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("Validación del formulario", () => {
        it("debe mostrar error cuando el email está vacío", async () => {
            render(<LoginPage />);

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Este campo es requerido")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando el email tiene menos de 3 caracteres", async () => {
            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            await userEvent.type(emailInput, "ab");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Debe tener al menos 3 caracteres")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando la contraseña está vacía", async () => {
            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            await userEvent.type(emailInput, "test@bancobogota.com");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("La contraseña es requerida")
                ).toBeInTheDocument();
            });
        });

        it("debe permitir envío con datos válidos", async () => {
            mockLogin.mockResolvedValue(true);
            Storage.prototype.getItem = jest.fn(() =>
                JSON.stringify({ role_id: 1 })
            );

            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(emailInput, "admin@bancobogota.com");
            await userEvent.type(passwordInput, "password123");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockLogin).toHaveBeenCalledWith(
                    "admin@bancobogota.com",
                    "password123"
                );
            });
        });
    });

    describe("Funcionalidad de mostrar/ocultar contraseña", () => {
        it("debe tener un botón para mostrar/ocultar la contraseña", () => {
            render(<LoginPage />);

            const passwordInput = screen.getByLabelText(
                /contraseña/i
            ) as HTMLInputElement;
            expect(passwordInput.type).toBe("password");

            const toggleButtons = screen.getAllByRole("button");
            const togglePasswordButton = toggleButtons.find((button) =>
                button.querySelector("svg")
            );

            expect(togglePasswordButton).toBeDefined();
        });
    });

    describe("Proceso de autenticación", () => {
        it("debe mostrar estado de carga durante el login", async () => {
            let resolveLogin: (value: boolean) => void;
            mockLogin.mockImplementation(
                () =>
                    new Promise<boolean>((resolve) => {
                        resolveLogin = resolve;
                    })
            );

            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(emailInput, "admin@bancobogota.com");
            await userEvent.type(passwordInput, "password123");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Iniciando sesión...")
                ).toBeInTheDocument();
                expect(submitButton).toBeDisabled();
            });
        });

        it("debe redirigir al dashboard cuando el usuario es admin (role_id = 1)", async () => {
            mockLogin.mockResolvedValue(true);
            Storage.prototype.getItem = jest.fn(() =>
                JSON.stringify({ role_id: 1 })
            );

            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(emailInput, "admin@bancobogota.com");
            await userEvent.type(passwordInput, "password123");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Inicio de sesión exitoso",
                    description:
                        "Bienvenido al sistema de gestión de onboardings",
                });
                expect(mockPush).toHaveBeenCalledWith("/dashboard");
            });
        });

        it("debe redirigir a collaborator/onboardings cuando el usuario es colaborador", async () => {
            mockLogin.mockResolvedValue(true);
            Storage.prototype.getItem = jest.fn(() =>
                JSON.stringify({ role_id: 2 })
            );

            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(emailInput, "user@bancobogota.com");
            await userEvent.type(passwordInput, "password123");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Inicio de sesión exitoso",
                    description:
                        "Bienvenido al sistema de gestión de onboardings",
                });
                expect(mockPush).toHaveBeenCalledWith(
                    "/collaborator/onboardings"
                );
            });
        });

        it("debe mostrar error cuando las credenciales son incorrectas", async () => {
            mockLogin.mockResolvedValue(false);

            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(emailInput, "wrong@bancobogota.com");
            await userEvent.type(passwordInput, "wrongpassword");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Error de autenticación",
                    description:
                        "Credenciales incorrectas. Por favor, verifica tus datos.",
                    variant: "destructive",
                });
            });
        });

        it("debe manejar errores de red correctamente", async () => {
            mockLogin.mockRejectedValue(new Error("Network error"));

            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(emailInput, "user@bancobogota.com");
            await userEvent.type(passwordInput, "password123");

            const submitButton = screen.getByRole("button", {
                name: /iniciar sesión/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Error de autenticación",
                    description:
                        "Ocurrió un error al iniciar sesión. Intenta nuevamente.",
                    variant: "destructive",
                });
            });
        });
    });

    describe("Redirección automática", () => {
        it("debe redirigir automáticamente si el usuario ya está autenticado (admin)", () => {
            (useAuth as jest.Mock).mockReturnValue({
                login: mockLogin,
                isAuthenticated: true,
                user: { role_id: 1, name: "Admin User" },
                loading: false,
            });

            render(<LoginPage />);

            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("debe redirigir automáticamente si el usuario ya está autenticado (colaborador)", () => {
            (useAuth as jest.Mock).mockReturnValue({
                login: mockLogin,
                isAuthenticated: true,
                user: { role_id: 2, name: "Collaborator User" },
                loading: false,
            });

            render(<LoginPage />);

            expect(mockPush).toHaveBeenCalledWith("/collaborator/onboardings");
        });
    });

    describe("Accesibilidad", () => {
        it("debe tener labels asociados correctamente con los inputs", () => {
            render(<LoginPage />);

            const emailInput = screen.getByLabelText(/correo/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            expect(emailInput).toHaveAttribute("id", "email");
            expect(passwordInput).toHaveAttribute("id", "password");
        });

        it("debe tener placeholders descriptivos", () => {
            render(<LoginPage />);

            const emailInput = screen.getByPlaceholderText(
                "usuario@bancobogota.com"
            );
            const passwordInput = screen.getByPlaceholderText("••••••••");

            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
        });
    });
});
