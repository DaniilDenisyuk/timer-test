import "./App.scss";
import Timer from "./components/Timer";

function App() {
  return (
    <div className="App">
      <header className="App-header">TIMER</header>

      <div className="App-body">
        <Timer />
      </div>
      <footer className="App-footer">
        Copyright belongs to Daniil Denysiuk©
      </footer>
    </div>
  );
}

export default App;
