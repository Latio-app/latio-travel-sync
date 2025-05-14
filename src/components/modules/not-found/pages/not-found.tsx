import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageContainer from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="h-20 w-20 rounded-full latio-gradient mb-6 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-latio-blue hover:bg-blue-600"
        >
          <Home className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </PageContainer>
  );
};

export default NotFound;
