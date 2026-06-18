import { Landing } from "@/components/landing/Landing";
import { ATENEI_LIST, LIVE_PROGRAMME_COUNT } from "@/lib/liveAtenei";

/** Server component: deriva la lista leggera degli atenei e il conteggio dei
 *  corsi live e li passa alla landing come prop, così UNIVERSITY_PRESETS resta
 *  server-only (fuori dal bundle client pubblico). */
export default function Home() {
  return <Landing atenei={ATENEI_LIST} programmes={LIVE_PROGRAMME_COUNT} />;
}
