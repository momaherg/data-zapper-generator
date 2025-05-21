
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import UploadData from "./pages/UploadData";
import Tools from "./pages/Tools";
import TestSpecifications from "./pages/TestSpecifications";
import TestCaseDetail from "./pages/TestCaseDetail";
import StudioPage from "./pages/Studio";
import MainChat from "./components/MainChat";

// Wrapper component to extract session ID from URL
const ChatRoute = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = searchParams.get('session_id') || '';
  
  return <MainChat sessionId={sessionId} />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="upload" element={<UploadData />} />
            <Route path="tools" element={<Tools />} />
            <Route path="specs" element={<TestSpecifications />} />
            <Route path="studio" element={<StudioPage />} />
            <Route path="chat" element={<ChatRoute />} />
            <Route path="test-case/:id" element={<TestCaseDetail />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
