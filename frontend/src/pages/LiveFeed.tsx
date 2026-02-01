// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Radio, TrendingUp, AlertTriangle, Flag, LoaderCircle } from "lucide-react";
// import { motion } from "framer-motion";
// import DashboardNav from "@/components/DashboardNav";
// import Sidebar from "@/components/Sidebar";

// const LiveFeed = () => {
//   const [selectedTab, setSelectedTab] = useState("all");
//   const [claims, setClaims] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // --- Data Fetching Logic ---
//   useEffect(() => {
//     const fetchClaims = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         // Fetch from both news and social endpoints concurrently
//         const [newsResponse, socialResponse] = await Promise.all([
//           fetch('http://localhost:8000/news/'),
//           fetch('http://localhost:8000/social/')
//         ]);

//         if (!newsResponse.ok || !socialResponse.ok) {
//           throw new Error('Network response was not ok from one of the sources.');
//         }

//         const newsData = await newsResponse.json();
//         const socialData = await socialResponse.json();

//         // --- Data Transformation ---
//         // Transform data from various sources into a unified 'claim' format
//         const transformedNews = newsData.map((item, index) => ({
//           id: `news-${item.id || index}`,
//           claim: item.title,
//           category: item.category || "News",
//           source: item.source || "News Wire",
//           trending: Math.random() < 0.3, // Assign trending status randomly for demo
//           flags: Math.floor(Math.random() * 200), // Assign random flags for demo
//           timestamp: new Date(item.published_at || Date.now()).toLocaleString(),
//           credibility: "unverified"
//         }));

//         const transformedSocial = socialData.map((item, index) => ({
//             id: `social-${item.id || index}`,
//             claim: item.text,
//             category: "Social Media", // Assign a general category
//             source: item.platform || "Social Media",
//             trending: Math.random() < 0.5,
//             flags: Math.floor(Math.random() * 300),
//             timestamp: new Date(item.created_at || Date.now()).toLocaleString(),
//             credibility: "unverified"
//         }));

//         // Combine and sort the data, newest first
//         const combinedClaims = [...transformedNews, ...transformedSocial].sort((a, b) => {
//             return new Date(b.timestamp) - new Date(a.timestamp);
//         });

//         setClaims(combinedClaims);

//       } catch (err) {
//         setError("Failed to fetch claims. Please make sure the backend server is running.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClaims();
//     // Optional: Set up an interval to refetch data periodically
//     const interval = setInterval(fetchClaims, 60000); // Refetch every 60 seconds
//     return () => clearInterval(interval); // Cleanup interval on component unmount

//   }, []); // Empty dependency array means this runs once on mount

//   const getCredibilityColor = (credibility) => {
//     switch (credibility) {
//       case "high": return "bg-green-500/10 text-green-500 border-green-500/20";
//       case "medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
//       case "low": return "bg-red-500/10 text-red-500 border-red-500/20";
//       default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
//     }
//   };

//   const filteredClaims = selectedTab === "all"
//     ? claims
//     : claims.filter(c => c.category.toLowerCase() === selectedTab);

//   const renderContent = () => {
//     if (loading && claims.length === 0) {
//       return (
//           <div className="flex flex-col items-center justify-center text-center h-64">
//               <LoaderCircle className="h-8 w-8 animate-spin text-primary mb-4" />
//               <p className="text-muted-foreground">Fetching live data from sources...</p>
//           </div>
//       );
//     }

//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center text-center h-64 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
//                 <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
//                 <h3 className="text-lg font-semibold text-destructive">Error</h3>
//                 <p className="text-muted-foreground">{error}</p>
//             </div>
//         );
//     }
    
//     if (filteredClaims.length === 0) {
//         return (
//              <div className="text-center h-64 flex items-center justify-center">
//                 <p className="text-muted-foreground">No claims found for the "{selectedTab}" category.</p>
//             </div>
//         )
//     }

//     return filteredClaims.map((item, index) => (
//       <motion.div
//         key={item.id}
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ delay: index * 0.05 }}
//       >
//         <Card className="hover:shadow-lg transition-shadow">
//           <CardContent className="p-6">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex-1 space-y-3">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <Badge variant="outline">{item.category}</Badge>
//                   <Badge variant="secondary" className="text-xs">
//                     {item.source}
//                   </Badge>
//                   {item.trending && (
//                     <Badge className="bg-primary/10 text-primary border-primary/20">
//                       <TrendingUp className="h-3 w-3 mr-1" />
//                       Trending
//                     </Badge>
//                   )}
//                   <Badge className={getCredibilityColor(item.credibility)}>
//                     {item.credibility === "unverified" ? "Unverified" : `${item.credibility} credibility`}
//                   </Badge>
//                 </div>
                
//                 <p className="text-lg font-medium leading-relaxed">
//                   {item.claim}
//                 </p>
                
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <span>{item.timestamp}</span>
//                   <span className="flex items-center gap-1">
//                     <Flag className="h-3 w-3" />
//                     {item.flags} flags
//                   </span>
//                 </div>
//               </div>
              
//               <div className="flex flex-col gap-2">
//                 <Button size="sm" className="bg-gradient-primary hover:opacity-90">
//                   Verify
//                 </Button>
//                 <Button size="sm" variant="outline">
//                   <Flag className="h-4 w-4 mr-1" />
//                   Flag
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     ));
//   };


//   return (
//     <div className="flex min-h-screen w-full bg-background">
//       <Sidebar />
      
//       <div className="flex-1 flex flex-col">
//         <DashboardNav />
        
//         <main className="flex-1 p-6 overflow-auto">
//           <div className="max-w-6xl mx-auto space-y-6">
//             {/* Header */}
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h1 className="text-3xl font-bold mb-2">Live Feed</h1>
//                   <p className="text-muted-foreground">Real-time stream of trending claims and misinformation</p>
//                 </div>
//                 <div className="flex items-center gap-2 text-primary">
//                   <Radio className="h-5 w-5 animate-pulse" />
//                   <span className="font-medium">Live</span>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Category Tabs */}
//             <Tabs value={selectedTab} onValueChange={setSelectedTab}>
//               <TabsList className="grid w-full grid-cols-5">
//                 <TabsTrigger value="all">All</TabsTrigger>
//                 <TabsTrigger value="political">Political</TabsTrigger>
//                 <TabsTrigger value="health">Health</TabsTrigger>
//                 <TabsTrigger value="economic">Economic</TabsTrigger>
//                 <TabsTrigger value="social media">Social Media</TabsTrigger>
//               </TabsList>

//               <TabsContent value={selectedTab} className="space-y-4 mt-6">
//                 {renderContent()}
//               </TabsContent>
//             </Tabs>

//             {/* Stats Summary */}
//             <Card className="bg-accent/50">
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2 text-base">
//                   <AlertTriangle className="h-5 w-5 text-yellow-500" />
//                   Feed Statistics
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-3 gap-4 text-center">
//                   <div>
//                     <div className="text-2xl font-bold text-primary">{claims.length}</div>
//                     <div className="text-sm text-muted-foreground">Active Claims</div>
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-yellow-500">
//                       {claims.filter(c => c.trending).length}
//                     </div>
//                     <div className="text-sm text-muted-foreground">Trending Now</div>
//                   </div>
//                   <div>
//                     <div className="text-2xl font-bold text-red-500">
//                       {claims.reduce((sum, c) => sum + c.flags, 0)}
//                     </div>
//                     <div className="text-sm text-muted-foreground">Total Flags</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default LiveFeed;


"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Radio,
  TrendingUp,
  AlertTriangle,
  Flag,
  LoaderCircle,
  RefreshCcw,
  Globe,
  Newspaper,
} from "lucide-react";
import DashboardNav from "@/components/DashboardNav";
import Sidebar from "@/components/Sidebar";

const LiveFeed = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [claims, setClaims] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------
  // 🔄 Data Fetching
  // ---------------------------
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      setError(null);

      try {
        const [newsResponse, socialResponse] = await Promise.all([
          fetch("https://verisense-backend.onrender.com/news/"),
          fetch("https://verisense-backend.onrender.com/social/"),
        ]);

        if (!newsResponse.ok || !socialResponse.ok) {
          throw new Error("Network response was not ok from one of the sources.");
        }

        const newsData = await newsResponse.json();
        const socialData = await socialResponse.json();

        // 📰 Transform News
        const transformedNews = Array.isArray(newsData.articles)
          ? newsData.articles.map((item: any, index: number) => ({
              id: `news-${item.article_id || index}`,
              claim: item.title,
              category: Array.isArray(item.category)
                ? item.category[0]
                : item.category || "News",
              source: item.source_name || "News Wire",
              trending: Math.random() < 0.3,
              flags: Math.floor(Math.random() * 200),
              timestamp: new Date(item.pubDate || Date.now()).toLocaleString(),
              credibility: "unverified",
              link: item.link,
            }))
          : [];

        // 💬 Transform Social
        const redditPosts = Array.isArray(socialData.reddit)
          ? socialData.reddit
          : [];
        const twitterPosts = Array.isArray(socialData.twitter)
          ? socialData.twitter
          : [];

        const transformedSocial = [...redditPosts, ...twitterPosts].map(
          (item: any, index: number) => ({
            id: `social-${index}`,
            claim: item.title,
            category: "Social Media",
            source: item.url.includes("reddit.com") ? "Reddit" : "Twitter",
            trending: item.score > 1000,
            flags: Math.floor(Math.random() * 300),
            timestamp: new Date().toLocaleString(),
            credibility: "unverified",
            link: item.url,
          })
        );

        const combined = [...transformedNews, ...transformedSocial].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setClaims(combined);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to fetch claims. Please ensure the backend API is running on https://verisense-backend.onrender.com."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
    const interval = setInterval(fetchClaims, 60000);
    return () => clearInterval(interval);
  }, []);

  // ---------------------------
  // 🎨 Helpers
  // ---------------------------
  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case "high":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "low":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const filteredClaims =
    selectedTab === "all"
      ? claims
      : claims.filter((c) =>
          c.category.toLowerCase().includes(selectedTab.toLowerCase())
        );

  // ---------------------------
  // 📦 Render States
  // ---------------------------
  const renderContent = () => {
    if (loading && claims.length === 0)
      return (
        <div className="flex flex-col items-center justify-center text-center h-64">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary mb-3" />
          <p className="text-muted-foreground">Fetching live data...</p>
        </div>
      );

    if (error)
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <AlertTriangle className="h-8 w-8 text-destructive mb-3" />
          <h3 className="text-lg font-semibold text-destructive">Error</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      );

    if (filteredClaims.length === 0)
      return (
        <div className="text-center h-64 flex items-center justify-center">
          <p className="text-muted-foreground">
            No claims found for the "{selectedTab}" category.
          </p>
        </div>
      );

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredClaims.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant="secondary" className="text-xs">
                    {item.source}
                  </Badge>
                  {item.trending && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                  <Badge className={getCredibilityColor(item.credibility)}>
                    {item.credibility === "unverified"
                      ? "Unverified"
                      : `${item.credibility} credibility`}
                  </Badge>
                </div>

                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold leading-relaxed hover:text-primary transition-colors"
                >
                  {item.claim}
                </a>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>{item.timestamp}</span>
                  <span className="flex items-center gap-1">
                    <Flag className="h-3 w-3" /> {item.flags}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  // ---------------------------
  // 🧭 UI Layout
  // ---------------------------
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-background via-background to-muted/20">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <DashboardNav />

        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  Live Feed
                </h1>
                <p className="text-muted-foreground">
                  Real-time stream of global claims and social trends
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-primary">
                  <Radio className="h-5 w-5 animate-pulse" />
                  <span className="font-medium">Live</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full sm:w-auto grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="politics">Politics</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="social media">Social</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="space-y-4 mt-6">
                {renderContent()}
              </TabsContent>
            </Tabs>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-accent/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Newspaper className="h-5 w-5 text-primary" />
                    Feed Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {claims.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Claims
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-500">
                        {claims.filter((c) => c.trending).length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Trending Now
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {claims.reduce((sum, c) => sum + c.flags, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Flags
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveFeed;
