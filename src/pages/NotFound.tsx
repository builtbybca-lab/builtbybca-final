import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, WifiOff } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md space-y-6"
      >
        <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-secondary/30">
          <WifiOff className="h-16 w-16 text-muted-foreground" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-bca-red/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-7xl font-bold tracking-tighter text-foreground font-pixelify">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Connection Lost</h2>
          <p className="text-muted-foreground">
            The page you're looking for seems to have been disconnected from the network.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild size="lg" className="group">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Return to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
