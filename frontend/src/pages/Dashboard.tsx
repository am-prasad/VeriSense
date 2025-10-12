// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthChange, logout } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import DashboardNav from "@/components/DashboardNav";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // ✅ Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthChange((currentUser) => {
      if (!currentUser) navigate("/login");
      else setUser(currentUser);
    });
    return unsubscribe;
  }, [navigate]);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardNav />

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto space-y-6"
          >
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome, {user?.displayName || user?.email || "User"} 👋
                </h1>
                <p className="mt-2 text-indigo-100">
                  You are now authenticated with Firebase!
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="h-10"
              >
                Logout
              </Button>
            </div>

            {/* Stats / Cards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  News Claims Today
                </h2>
                <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  24
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Verified Claims
                </h2>
                <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                  18
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Pending Analysis
                </h2>
                <p className="mt-2 text-3xl font-bold text-yellow-500 dark:text-yellow-400">
                  6
                </p>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline">Fetch Latest News</Button>
                <Button variant="outline">Analyze Claims</Button>
                <Button variant="outline">Verify Sources</Button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
