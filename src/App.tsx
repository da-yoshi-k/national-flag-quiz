import { VerticalFeed } from "./components/VerticalFeed";
import { countries } from "./data/countries";

function App() {
  return <VerticalFeed items={countries} />;
}

export default App;
