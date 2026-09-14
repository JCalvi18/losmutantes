import { ASSETS } from "@/lib/assets";

export interface PartnerShow {
  group: string;
  showTitle: string;
  city: string;
  venue: string;
  date: string;
  isoDate: string;
  link: string;
  description: { es: string; en: string; de: string };
  imageUrl?: string;
}

export const PARTNER_SHOWS: PartnerShow[] = [
  {
    group: "Universidad de Caldas",
    showTitle: "CRISÁLIDA",
    city: "Saarbrücken",
    venue: "TiV – Theater im Viertel",
    date: "15.09.2026 -- 19:30",
    isoDate: "2026-09-15",
    link: "https://dastiv.de/karten-crisalida",
    imageUrl: ASSETS.crisalidaPoster,
    description: {
      es: "Entre cortinas, recuerdos suspendidos y jaulas geométricas, CRISÁLIDA despliega una noche de teatro poético sobre el crecer, la violencia familiar y la búsqueda de una identidad propia. Función en español con subtítulos en alemán.",
      en: "Amid curtains, suspended memories and geometric cages, CRISÁLIDA unfolds a poetic evening of theater about coming of age, family violence, and the search for one's own identity. Performed in Spanish with German subtitles.",
      de: "Zwischen Vorhängen, schwebenden Erinnerungen und geometrischen Käfigen entfaltet sich in CRISÁLIDA ein poetischer Theaterabend über das Erwachsenwerden, familiäre Gewalt und die Suche nach einer eigenen Identität. Aufführung auf Spanisch mit deutschen Untertiteln.",
    },
  },
  {
    group: "Universidad de Caldas",
    showTitle: "CRISÁLIDA",
    city: "Saarbrücken",
    venue: "TiV – Theater im Viertel",
    date: "16.09.2026 -- 19:30",
    isoDate: "2026-09-16",
    link: "https://dastiv.de/karten-crisalida",
    imageUrl: ASSETS.crisalidaPoster,
    description: {
      es: "Entre cortinas, recuerdos suspendidos y jaulas geométricas, CRISÁLIDA despliega una noche de teatro poético sobre el crecer, la violencia familiar y la búsqueda de una identidad propia. Función en español con subtítulos en alemán.",
      en: "Amid curtains, suspended memories and geometric cages, CRISÁLIDA unfolds a poetic evening of theater about coming of age, family violence, and the search for one's own identity. Performed in Spanish with German subtitles.",
      de: "Zwischen Vorhängen, schwebenden Erinnerungen und geometrischen Käfigen entfaltet sich in CRISÁLIDA ein poetischer Theaterabend über das Erwachsenwerden, familiäre Gewalt und die Suche nach einer eigenen Identität. Aufführung auf Spanisch mit deutschen Untertiteln.",
    },
  },
  {
    group: "Compañía del Sur",
    showTitle: "LA TIGRESA",
    city: "Saarbrücken",
    venue: "TiV – Theater im Viertel",
    date: "27.09.2026 -- 17:00",
    isoDate: "2026-09-27",
    link: "https://dastiv.de/karten-la-tigresa",
    imageUrl: ASSETS.tigresaPoster,
    description: {
      es: "Esta antiquísima historia, tan absurda como humorística, dice Dario Fo haberla escuchado de un cantante callejero cerca de Shanghái: un soldado herido es curado por una tigresa, con quien forma una insólita comunidad de supervivencia. Un monólogo grotesco y cómico interpretado por Juanba Ybañez sobre la guerra, la humanidad y la convivencia con lo extraño.",
      en: "This ancient tale, as absurd as it is humorous, was supposedly heard by Dario Fo from a street singer near Shanghai: a wounded soldier is nursed back to health by a tigress, forming an oddball community somewhere between survival and family. A grotesque, comic solo performed by Juanba Ybañez about war, humanity, and coexisting with the foreign.",
      de: "Diese uralte, ebenso absurde wie humorvolle orientalische Geschichte will Dario Fo während einer Chinareise von einem Bänkelsänger nahe Shanghai gehört haben: Ein verwundeter Soldat wird von einer Tigerin gesund gepflegt und bildet mit ihr eine schräge Überlebensgemeinschaft. Ein groteskes, komisches Solo mit Juanba Ybañez über Krieg, Menschlichkeit und das Zusammenleben mit dem Fremden.",
    },
  },
  {
    group: "Teatro en Obras",
    showTitle: "REVUELTO DE GENTUZA",
    city: "Saarbrücken",
    venue: "TiV – Theater im Viertel",
    date: "13.10.2026 -- 19:30",
    isoDate: "2026-10-13",
    link: "https://dastiv.de/karten-revuelto-de-gentuza",
    imageUrl: ASSETS.revueltoPoster,
    description: {
      es: "Teatro, danza, clown, títeres… humor de todos los colores, menos el blanco. Aviso importante: aunque es bien sabido que la maldad es difícil de contener, la Compañía en Obras tiene el honor de anunciar que ha logrado encerrar a la mala gente en un mismo lugar y a la misma hora, para reírse en su propia cara.",
      en: "Theater, dance, clown, puppetry… humor in every color except white. Important announcement: although it's well known that wickedness is hard to contain, Compañía En Obras has the honor of announcing that it has managed to lock up all the bad people in one single place at one single time, in order to laugh right in their faces.",
      de: "Theater, Tanz, Clown, Puppenspiel … Humor in allen Farben — außer weiß. Wichtige Mitteilung: Obwohl allgemein bekannt ist, dass Bosheit nur schwer einzudämmen ist, hat die Compagnie En Obras die Ehre bekanntzugeben, dass es ihr gelungen ist, die schlechten Menschen an einem einzigen Ort und zu einer einzigen Zeit einzusperren — um ihnen direkt ins Gesicht zu lachen.",
    },
  },
  {
    group: "Teatro en Obras",
    showTitle: "REVUELTO DE GENTUZA",
    city: "Saarbrücken",
    venue: "TiV – Theater im Viertel",
    date: "14.10.2026 -- 19:30",
    isoDate: "2026-10-14",
    link: "https://dastiv.de/karten-revuelto-de-gentuza",
    imageUrl: ASSETS.revueltoPoster,
    description: {
      es: "Teatro, danza, clown, títeres… humor de todos los colores, menos el blanco. Aviso importante: aunque es bien sabido que la maldad es difícil de contener, la Compañía en Obras tiene el honor de anunciar que ha logrado encerrar a la mala gente en un mismo lugar y a la misma hora, para reírse en su propia cara.",
      en: "Theater, dance, clown, puppetry… humor in every color except white. Important announcement: although it's well known that wickedness is hard to contain, Compañía En Obras has the honor of announcing that it has managed to lock up all the bad people in one single place at one single time, in order to laugh right in their faces.",
      de: "Theater, Tanz, Clown, Puppenspiel … Humor in allen Farben — außer weiß. Wichtige Mitteilung: Obwohl allgemein bekannt ist, dass Bosheit nur schwer einzudämmen ist, hat die Compagnie En Obras die Ehre bekanntzugeben, dass es ihr gelungen ist, die schlechten Menschen an einem einzigen Ort und zu einer einzigen Zeit einzusperren — um ihnen direkt ins Gesicht zu lachen.",
    },
  },
  {
    group: "El Vacío Fértil Compañía Teatral",
    showTitle: "Calígula. El juguete de un loco",
    city: "Saarbrücken",
    venue: "TiV – Theater im Viertel",
    date: "16.11.2026 -- 19:30",
    isoDate: "2026-11-16",
    link: "https://dastiv.de/2026-11-16_caligula_el-juguete-de-un-loco/",
    imageUrl: ASSETS.caligulaPoster,
    description: {
      es: "Un joven Calígula, impaciente por gobernar, ordena acelerar la muerte de Tiberio, su predecesor. Al convertirse en César, es aclamado por una mayoría que lo venera. Cobarde y temerario a la vez, su inmadurez necesita el consejo de tres figuras de las que depende emocional y estratégicamente: sus dos mujeres favoritas —su hermana y amante Drusila y su ex amante Cesonia— y, por otro lado, Incitatus, su caballo. Poco a poco le tomará gusto al poder, pero sus arrebatos de ira, el derroche desenfrenado y su creciente impiedad irán minando su popularidad.",
      en: "A young Caligula, impatient to rule, orders the hastening of the death of Tiberius, his predecessor. Once he becomes Caesar, he is hailed by a majority who adore him. Cowardly and reckless at once, his immaturity depends on the counsel of three figures he relies on emotionally and strategically: his two favorite women — his sister and lover Drusilla, and his former lover Caesonia — and his horse, Incitatus. Little by little he grows fond of power, but his fits of rage, reckless extravagance, and growing impiety erode his popularity.",
      de: "Ein junger Caligula, ungeduldig zu regieren, befiehlt die Beschleunigung des Todes von Tiberius, seinem Vorgänger. Als er Caesar wird, wird er von einer Mehrheit gefeiert, die ihn verehrt. Feige und waghalsig zugleich, braucht seine Unreife die Beratung von drei Figuren, von denen er emotional und strategisch abhängt: einerseits seine beiden bevorzugten Frauen: seine Schwester und Geliebte Drusilla und seine ehemalige Geliebte Caesonia; und andererseits Incitatus, sein Pferd. Keine Handlung wird ohne den Rat eines der drei unternommen, keine Kleidung wird angezogen, kein Weg wird begonnen, ohne von einem von ihnen vorgeschlagen worden zu sein. Nach und nach wird er Gefallen an der Macht finden, aber seine Wutanfälle, die zügellose Verschwendung und seine wachsende Gottlosigkeit werden seine Popularität mindern.",
    },
  },
];
