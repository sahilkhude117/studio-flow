
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FlowProvider } from "./contexts/FlowContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FlowEditor from "./pages/FlowEditor";
import Connections from "./pages/Connections";
import Runs from "./pages/Runs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FlowProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="connections" element={<Connections />} />
              <Route path="runs" element={<Runs />} />
            </Route>
            <Route path="/flow/:flowId" element={<FlowEditor />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FlowProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
