import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Intro from "@/pages/intro";
import Search from "@/pages/search";
import Calculator from "@/pages/calculator";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/search" component={Search} />
      <Route path="/calculator/:price" component={Calculator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;