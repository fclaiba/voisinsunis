import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ArrowRight, BarChart3, Users, FileText, ShieldCheck } from "lucide-react";

interface WelcomePageProps {
    onNavigate: (page: "login" | "register") => void;
}

export function WelcomePage({ onNavigate }: WelcomePageProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/10">
            {/* Header */}
            <header className="w-full py-6 px-6 md:px-12 flex justify-between items-center z-10 bg-background/80 backdrop-blur-md sticky top-0 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">CIML</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => onNavigate("login")}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Iniciar Sesión
                    </Button>
                    <Button
                        onClick={() => onNavigate("register")}
                        className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
                    >
                        Registrarse
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex flex-col">
                <section className="relative py-20 md:py-32 px-6 md:px-12 flex flex-col items-center text-center overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '4s' }} />

                    <div className="space-y-6 max-w-4xl mx-auto relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-secondary-foreground text-sm font-medium mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            Sistema Operativo v2.5
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
                            Censo de Inteligencia de <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Mercado Laboral</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Plataforma integral para la gestión y análisis de datos demográficos y laborales.
                            Optimiza la toma de decisiones con información en tiempo real.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Button size="lg" onClick={() => onNavigate("register")} className="h-12 px-8 text-base shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1">
                                Comenzar ahora
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base hover:bg-muted/50 transition-all duration-300">
                                Ver documentación
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-20 px-6 md:px-12 bg-muted/30 border-t border-border/40">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BarChart3 className="h-6 w-6 text-blue-600" />}
                                title="Análisis Avanzado"
                                description="Visualiza tendencias y métricas clave con dashboards interactivos y reportes detallados."
                            />
                            <FeatureCard
                                icon={<Users className="h-6 w-6 text-green-600" />}
                                title="Gestión Familiar"
                                description="Administra información detallada de familias, incluyendo situación laboral, educativa y social."
                            />
                            <FeatureCard
                                icon={<ShieldCheck className="h-6 w-6 text-purple-600" />}
                                title="Seguridad Total"
                                description="Protección de datos de nivel empresarial con encriptación y control de acceso basado en roles."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 px-6 md:px-12 border-t border-border/40 bg-background text-center">
                <p className="text-sm text-muted-foreground">
                    © 2024 CIML. Todos los derechos reservados.
                </p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background/50 backdrop-blur-sm">
            <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
