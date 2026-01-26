import Hero from './sections/Hero';
import About from './sections/About';
import RestaurantHighlight from './sections/RestaurantHighlight';
import PrinciMahal from './sections/PrinciMahal';
import AshaFoods from './sections/AshaFoods';
import Location from './sections/Location';
import Footer from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Hero />
      <About />
      <RestaurantHighlight />
      <PrinciMahal />
      <AshaFoods />
      <Location />
      <Footer />
    </div>
  );
}

export default App;