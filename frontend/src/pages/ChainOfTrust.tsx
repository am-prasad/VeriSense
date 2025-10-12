import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Download, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import DashboardNav from "@/components/DashboardNav";
import Sidebar from "@/components/Sidebar";

const ChainOfTrust = () => {
  const graphRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState("");
  const [extractedClaim, setExtractedClaim] = useState("");

  // Zoom & PDF handlers
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleMaximize = () => graphRef.current?.requestFullscreen?.();

  const handleDownload = async () => {
    if (!graphRef.current) return;
    const canvas = await html2canvas(graphRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "pt", [canvas.width, canvas.height]);
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("chain_of_trust.pdf");
  };

  // Step 1: Extract claim from user input
  const handleExtractClaim = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to extract claim from.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/claims/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) throw new Error(`Extraction failed: ${response.statusText}`);

      const data = await response.json();
      setExtractedClaim(data.claim || "");
      await handleVerifyClaim(data.claim);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify extracted claim
  const handleVerifyClaim = async (claimText) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8000/verification/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim: claimText }),
      });

      if (!response.ok) throw new Error(`Verification failed: ${response.statusText}`);

      const data = await response.json();

      // Transform response into visual nodes
      const formattedNodes = [
        { id: 1, label: data.claim || "Original Claim", type: "claim", x: 50, y: 10 },
        ...(data.sources || []).map((src, idx) => ({
          id: idx + 2,
          label: src.name,
          type: "source",
          x: 20 + idx * 30,
          y: 40,
          confidence: src.confidence,
        })),
        { id: 100, label: "Evidence Analysis", type: "analysis", x: 50, y: 70 },
        { id: 101, label: `Final Verdict: ${data.verdict}`, type: "verdict", x: 50, y: 90 },
      ];

      setNodes(formattedNodes);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Chain of Trust Visualizer</h1>
                  <p className="text-muted-foreground">
                    Interactive graph showing evidence relationships and verification flow
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleZoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleZoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleMaximize}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              {/* Text Input */}
              <div className="mt-4 flex gap-3">
                <input
                  type="text"
                  placeholder="Enter text or article to analyze..."
                  className="flex-1 px-3 py-2 border rounded-md bg-background"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button onClick={handleExtractClaim} disabled={loading}>
                  {loading ? "Processing..." : "Verify Claim"}
                </Button>
              </div>

              {extractedClaim && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Extracted Claim:</strong> {extractedClaim}
                </p>
              )}

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </motion.div>

            {/* Graph Visualization */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="min-h-[600px]">
                <CardContent className="p-8">
                  <div
                    ref={graphRef}
                    className="relative h-[550px] bg-accent/20 rounded-lg border-2 border-dashed border-border overflow-hidden"
                    style={{ transform: `scale(${scale})`, transformOrigin: "center" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center space-y-4">
                        <GitBranch className="h-16 w-16 mx-auto text-primary opacity-50" />
                        <div>
                          <p className="text-lg font-semibold mb-2">Interactive Graph View</p>
                          <p className="text-sm text-muted-foreground max-w-md">
                            This area displays the evidence network linking your claim to trusted sources and verdicts.
                          </p>
                        </div>

                        {nodes.length > 0 ? (
                          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
                            {nodes
                              .filter((node) => node.type === "source")
                              .map((node) => (
                                <div
                                  key={node.id}
                                  className="p-4 rounded-lg border-2 border-primary/20 bg-card hover:border-primary/50 transition-colors"
                                >
                                  <Badge variant="secondary" className="mb-2">
                                    {node.type}
                                  </Badge>
                                  <p className="text-sm font-medium mb-1">{node.label}</p>
                                  {node.confidence && (
                                    <p className="text-xs text-muted-foreground">{node.confidence}% confidence</p>
                                  )}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-6">
                            Enter text and click “Verify Claim” to see results.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Legend & Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Graph Legend</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-primary" />
                      <span className="text-sm">Original Claim</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-success" />
                      <span className="text-sm">Trusted Source</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-warning" />
                      <span className="text-sm">Analysis Node</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-destructive" />
                      <span className="text-sm">Final Verdict</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Verification Details</CardTitle>
                    <CardDescription>Summary of evidence chain</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sources:</span>
                      <span className="font-semibold">{nodes.filter((n) => n.type === "source").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg. Confidence:</span>
                      <span className="font-semibold">
                        {nodes.filter((n) => n.confidence).length > 0
                          ? `${Math.round(
                              nodes.filter((n) => n.confidence).reduce((a, b) => a + b.confidence, 0) /
                                nodes.filter((n) => n.confidence).length
                            )}%`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Analysis Depth:</span>
                      <span className="font-semibold">{nodes.length > 0 ? "4 levels" : "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verification Time:</span>
                      <span className="font-semibold">{loading ? "Processing..." : "2.3 seconds"}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChainOfTrust;

