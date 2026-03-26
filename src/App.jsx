import { BrowserRouter, Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import NotFound404 from "./pages/NotFound404";
import UserPage from "./pages/UserPage";
import SearchPage from "./pages/SearchPage";
import { ThemeProvider } from "@/components/theme-provider";
import Register from "./pages/Register";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<UserPage />} />
            <Route path="search" element={<SearchPage />} /> {/* The Search Route */}
            <Route path="register" element={<Register/>}/>
            <Route path="*" element={<NotFound404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;