/**
 * Neural landing page.
 * Use this as a route in App.tsx, e.g.:
 *   <Route path="/" element={<NeuralLanding />} />
 *   // or alongside the existing Landing:
 *   <Route path="/neural" element={<NeuralLanding />} />
 */
import NeuralHero from "@/components/NeuralHero/NeuralHero";

export default function NeuralLanding() {
  return <NeuralHero />;
}
