import { useState } from "react";
import { VerticalFeed } from "./components/VerticalFeed";
import { countries } from "./data/countries";

function pickRandomCountries<T>(items: T[], count: number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled.slice(0, count);
}

function App() {
  const [selectedCountries, setSelectedCountries] = useState(() =>
    pickRandomCountries(countries, 8),
  );
  const items = [
    {
      id: "intro",
      type: "intro" as const,
    },
    ...selectedCountries.map((country) => ({
      ...country,
      type: "country" as const,
    })),
    {
      id: "outro",
      type: "outro" as const,
    },
  ];

  return (
    <VerticalFeed
      items={items}
      onLoop={() => {
        setSelectedCountries(pickRandomCountries(countries, 8));
      }}
    />
  );
}

export default App;
