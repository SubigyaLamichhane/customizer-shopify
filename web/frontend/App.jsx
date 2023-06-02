import { BrowserRouter } from "react-router-dom";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import "./assets/style.css";

import {
  AppBridgeProvider,
  QueryProvider,
  PolarisProvider,
} from "./components";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  const API_URL = "https://7c22-103-21-55-66.ngrok-free.app/api";
  
  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <NavigationMenu
              navigationLinks={[
                {
                  label: "Products",
                  destination: "/products",
                },
                {
                  label: "Art Category",
                  destination: "/category",
                },
                {
                  label: "Text Setting",
                  destination: "/textsetting"
                },
                {
                  label: "Settings",
                  destination: "/settings",
                },
              ]}
            />
            <Routes pages={pages} API_URL={API_URL} />
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
