import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Intro from "@/pages/intro";
import Calculator from "@/pages/calculator";

console.log('App component is being rendered'); // Debug log

function Router() {
  console.log('Router component is being rendered'); // Debug log
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/calculator/:price" component={Calculator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log('App function is being executed'); // Debug log
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;