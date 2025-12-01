import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft, CheckCircle2, Github, Mail, Users, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../ThemeToggle";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { toast } from "sonner";

interface AuthPageProps {
    initialMode?: "login" | "register";
    onLogin: (email: string) => void;
    onBack: () => void;
}

export function AuthPage({ initialMode = "login", onLogin, onBack }: AuthPageProps) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [registrationStatus, setRegistrationStatus] = useState<"idle" | "pending">("idle");

    // Form States
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regEmailConfirm, setRegEmailConfirm] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regPasswordConfirm, setRegPasswordConfirm] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validation for Registration
        if (mode === "register") {
            if (regEmail !== regEmailConfirm) {
                toast.error("Los correos electrónicos no coinciden");
                setIsLoading(false);
                return;
            }
            if (regPassword !== regPasswordConfirm) {
                toast.error("Las contraseñas no coinciden");
                setIsLoading(false);
                return;
            }
        }

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            if (mode === "login") {
                onLogin(loginEmail);
            } else {
                // Registration flow
                setRegistrationStatus("pending");
            }
        }, 1500);
    };

    if (registrationStatus === "pending") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
                <div className="max-w-md w-full space-y-6 text-center">
                    <div className="mx-auto h-20 w-20 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Registro Pendiente</h2>
                    <p className="text-muted-foreground text-lg">
                        Tu solicitud de registro ha sido enviada correctamente.
                        <br />
                        Un administrador debe aprobar tu cuenta antes de que puedas acceder.
                    </p>
                    <div className="pt-4">
                        <Button onClick={() => {
                            setRegistrationStatus("idle");
                            setMode("login");
                        }} variant="outline" className="w-full">
                            Volver al inicio de sesión
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex">
            {/* Left Side - Visual & Branding */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12 text-primary-foreground">
                {/* Background Patterns */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />

                {/* Content */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">CIML</span>
                    </div>

                    <h2 className="text-4xl font-bold leading-tight max-w-lg">
                        {mode === "login"
                            ? "Bienvenido de nuevo a tu espacio de trabajo."
                            : "Únete a la red de gestión social más avanzada."}
                    </h2>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="space-y-4">
                        <FeatureItem text="Gestión centralizada de familias" />
                        <FeatureItem text="Analítica predictiva con IA" />
                        <FeatureItem text="Seguridad de datos de grado militar" />
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 mt-12">
                        <p className="text-lg italic opacity-90">
                            "CIML ha transformado completamente cómo nuestro equipo gestiona el territorio. La eficiencia ha aumentado un 40% en el primer mes."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white/20" />
                            <div>
                                <p className="font-semibold">María González</p>
                                <p className="text-sm opacity-70">Coordinadora Territorial</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-background transition-colors duration-300 overflow-y-auto">
                <div className="p-6 flex justify-between items-center shrink-0">
                    <Button variant="ghost" onClick={onBack} className="gap-2 hover:bg-secondary/50">
                        <ArrowLeft className="h-4 w-4" /> Volver al inicio
                    </Button>
                    <ThemeToggle />
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                            </h1>
                            <p className="text-muted-foreground">
                                {mode === "login"
                                    ? "Ingresa tu correo para acceder al dashboard"
                                    : "Completa tus datos para solicitar acceso"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                {mode === "register" ? (
                                    // Registration Fields
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-username">Usuario</Label>
                                            <Input
                                                id="reg-username"
                                                placeholder="usuario123"
                                                required
                                                value={regUsername}
                                                onChange={(e) => setRegUsername(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-email">Correo Electrónico</Label>
                                                <Input
                                                    id="reg-email"
                                                    type="email"
                                                    placeholder="nombre@ejemplo.com"
                                                    required
                                                    value={regEmail}
                                                    onChange={(e) => setRegEmail(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-email-confirm">Repetir Correo</Label>
                                                <Input
                                                    id="reg-email-confirm"
                                                    type="email"
                                                    placeholder="Confirmar correo"
                                                    required
                                                    value={regEmailConfirm}
                                                    onChange={(e) => setRegEmailConfirm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="reg-phone">Número de Teléfono</Label>
                                            <Input
                                                id="reg-phone"
                                                type="tel"
                                                placeholder="+54 11 ..."
                                                required
                                                value={regPhone}
                                                onChange={(e) => setRegPhone(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-password">Contraseña</Label>
                                                <Input
                                                    id="reg-password"
                                                    type="password"
                                                    required
                                                    value={regPassword}
                                                    onChange={(e) => setRegPassword(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="reg-password-confirm">Repetir Contraseña</Label>
                                                <Input
                                                    id="reg-password-confirm"
                                                    type="password"
                                                    required
                                                    value={regPasswordConfirm}
                                                    onChange={(e) => setRegPasswordConfirm(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-3 bg-muted/50 rounded-lg border border-border/50 text-xs text-muted-foreground">
                                            <p className="font-medium text-foreground mb-1">Nota de Seguridad:</p>
                                            No se permite registrar múltiples cuentas desde la misma dirección IP/MAC.
                                        </div>
                                    </>
                                ) : (
                                    // Login Fields
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email">Correo Electrónico</Label>
                                            <Input
                                                id="login-email"
                                                type="email"
                                                placeholder="usuario@correo.com"
                                                required
                                                className="h-11"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="login-password">Contraseña</Label>
                                                <a href="#" className="text-sm font-medium text-primary hover:underline">
                                                    ¿Olvidaste tu contraseña?
                                                </a>
                                            </div>
                                            <Input
                                                id="login-password"
                                                type="password"
                                                required
                                                className="h-11"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <Button type="submit" className="w-full h-11 text-base shadow-lg shadow-primary/20" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                        Procesando...
                                    </span>
                                ) : (
                                    mode === "login" ? "Ingresar" : "Solicitar Cuenta"
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        O continuar con
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" className="h-11">
                                    <Github className="mr-2 h-4 w-4" /> Github
                                </Button>
                                <Button variant="outline" type="button" className="h-11">
                                    <Mail className="mr-2 h-4 w-4" /> Google
                                </Button>
                            </div>
                        </form>

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">
                                {mode === "login" ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
                            </span>{" "}
                            <button
                                onClick={() => {
                                    setMode(mode === "login" ? "register" : "login");
                                    // Clear forms on switch
                                    setLoginEmail("");
                                    setLoginPassword("");
                                    setRegUsername("");
                                    setRegEmail("");
                                    setRegEmailConfirm("");
                                    setRegPhone("");
                                    setRegPassword("");
                                    setRegPasswordConfirm("");
                                }}
                                className="font-medium text-primary hover:underline transition-all"
                            >
                                {mode === "login" ? "Regístrate aquí" : "Inicia sesión aquí"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">{text}</span>
        </div>
    );
}
