import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "../page";
import { ApiService } from "@/api/api-backend";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

jest.mock("@/api/api-backend");
jest.mock("@/contexts/auth-context");

const mockPush = jest.fn();
const mockRegister = jest.fn();

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

describe("RegisterPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        });
        (useAuth as jest.Mock).mockReturnValue({
            isAuthenticated: false,
            user: null,
            loading: false,
        });
        (ApiService.register as jest.Mock) = mockRegister;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("Renderizado inicial", () => {
        it("debe renderizar el formulario de registro correctamente", () => {
            render(<RegisterPage />);

            expect(
                screen.getByText("Registro de Colaboradores")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Completa el formulario para crear tu cuenta")
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(/nombre completo/i)
            ).toBeInTheDocument();
            expect(
                screen.getByLabelText(/correo electrónico/i)
            ).toBeInTheDocument();
            expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
            expect(
                screen.getByRole("button", { name: /registrarse/i })
            ).toBeInTheDocument();
        });

        it("debe mostrar el logo del Banco de Bogotá", () => {
            render(<RegisterPage />);

            const logo = screen.getByAltText("Banco de Bogotá");
            expect(logo).toBeInTheDocument();
        });

        it("debe mostrar enlaces de navegación", () => {
            render(<RegisterPage />);

            expect(
                screen.getByText(/¿Ya tienes una cuenta?/i)
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: /inicia sesión aquí/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: /volver al inicio/i })
            ).toBeInTheDocument();
        });

        it("debe mostrar el mensaje de requisitos de contraseña", () => {
            render(<RegisterPage />);

            expect(
                screen.getByText(
                    "Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
                )
            ).toBeInTheDocument();
        });
    });

    describe("Estado de carga", () => {
        it("debe mostrar pantalla de carga cuando loading es true", () => {
            (useAuth as jest.Mock).mockReturnValue({
                isAuthenticated: false,
                user: null,
                loading: true,
            });

            render(<RegisterPage />);

            expect(
                screen.getByText("Verificando sesión...")
            ).toBeInTheDocument();
        });

        it("no debe renderizar el formulario cuando ya está autenticado", () => {
            (useAuth as jest.Mock).mockReturnValue({
                isAuthenticated: true,
                user: { role_id: 2, name: "Test User" },
                loading: false,
            });

            const { container } = render(<RegisterPage />);
            expect(container.firstChild).toBeNull();
        });
    });

    describe("Validación del formulario", () => {
        it("debe mostrar error cuando el nombre está vacío", async () => {
            render(<RegisterPage />);

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("El nombre es requerido")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando el email está vacío", async () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            await userEvent.type(nameInput, "Juan Pérez");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("El correo es requerido")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando el email no es válido", async () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "emailinvalido");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Debe ser un correo válido")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando la contraseña tiene menos de 8 caracteres", async () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Pass1!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Debe tener al menos 8 caracteres")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando la contraseña no tiene mayúscula", async () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Debe contener al menos una mayúscula")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando la contraseña no tiene número", async () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Debe contener al menos un número")
                ).toBeInTheDocument();
            });
        });

        it("debe mostrar error cuando la contraseña no tiene símbolo", async () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Debe contener al menos un símbolo")
                ).toBeInTheDocument();
            });
        });

        it("debe aceptar una contraseña válida", async () => {
            mockRegister.mockResolvedValue({ success: true });

            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith({
                    name: "Juan Pérez",
                    email: "juan@bancobogota.com",
                    password: "Password123!",
                    role_id: 2,
                });
            });
        });
    });

    describe("Funcionalidad de mostrar/ocultar contraseña", () => {
        it("debe tener un botón para mostrar/ocultar la contraseña", () => {
            render(<RegisterPage />);

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

    describe("Proceso de registro", () => {
        it("debe mostrar estado de carga durante el registro", async () => {
            let resolveRegister: (value: any) => void;
            mockRegister.mockImplementation(
                () =>
                    new Promise((resolve) => {
                        resolveRegister = resolve;
                    })
            );

            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(screen.getByText("Registrando...")).toBeInTheDocument();
                expect(submitButton).toBeDisabled();
            });
        });

        it("debe mostrar mensaje de éxito y redirigir después del registro exitoso", async () => {
            mockRegister.mockResolvedValue({ success: true });

            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Registro exitoso",
                    description:
                        "Te has registrado exitosamente. Redirigiendo...",
                });
            });
        });

        it("debe mostrar error cuando el registro falla", async () => {
            mockRegister.mockRejectedValue(new Error("Registration failed"));

            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalledWith({
                    title: "Error en el registro",
                    description:
                        "No se pudo completar el registro. Por favor, intenta nuevamente.",
                    variant: "destructive",
                });
            });
        });

        it("debe registrar usuario con role_id = 2 (Colaborador)", async () => {
            mockRegister.mockResolvedValue({ success: true });

            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockRegister).toHaveBeenCalledWith(
                    expect.objectContaining({
                        role_id: 2,
                    })
                );
            });
        });
    });

    describe("Redirección automática", () => {
        it("debe redirigir automáticamente si el usuario ya está autenticado (admin)", () => {
            (useAuth as jest.Mock).mockReturnValue({
                isAuthenticated: true,
                user: { role_id: 1, name: "Admin User" },
                loading: false,
            });

            render(<RegisterPage />);

            expect(mockPush).toHaveBeenCalledWith("/dashboard");
        });

        it("debe redirigir automáticamente si el usuario ya está autenticado (colaborador)", () => {
            (useAuth as jest.Mock).mockReturnValue({
                isAuthenticated: true,
                user: { role_id: 2, name: "Collaborator User" },
                loading: false,
            });

            render(<RegisterPage />);

            expect(mockPush).toHaveBeenCalledWith("/collaborator/onboardings");
        });
    });

    describe("Accesibilidad", () => {
        it("debe tener labels asociados correctamente con los inputs", () => {
            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(/nombre completo/i);
            const emailInput = screen.getByLabelText(/correo electrónico/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);

            expect(nameInput).toHaveAttribute("id", "name");
            expect(emailInput).toHaveAttribute("id", "email");
            expect(passwordInput).toHaveAttribute("id", "password");
        });

        it("debe tener placeholders descriptivos", () => {
            render(<RegisterPage />);

            const nameInput = screen.getByPlaceholderText("Juan Pérez");
            const emailInput = screen.getByPlaceholderText(
                "usuario@bancobogota.com"
            );
            const passwordInput = screen.getByPlaceholderText("••••••••");

            expect(nameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
        });

        it("debe mostrar información de ayuda para la contraseña", () => {
            render(<RegisterPage />);

            const helpText = screen.getByText(
                "Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
            );
            expect(helpText).toBeInTheDocument();
            expect(helpText).toHaveClass("text-xs");
        });
    });

    describe("Integración con campos del formulario", () => {
        it("debe mantener los valores ingresados después de un error", async () => {
            mockRegister.mockRejectedValue(new Error("Registration failed"));

            render(<RegisterPage />);

            const nameInput = screen.getByLabelText(
                /nombre completo/i
            ) as HTMLInputElement;
            const emailInput = screen.getByLabelText(
                /correo electrónico/i
            ) as HTMLInputElement;
            const passwordInput = screen.getByLabelText(
                /contraseña/i
            ) as HTMLInputElement;

            await userEvent.type(nameInput, "Juan Pérez");
            await userEvent.type(emailInput, "juan@bancobogota.com");
            await userEvent.type(passwordInput, "Password123!");

            const submitButton = screen.getByRole("button", {
                name: /registrarse/i,
            });
            await userEvent.click(submitButton);

            await waitFor(() => {
                expect(mockToast).toHaveBeenCalled();
            });

            expect(nameInput.value).toBe("Juan Pérez");
            expect(emailInput.value).toBe("juan@bancobogota.com");
            expect(passwordInput.value).toBe("Password123!");
        });
    });
});
