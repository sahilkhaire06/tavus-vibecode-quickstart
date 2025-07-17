import { useAtom } from "jotai";
import { screenAtom } from "./store/screens";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import {
  IntroLoading,
  Outage,
  OutOfMinutes,
  Intro,
  Instructions,
  Conversation,
  FinalScreen,
  Settings,
} from "./screens";
import { UserProfileForm } from "./screens/UserProfileForm";
import { InterviewSession } from "./screens/InterviewSession";
import { InterviewFeedback } from "./screens/InterviewFeedback";

function App() {
  const [{ currentScreen }] = useAtom(screenAtom);

  const renderScreen = () => {
    switch (currentScreen) {
      case "introLoading":
        return <IntroLoading />;
      case "outage":
        return <Outage />;
      case "outOfMinutes":
        return <OutOfMinutes />;
      case "intro":
        return <Intro />;
      case "userProfile":
        return <UserProfileForm />;
      case "settings":
        return <Settings />;
      case "instructions":
        return <Instructions />;
      case "conversation":
        return <InterviewSession />;
      case "finalScreen":
        return <InterviewFeedback />;
      default:
        return <IntroLoading />;
    }
  };

  return (
    <main className="flex h-svh flex-col items-center justify-between gap-3 p-5 sm:gap-4 lg:p-8 bg-black">
      {currentScreen !== "introLoading" && <Header />}
      {renderScreen()}
      {currentScreen !== "introLoading" && <Footer />}
    </main>
  );
}

export default App;
