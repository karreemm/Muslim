import Table from "./Table";
import Navbar from "../../../components/layout/Navbar";
import Footer from "../../../components/layout/Footer";

export default function App() {
  return (
    <>
      <main className="bg-background text-primary dark:bg-background dark:text-foreground flex flex-col ">
        <Table />
      </main>
    </>
  );
}
