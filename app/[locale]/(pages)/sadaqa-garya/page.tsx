import { SadaqaGaryaProvider } from "@/context/features/SadaqatContext";
import SadaqaGaryaPage from "./SadaqaGarya";

export default function App() {
  return (
    <SadaqaGaryaProvider>
      <SadaqaGaryaPage />
    </SadaqaGaryaProvider>
  );
}
