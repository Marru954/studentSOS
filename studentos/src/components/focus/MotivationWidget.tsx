"use client";

/** A single motivating line above the timer. Priority: imminent exam →
 *  fresh-morning → active streak → a quote that rotates by day (deterministic,
 *  SSR-safe — no Math.random). */

const QUOTES = [
  "La disciplina è il ponte tra obiettivi e risultati.",
  "Non devi essere bravo per iniziare, devi iniziare per diventare bravo.",
  "Un'ora di studio oggi vale due ore la notte prima dell'esame.",
  "La costanza batte l'intensità. Ogni giorno un pezzettino.",
  "Concentrati su un capitolo alla volta: il resto verrà.",
  "Il momento migliore per studiare era ieri. Il secondo migliore è adesso.",
  "Studiare poco e spesso batte studiare tanto e mai.",
  "Le piccole sessioni di oggi sono il 30 di domani.",
  "Non contare i giorni, fai in modo che i giorni contino.",
  "La fatica di oggi è la sicurezza di domani all'esame.",
  "Chi semina sessioni di studio raccoglie CFU.",
  "Ogni grande carriera è fatta di tante piccole sessioni.",
  "Spegni le notifiche, accendi il focus.",
  "Il talento apre la porta, lo studio la tiene aperta.",
  "Meglio 25 minuti veri che 3 ore distratte.",
  "La motivazione ti fa iniziare, l'abitudine ti fa continuare.",
  "Studia come se l'esame fosse domani, vivi come se fosse tra un mese.",
  "Un paragrafo capito vale dieci letti di fretta.",
  "Il cervello è un muscolo: allenalo ogni giorno.",
  "Non aspettare la voglia: crea la routine, la voglia segue.",
  "La pausa fa parte dello studio, non è un premio.",
  "Sii paziente con te stesso: imparare richiede tempo.",
  "Oggi una pagina, domani un capitolo, tra un mese l'esame.",
  "Il segreto non è studiare di più, ma studiare meglio.",
  "Festeggia i piccoli progressi: sono quelli che contano.",
  "Concentrazione ora, libertà poi.",
  "La tua versione futura ti ringrazierà per la sessione di oggi.",
  "Fai la cosa difficile quando è facile, e la cosa facile quando è difficile.",
  "Non si tratta di avere tempo, ma di fare tempo.",
  "Un esame alla volta, una sessione alla volta. Ce la fai.",
];

function dayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

export function MotivationWidget({
  nextExam,
  streak,
  now,
}: {
  nextExam?: { courseName: string; days: number };
  streak: number;
  now: Date;
}) {
  let emoji = "✨";
  let text: string;

  if (nextExam && nextExam.days >= 0 && nextExam.days <= 7) {
    emoji = "📚";
    const rel =
      nextExam.days === 0
        ? "è oggi"
        : nextExam.days === 1
          ? "è domani"
          : `tra ${nextExam.days} giorni`;
    text = `${nextExam.courseName} ${rel} — è il momento di concentrarsi.`;
  } else if (now.getHours() < 9) {
    emoji = "🌅";
    text = "Cervello fresco di mattina — ottimo momento per le cose difficili.";
  } else if (streak >= 1) {
    emoji = "🔥";
    text = `${streak} ${streak === 1 ? "giorno" : "giorni"} di fila — non interrompere la serie.`;
  } else {
    text = QUOTES[dayOfYear(now) % QUOTES.length];
  }

  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
      <span aria-hidden="true" className="text-xl">
        {emoji}
      </span>
      <p className="text-sm font-medium text-ink">{text}</p>
    </div>
  );
}
