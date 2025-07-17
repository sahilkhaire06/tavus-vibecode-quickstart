import { useAtom } from "jotai";
import { screenAtom } from "./store/screens";
import {
  IntroLoading,
  Intro,
} from "./screens";
import { MainInterviewInterface } from "./screens/MainInterviewInterface";

function App() {
  const [{ currentScreen }] = useAtom(screenAtom);

  const renderScreen = () => {
    switch (currentScreen) {
      case "introLoading":
        return <IntroLoading />;
      case "intro":
        return <Intro />;
      case "conversation":
        return <MainInterviewInterface />;
      default:
        return <IntroLoading />;
    }
  };

  return (
    <main className="h-screen bg-gray-50">
      {renderScreen()}
    </main>
  );
}

export default App;
