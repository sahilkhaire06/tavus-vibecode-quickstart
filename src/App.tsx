import { useAtom } from "jotai";
import { screenAtom } from "./store/screens";
import { MainInterviewInterface } from "./screens/MainInterviewInterface";

function App() {
  return (
    <main className="h-screen bg-gray-50">
      <MainInterviewInterface />
    </main>
  );
}

export default App;
