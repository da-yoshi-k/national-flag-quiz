import { VerticalFeed } from "./components/VerticalFeed";
import { countries } from "./data/countries";

function App() {
  const items = [
    {
      id: "intro",
      type: "intro" as const,
    },
    ...countries.map((country) => ({
      ...country,
      type: "country" as const,
    })),
    {
      id: "outro",
      type: "outro" as const,
    },
  ];

  return <VerticalFeed items={items} />;
}

export default App;
