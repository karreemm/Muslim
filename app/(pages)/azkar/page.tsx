import ReadAzkar from "./Azkar";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

export default function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-background text-foreground dark:bg-background dark:text-foreground">
        <ReadAzkar />
      </div>
    </>
  );
}
