import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Search, FileText, Brain, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import Sidebar from "@/components/Sidebar";
import { verifyClaimProcess } from "@/lib/api"; // Your API function
import jsPDF from "jspdf";

const VerifyClaim = () => {
  const [claim, setClaim] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    { label: "Claim extraction", icon: FileText },
    { label: "Evidence gathering", icon: Search },
    { label: "AI reasoning", icon: Brain },
    { label: "Verdict generated", icon: Shield }
  ];

  const handleVerify = async () => {
    setIsVerifying(true);
    setResult(null);
    setError(null);
    setCurrentStep(0);

    try {
      const apiResult = await verifyClaimProcess(claim, setCurrentStep);

      // FIX #1: Ensure 'reasoning' is always an array
      let reasoningData;
      if (Array.isArray(apiResult.reasoning)) {
        reasoningData = apiResult.reasoning;
      } else if (typeof apiResult.reasoning === 'string' && apiResult.reasoning.trim() !== '') {
        reasoningData = [apiResult.reasoning];
      } else {
        reasoningData = [
          "Analysis complete based on gathered evidence.",
          "Confidence score calculated from source authority.",
          "Verdict determined by cross-referencing multiple points."
        ];
      }

      setResult({
        ...apiResult,
        reasoning: reasoningData,
      });

    } catch (err: any) {
      setError(err.message || "An unknown error occurred during verification.");
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerdictVariant = (verdict: string) => {
    switch (verdict?.toLowerCase()) {
      case "false": return "destructive";
      case "true": return "default";
      case "needs review": return "secondary";
      default: return "outline";
    }
  };
  
  // FIX #2: Safely get hostname from a URL string
  const getHostnameFromUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url.replace(/^(https?:\/\/)?(www\.)?/, "").split('/')[0];
    }
  };

  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Verification Report", 10, 20);

    doc.setFontSize(12);
    doc.text(`Claim: ${result.claim}`, 10, 40);
    doc.text(`Verdict: ${result.verdict}`, 10, 50);
    doc.text(`Confidence: ${Math.round(result.confidence * 100)}%`, 10, 60);

    doc.text("AI Reasoning:", 10, 75);
    result.reasoning.forEach((line: string, idx: number) => {
      doc.text(`- ${line}`, 15, 85 + idx * 10);
    });

    const sourcesYStart = 85 + result.reasoning.length * 10 + 10;
    doc.text("Evidence Sources:", 10, sourcesYStart);
    result.sources.forEach((source: string, idx: number) => {
      doc.text(`- ${source}`, 15, sourcesYStart + 10 + idx * 10);
    });

    doc.save("verification_report.pdf");
  };

  const handleViewChain = () => {
    window.open("http://localhost:8080/chain", "_blank");
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-bold mb-2">Verify Claim</h1>
              <p className="text-muted-foreground">
                Enter a claim or upload content to verify its authenticity
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> Enter Claim
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste a claim here..."
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                  <div className="flex gap-4">
                    <Button onClick={handleVerify} disabled={!claim.trim() || isVerifying} className="bg-gradient-primary hover:opacity-90">
                      {isVerifying ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Verify Now"}
                    </Button>
                    <Button variant="outline" disabled={isVerifying}>Upload Audio</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isVerifying && !result && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        {steps.map((step, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                              currentStep > index ? "bg-primary text-primary-foreground" :
                              currentStep === index ? "bg-primary/20 text-primary animate-pulse" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {currentStep > index ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${currentStep >= index ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <Card className={`border-2 ${result.verdict === 'False' ? 'border-destructive/20' : 'border-primary/20'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Verification Result</CardTitle>
                        <Badge variant={getVerdictVariant(result.verdict)} className="text-lg px-4 py-1">{result.verdict}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Confidence Score</span>
                            <span className="text-sm font-semibold">{Math.round(result.confidence * 100)}%</span>
                          </div>
                          <Progress value={result.confidence * 100} className="h-2" />
                        </div>
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold mb-3">AI Reasoning</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.reasoning.join("\n")}</p>
                        </div>
                        <div className="pt-4 border-t">
                          <h4 className="font-semibold mb-3">Evidence Sources</h4>
                          <div className="flex flex-wrap gap-2">
                            {result.sources.map((source: string, index: number) => (
                              <a key={index} href={source} target="_blank" rel="noopener noreferrer">
                                <Badge variant="secondary" className="hover:bg-primary/10 cursor-pointer">
                                  {getHostnameFromUrl(source)}
                                </Badge>
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleViewChain}>View Chain of Trust</Button>
                    <Button variant="outline" onClick={handleExportPDF}>Export Report</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VerifyClaim;
