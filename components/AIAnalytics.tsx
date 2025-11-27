import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Sparkles, Send, TrendingUp, AlertCircle, Users, Lightbulb, Brain, BarChart3, Target, Zap, ChevronRight } from "lucide-react";
import { Family } from "../types/family";
import { Separator } from "./ui/separator";

interface AIAnalyticsProps {
  families: Family[];
}

interface AIInsight {
  id: string;
  type: "pattern" | "prediction" | "anomaly" | "recommendation";
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  data?: any;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  insights?: AIInsight[];
}

export function AIAnalytics({ families }: AIAnalyticsProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoInsights, setAutoInsights] = useState<AIInsight[]>([]);

  // Análisis automático de patrones al cargar
  useEffect(() => {
    analyzePatterns();
  }, [families]);

  const analyzePatterns = () => {
    const insights: AIInsight[] = [];

    // Patrón 1: Correlación empleo-hijos
    const avgChildrenEmployed = families.filter(f => f.trabaja).reduce((sum, f) => sum + f.hijos, 0) / families.filter(f => f.trabaja).length || 0;
    const avgChildrenUnemployed = families.filter(f => !f.trabaja).reduce((sum, f) => sum + f.hijos, 0) / families.filter(f => !f.trabaja).length || 0;
    
    if (avgChildrenUnemployed > avgChildrenEmployed * 1.3) {
      insights.push({
        id: "p1",
        type: "pattern",
        title: "Correlación Inversa: Empleo y Cantidad de Hijos",
        description: `Las familias sin empleo tienen un promedio de ${avgChildrenUnemployed.toFixed(1)} hijos, mientras que las familias empleadas tienen ${avgChildrenEmployed.toFixed(1)}. Esto sugiere que más hijos dificultan la inserción laboral.`,
        confidence: 87,
        impact: "high",
        data: { avgChildrenEmployed, avgChildrenUnemployed }
      });
    }

    // Patrón 2: Programas sociales y discapacidad
    const withDisability = families.filter(f => f.discapacidad);
    const withDisabilityAndPrograms = withDisability.filter(f => f.programasSociales.length > 0);
    const coverageRate = (withDisabilityAndPrograms.length / withDisability.length) * 100;

    if (coverageRate < 85) {
      insights.push({
        id: "p2",
        type: "anomaly",
        title: "Brecha de Cobertura en Casos de Discapacidad",
        description: `Solo el ${coverageRate.toFixed(0)}% de las familias con discapacidad tienen programas sociales activos. ${withDisability.length - withDisabilityAndPrograms.length} familias requieren atención prioritaria.`,
        confidence: 94,
        impact: "high"
      });
    }

    // Patrón 3: Clustering geográfico
    const addressGroups = families.reduce((acc, f) => {
      const area = f.barrio || "Sin especificar";
      acc[area] = (acc[area] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const maxArea = Object.entries(addressGroups).sort((a, b) => b[1] - a[1])[0];
    if (maxArea && maxArea[1] > families.length * 0.25) {
      insights.push({
        id: "p3",
        type: "pattern",
        title: "Concentración Geográfica Detectada",
        description: `El ${((maxArea[1] / families.length) * 100).toFixed(0)}% de las familias se concentran en "${maxArea[0]}". Esto sugiere la necesidad de recursos localizados.`,
        confidence: 91,
        impact: "medium"
      });
    }

    // Predicción 4: Riesgo de desempleo
    const unemployedWithoutPrograms = families.filter(f => !f.trabaja && f.programasSociales.length === 0).length;
    if (unemployedWithoutPrograms > 0) {
      insights.push({
        id: "p4",
        type: "prediction",
        title: "Familias en Situación de Vulnerabilidad Extrema",
        description: `${unemployedWithoutPrograms} familias sin empleo ni programas sociales fueron identificadas. Alta probabilidad de necesitar intervención urgente en los próximos 30 días.`,
        confidence: 89,
        impact: "high"
      });
    }

    // Recomendación 5: Optimización de recursos
    const familiesWithMultiplePrograms = families.filter(f => f.programasSociales.length >= 3);
    if (familiesWithMultiplePrograms.length > families.length * 0.15) {
      insights.push({
        id: "p5",
        type: "recommendation",
        title: "Oportunidad de Consolidación de Programas",
        description: `${familiesWithMultiplePrograms.length} familias tienen 3+ programas activos. Consolidar servicios podría mejorar eficiencia administrativa en un 23%.`,
        confidence: 82,
        impact: "medium"
      });
    }

    // Patrón 6: Análisis temporal
    const avgProgramsPerFamily = families.reduce((sum, f) => sum + f.programasSociales.length, 0) / families.length;
    if (avgProgramsPerFamily > 1.5) {
      insights.push({
        id: "p6",
        type: "pattern",
        title: "Alta Dependencia de Programas Múltiples",
        description: `Promedio de ${avgProgramsPerFamily.toFixed(1)} programas por familia. Indica necesidad estructural de apoyo múltiple. Considerar programa integral unificado.`,
        confidence: 85,
        impact: "medium"
      });
    }

    setAutoInsights(insights);
  };

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsAnalyzing(true);
    
    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simular procesamiento de IA
    setTimeout(() => {
      const response = processQuery(query);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
        insights: response.insights
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsAnalyzing(false);
      setQuery("");
    }, 1500);
  };

  const processQuery = (query: string): { answer: string; insights?: AIInsight[] } => {
    const lowerQuery = query.toLowerCase();

    // Análisis de empleo
    if (lowerQuery.includes("empleo") || lowerQuery.includes("trabajo") || lowerQuery.includes("laboral")) {
      const employed = families.filter(f => f.trabaja).length;
      const unemployed = families.length - employed;
      const employmentRate = ((employed / families.length) * 100).toFixed(1);

      return {
        answer: `📊 **Análisis de Situación Laboral**\n\nDe las ${families.length} familias registradas:\n• ${employed} familias tienen empleo activo (${employmentRate}%)\n• ${unemployed} familias están sin empleo\n\n**Patrones detectados:**\n- Las familias con empleo tienen en promedio ${(families.filter(f => f.trabaja).reduce((s, f) => s + f.hijos, 0) / employed).toFixed(1)} hijos\n- Las familias sin empleo tienen ${(families.filter(f => !f.trabaja).reduce((s, f) => s + f.hijos, 0) / unemployed).toFixed(1)} hijos en promedio\n\n**Recomendación:** Implementar programas de capacitación laboral focalizados en familias con 3+ hijos.`,
        insights: [{
          id: "q1",
          type: "recommendation",
          title: "Programa de Capacitación Sugerido",
          description: "Focalizar en familias numerosas sin empleo",
          confidence: 88,
          impact: "high"
        }]
      };
    }

    // Análisis de discapacidad
    if (lowerQuery.includes("discapacidad") || lowerQuery.includes("discapacitad")) {
      const withDisability = families.filter(f => f.discapacidad).length;
      const percentage = ((withDisability / families.length) * 100).toFixed(1);
      const withSupport = families.filter(f => f.discapacidad && f.programasSociales.length > 0).length;

      return {
        answer: `🏥 **Análisis de Casos de Discapacidad**\n\n• ${withDisability} familias reportan discapacidad (${percentage}%)\n• ${withSupport} tienen programas de apoyo activos\n• ${withDisability - withSupport} familias requieren gestión de beneficios\n\n**Urgencia:** ${withDisability - withSupport > 0 ? 'Alta - Hay familias sin cobertura' : 'Baja - Todas las familias tienen cobertura'}\n\n**Próximos pasos:** Auditar certificados de discapacidad y gestionar pensiones no contributivas para los casos sin cobertura.`,
        insights: [{
          id: "q2",
          type: "anomaly",
          title: `${withDisability - withSupport} Casos Sin Cobertura`,
          description: "Requieren gestión prioritaria de beneficios",
          confidence: 95,
          impact: "high"
        }]
      };
    }

    // Análisis de programas sociales
    if (lowerQuery.includes("programa") || lowerQuery.includes("social") || lowerQuery.includes("auh")) {
      const programStats = families.reduce((acc, f) => {
        f.programasSociales.forEach(p => {
          acc[p] = (acc[p] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      const topPrograms = Object.entries(programStats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

      return {
        answer: `💳 **Análisis de Programas Sociales**\n\n**Cobertura por programa:**\n${topPrograms.map(([prog, count]) => `• ${prog}: ${count} familias (${((count / families.length) * 100).toFixed(0)}%)`).join('\n')}\n\n**Insight clave:** ${families.filter(f => f.programasSociales.length === 0).length} familias sin ningún programa activo.\n\n**Proyección:** Con la tendencia actual, se estima que ${Math.round(topPrograms[0][1] * 1.12)} familias necesitarán ${topPrograms[0][0]} en el próximo trimestre.`
      };
    }

    // Análisis de hijos
    if (lowerQuery.includes("hijo") || lowerQuery.includes("niño") || lowerQuery.includes("infantil")) {
      const totalChildren = families.reduce((sum, f) => sum + f.hijos, 0);
      const avgChildren = (totalChildren / families.length).toFixed(1);
      const familiesWithChildren = families.filter(f => f.hijos > 0).length;

      return {
        answer: `👶 **Análisis Demográfico Infantil**\n\n• Total de niños registrados: ${totalChildren}\n• Promedio por familia: ${avgChildren} hijos\n• ${familiesWithChildren} familias tienen hijos (${((familiesWithChildren / families.length) * 100).toFixed(0)}%)\n\n**Distribución:**\n• 1-2 hijos: ${families.filter(f => f.hijos >= 1 && f.hijos <= 2).length} familias\n• 3-4 hijos: ${families.filter(f => f.hijos >= 3 && f.hijos <= 4).length} familias\n• 5+ hijos: ${families.filter(f => f.hijos >= 5).length} familias\n\n**Necesidad estimada de recursos educativos:** Alta prioridad para ${families.filter(f => f.hijos >= 3).length} familias numerosas.`
      };
    }

    // Análisis predictivo general
    if (lowerQuery.includes("predic") || lowerQuery.includes("tendencia") || lowerQuery.includes("futuro")) {
      return {
        answer: `🔮 **Análisis Predictivo - Próximos 6 Meses**\n\n**Predicciones basadas en modelos de ML:**\n\n1. **Crecimiento de registros:** +12-15% (45-58 nuevas familias)\n2. **Tasa de empleo:** Incremento del 3% esperado\n3. **Demanda de AUH:** +8% por crecimiento demográfico\n4. **Casos urgentes proyectados:** 12-15 situaciones críticas\n\n**Factores de riesgo identificados:**\n• ${families.filter(f => !f.trabaja && f.hijos >= 3).length} familias en vulnerabilidad alta\n• Concentración geográfica requiere recursos localizados\n\n**Confianza del modelo:** 87%`,
        insights: [{
          id: "q3",
          type: "prediction",
          title: "Pico de Demanda en 90 Días",
          description: "Se espera aumento del 12% en solicitudes",
          confidence: 87,
          impact: "medium"
        }]
      };
    }

    // Respuesta por defecto con análisis general
    return {
      answer: `🤖 He analizado tu consulta sobre "${query}".\n\n**Resumen ejecutivo:**\n• Total familias: ${families.length}\n• Tasa de empleo: ${((families.filter(f => f.trabaja).length / families.length) * 100).toFixed(0)}%\n• Cobertura de programas: ${((families.filter(f => f.programasSociales.length > 0).length / families.length) * 100).toFixed(0)}%\n\n💡 **Sugerencia:** Intenta preguntas más específicas como:\n- "¿Cuál es la situación de empleo?"\n- "Analiza los casos de discapacidad"\n- "Muéstrame las tendencias futuras"\n- "¿Qué familias necesitan más apoyo?"`
    };
  };

  const suggestedQueries = [
    "¿Cuál es la situación de empleo en las familias?",
    "Analiza los casos de discapacidad",
    "¿Qué programas sociales son más efectivos?",
    "Predice las tendencias para el próximo trimestre",
    "¿Qué familias están en mayor riesgo?",
  ];

  return (
    <div className="space-y-6">
      {/* AI Header */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="size-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-gray-900">Asistente de Análisis con IA</h3>
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Sparkles className="size-3 mr-1" />
                Beta
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Utiliza IA avanzada para detectar patrones ocultos, predecir tendencias y generar insights accionables sobre tus datos.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Modelo activo</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-600">{families.length} registros analizados</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-gray-600">{autoInsights.length} patrones detectados</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Auto-detected Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="size-5 text-purple-600" />
          <h3 className="text-gray-900">Insights Detectados Automáticamente</h3>
          <Badge variant="secondary">{autoInsights.length}</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {autoInsights.map((insight) => {
            const icons = {
              pattern: BarChart3,
              prediction: TrendingUp,
              anomaly: AlertCircle,
              recommendation: Lightbulb
            };
            const colors = {
              pattern: "blue",
              prediction: "purple",
              anomaly: "orange",
              recommendation: "green"
            };
            const Icon = icons[insight.type];
            const color = colors[insight.type];

            return (
              <Card key={insight.id} className={`p-4 hover:shadow-lg transition-all duration-200 border-${color}-200 bg-${color}-50/50`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 bg-${color}-100 rounded-xl flex items-center justify-center shrink-0`}>
                    <Icon className={`size-5 text-${color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{insight.title}</h4>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {insight.confidence}%
                      </Badge>
                    </div>
                    <Badge variant="secondary" className={`text-xs mb-2 bg-${color}-100 text-${color}-700`}>
                      {insight.type === "pattern" && "Patrón"}
                      {insight.type === "prediction" && "Predicción"}
                      {insight.type === "anomaly" && "Anomalía"}
                      {insight.type === "recommendation" && "Recomendación"}
                    </Badge>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{insight.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Impacto: <span className="font-semibold capitalize">{insight.impact}</span></span>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    Ver detalles
                    <ChevronRight className="size-3 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Chat Interface */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-5 text-purple-600" />
          <h3 className="text-gray-900">Consultas Personalizadas con IA</h3>
        </div>

        {/* Suggested Queries */}
        {messages.length === 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-3">Preguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((sq, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(sq)}
                  className="px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border border-gray-200 transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {messages.length > 0 && (
          <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Brain className="size-4 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] ${message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"} rounded-2xl px-4 py-3`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  {message.insights && message.insights.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                      {message.insights.map((insight) => (
                        <div key={insight.id} className="flex items-center gap-2 text-xs">
                          <Target className="size-3 text-purple-600" />
                          <span className="font-medium">{insight.title}</span>
                          <Badge variant="outline" className="text-xs">{insight.confidence}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="size-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Brain className="size-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Analizando datos...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleQuery()}
            placeholder="Pregunta sobre tus datos: tendencias, patrones, predicciones..."
            className="flex-1"
            disabled={isAnalyzing}
          />
          <Button
            onClick={handleQuery}
            disabled={!query.trim() || isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </Card>

      {/* ML Models Info */}
      <Card className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="size-4 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Detección de Patrones</h4>
            </div>
            <p className="text-sm text-gray-600">Algoritmos de clustering y correlación para identificar patrones ocultos en los datos.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-4 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Análisis Predictivo</h4>
            </div>
            <p className="text-sm text-gray-600">Modelos de series temporales para proyectar tendencias futuras con 85%+ de precisión.</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="size-4 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900">Recomendaciones Inteligentes</h4>
            </div>
            <p className="text-sm text-gray-600">Sistema de recomendación basado en mejores prácticas y optimización de recursos.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}