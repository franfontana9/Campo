import type { Interest, Listing, Profile } from "./types";

/**
 * Usuario "logueado" simulado. Cuando se conecte Supabase Auth, esto se
 * reemplaza por `await supabase.auth.getUser()`.
 *
 * Coincide con uno de los seller_id en MOCK_LISTINGS, así el dashboard
 * muestra publicaciones e intereses como si fueran del usuario actual.
 */
export const CURRENT_USER: Profile = {
  id: "u1",
  full_name: "Agro del Sur SRL",
  phone: "+54 358 412 7788",
  country: "AR",
  region: "Córdoba",
  city: "Río Cuarto",
  user_type: "both",
  role: "user",
  created_at: "2025-09-12T10:00:00Z",
};

/**
 * Intereses mock: incluyen los recibidos (sobre publicaciones del CURRENT_USER)
 * y los enviados (donde CURRENT_USER es el buyer).
 */
export const MOCK_INTERESTS: (Interest & {
  buyer?: Pick<Profile, "id" | "full_name" | "country" | "region" | "city">;
})[] = [
  // Recibidos: alguien interesado en publicación 1 (de CURRENT_USER)
  {
    id: "i1",
    listing_id: "1",
    buyer_id: "u4",
    message:
      "Hola, nos interesan los 500 t. ¿Podemos coordinar entrega en Quequén? Necesitamos confirmación de calidad por análisis externo.",
    status: "pending",
    created_at: "2026-04-22T18:30:00Z",
    buyer: {
      id: "u4",
      full_name: "Midwest Grain Traders LLC",
      country: "US",
      region: "Iowa",
      city: "Des Moines",
    },
  },
  {
    id: "i2",
    listing_id: "1",
    buyer_id: "u14",
    message:
      "Estamos comprando soja para exportación. Pagamos al levantar contra BL. Avisame disponibilidad real.",
    status: "accepted",
    created_at: "2026-04-21T11:15:00Z",
    buyer: {
      id: "u14",
      full_name: "Agro Itapúa SA",
      country: "PY",
      region: "Itapúa",
      city: "Encarnación",
    },
  },
  {
    id: "i3",
    listing_id: "1",
    buyer_id: "u2",
    message: "Interesa para mezcla. ¿Tenés análisis reciente de proteína?",
    status: "declined",
    created_at: "2026-04-20T08:00:00Z",
    buyer: {
      id: "u2",
      full_name: "Fazenda Esperança Ltda",
      country: "BR",
      region: "Mato Grosso",
      city: "Sorriso",
    },
  },
  // Enviados: CURRENT_USER mostrando interés en publicaciones de otros
  {
    id: "i4",
    listing_id: "5",
    buyer_id: CURRENT_USER.id,
    message:
      "Hola Don Ernesto, nos interesa el maíz. ¿Es posible despachar en mayo o junio? ¿Tienen análisis de humedad?",
    status: "pending",
    created_at: "2026-04-22T09:00:00Z",
  },
  {
    id: "i5",
    listing_id: "9",
    buyer_id: CURRENT_USER.id,
    message:
      "Buenas, vemos el lote de cebada. Estamos cerrando contrato con maltería local — necesitamos definir antes del viernes.",
    status: "accepted",
    created_at: "2026-04-21T14:20:00Z",
  },
  {
    id: "i6",
    listing_id: "13",
    buyer_id: CURRENT_USER.id,
    message: "Consulta por trigo APW: ¿FOB Perth o pueden CIF a Buenos Aires?",
    status: "pending",
    created_at: "2026-04-19T16:45:00Z",
  },
];

/**
 * Notificaciones in-app del usuario actual.
 */
export type Notification = {
  id: string;
  type: "interest_received" | "interest_accepted" | "interest_declined" | "new_message" | "system";
  title: string;
  body: string;
  href: string;
  created_at: string;
  read: boolean;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "interest_received",
    title: "Nuevo interés en tu publicación",
    body: "Midwest Grain Traders LLC mostró interés en 500 t de soja.",
    href: "/dashboard/intereses-recibidos",
    created_at: "2026-04-22T18:30:00Z",
    read: false,
  },
  {
    id: "n2",
    type: "new_message",
    title: "Mensaje nuevo de Don Ernesto e Hijos",
    body: "«Tenemos disponible para mayo, ¿pasamos número por mail?»",
    href: "/dashboard/chats/c2",
    created_at: "2026-04-22T16:10:00Z",
    read: false,
  },
  {
    id: "n3",
    type: "interest_accepted",
    title: "Estancia La Providencia aceptó tu interés",
    body: "Cebada cervecera Tandil — coordiná entrega antes del viernes.",
    href: "/dashboard/intereses-enviados",
    created_at: "2026-04-21T14:25:00Z",
    read: true,
  },
  {
    id: "n4",
    type: "interest_received",
    title: "Nuevo interés en tu publicación",
    body: "Agro Itapúa SA quiere 500 t de soja para exportación.",
    href: "/dashboard/intereses-recibidos",
    created_at: "2026-04-21T11:15:00Z",
    read: true,
  },
  {
    id: "n5",
    type: "system",
    title: "Tu publicación está activa",
    body: "500 t de soja en Río Cuarto ya aparece en el marketplace.",
    href: "/dashboard/publicaciones",
    created_at: "2026-04-18T12:05:00Z",
    read: true,
  },
];

/**
 * Hilos de chat — uno por publicación cuando hubo interés.
 * En el modelo final viene de Supabase: chats(listing_id, buyer_id, seller_id)
 * + messages(chat_id, author_id, body, created_at).
 */
export type ChatMessage = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export type ChatThread = {
  id: string;
  listing_id: string;
  // Otra parte del chat (ya sea buyer o seller, depende de quién mira)
  counterparty: {
    id: string;
    full_name: string;
    country: string;
    region: string;
    city: string;
  };
  // Si CURRENT_USER es vendedor o comprador en este hilo
  my_role: "seller" | "buyer";
  status: "open" | "closed";
  unread: number;
  last_message_at: string;
  messages: ChatMessage[];
};

export const MOCK_CHATS: ChatThread[] = [
  {
    id: "c1",
    listing_id: "1",
    counterparty: {
      id: "u4",
      full_name: "Midwest Grain Traders LLC",
      country: "US",
      region: "Iowa",
      city: "Des Moines",
    },
    my_role: "seller",
    status: "open",
    unread: 2,
    last_message_at: "2026-04-22T18:45:00Z",
    messages: [
      {
        id: "m1",
        author_id: "u4",
        body: "Hola, nos interesan los 500 t. ¿Podemos coordinar entrega en Quequén?",
        created_at: "2026-04-22T18:30:00Z",
      },
      {
        id: "m2",
        author_id: "u1",
        body: "Hola, sí. Tenemos disponibilidad. ¿Necesitan análisis de calidad antes?",
        created_at: "2026-04-22T18:35:00Z",
      },
      {
        id: "m3",
        author_id: "u4",
        body: "Sí por favor. ¿Pueden mandar por mail? Y nos cierran fecha de entrega tentativa.",
        created_at: "2026-04-22T18:42:00Z",
      },
      {
        id: "m4",
        author_id: "u4",
        body: "Te paso el contacto del responsable de logística también: john@midwestgrain.com",
        created_at: "2026-04-22T18:45:00Z",
      },
    ],
  },
  {
    id: "c2",
    listing_id: "5",
    counterparty: {
      id: "u5",
      full_name: "Don Ernesto e Hijos",
      country: "AR",
      region: "Entre Ríos",
      city: "Paraná",
    },
    my_role: "buyer",
    status: "open",
    unread: 1,
    last_message_at: "2026-04-22T16:10:00Z",
    messages: [
      {
        id: "m5",
        author_id: "u1",
        body: "Hola Don Ernesto, nos interesa el maíz. ¿Es posible despachar en mayo o junio?",
        created_at: "2026-04-22T09:00:00Z",
      },
      {
        id: "m6",
        author_id: "u5",
        body: "Hola Fran, sí, tenemos disponible para mayo. Humedad 14%.",
        created_at: "2026-04-22T15:20:00Z",
      },
      {
        id: "m7",
        author_id: "u5",
        body: "Tenemos disponible para mayo, ¿pasamos número por mail?",
        created_at: "2026-04-22T16:10:00Z",
      },
    ],
  },
  {
    id: "c3",
    listing_id: "9",
    counterparty: {
      id: "u9",
      full_name: "Estancia La Providencia",
      country: "AR",
      region: "Buenos Aires",
      city: "Tandil",
    },
    my_role: "buyer",
    status: "open",
    unread: 0,
    last_message_at: "2026-04-21T14:30:00Z",
    messages: [
      {
        id: "m8",
        author_id: "u1",
        body: "Buenas, vemos el lote de cebada. Estamos cerrando contrato con maltería local.",
        created_at: "2026-04-21T14:20:00Z",
      },
      {
        id: "m9",
        author_id: "u9",
        body: "Excelente. Aceptado. Pasame los datos por mail y coordinamos.",
        created_at: "2026-04-21T14:30:00Z",
      },
    ],
  },
];

/**
 * Q&A público en publicaciones — preguntas que cualquier comprador puede
 * hacer y el vendedor responde, queda visible para todos.
 */
export type Question = {
  id: string;
  listing_id: string;
  asker_name: string;
  question: string;
  answer: string | null;
  asked_at: string;
  answered_at: string | null;
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    listing_id: "1",
    asker_name: "Comprador anónimo",
    question: "¿Tienen análisis de proteína disponible?",
    answer:
      "Sí, hicimos análisis hace 3 días — 38% proteína / 18,5% materia grasa. Lo mando por mail si interesa.",
    asked_at: "2026-04-21T10:00:00Z",
    answered_at: "2026-04-21T11:30:00Z",
  },
  {
    id: "q2",
    listing_id: "1",
    asker_name: "Cooperativa del Sur",
    question: "¿Pueden despachar 200 t y dejar el resto para junio?",
    answer:
      "Podemos hablarlo. Pasame el detalle de logística y armamos la operación en dos entregas.",
    asked_at: "2026-04-20T15:00:00Z",
    answered_at: "2026-04-20T16:45:00Z",
  },
  {
    id: "q3",
    listing_id: "1",
    asker_name: "Trader independiente",
    question: "¿El precio es FOB o sobre camión en planta?",
    answer: null,
    asked_at: "2026-04-22T09:30:00Z",
    answered_at: null,
  },
];

/**
 * Galería mock por publicación — permite la grilla de fotos en el detalle
 * cuando el listing tiene `image_url`. Si no, se usa GrainVisual.
 */
export function getListingGallery(listingId: string): string[] {
  // Cuando haya upload real viene de Supabase Storage. Por ahora rotamos un
  // set de fotos verificadas según el id, para que cada publicación muestre
  // un orden distinto pero estable.
  const pool = ["wheat-01.jpg", "farm-01.jpg", "wheat-03.jpg"];
  const offset = [...listingId].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool
    .map((_, i) => pool[(i + offset) % pool.length])
    .map((f) => `/images/grains/${f}`);
}

/**
 * Stats del usuario actual sobre los mocks. Cuando se conecte Supabase se
 * reemplaza por queries con auth.uid().
 */
export function getUserStats() {
  const myListings = MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id);
  const activeListings = myListings.filter((l) => l.status === "active");
  const myListingIds = new Set(myListings.map((l) => l.id));
  const received = MOCK_INTERESTS.filter((i) => myListingIds.has(i.listing_id));
  const sent = MOCK_INTERESTS.filter((i) => i.buyer_id === CURRENT_USER.id);
  return {
    activeListings: activeListings.length,
    totalListings: myListings.length,
    receivedPending: received.filter((i) => i.status === "pending").length,
    receivedTotal: received.length,
    sentPending: sent.filter((i) => i.status === "pending").length,
    sentTotal: sent.length,
  };
}

/**
 * Stats de marketplace calculados sobre los mocks. Cuando se conecte Supabase
 * se reemplaza por un SELECT count() + MAX(created_at) del server.
 */
export function getMarketplaceStats() {
  const active = MOCK_LISTINGS.filter((l) => l.status === "active");
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const newToday = active.filter(
    (l) => now - new Date(l.created_at).getTime() < oneDay,
  ).length;
  const latest = active.reduce<string | null>(
    (acc, l) => (!acc || l.created_at > acc ? l.created_at : acc),
    null,
  );
  const totalTonnage = active.reduce((sum, l) => sum + l.tonnage, 0);
  return {
    activeCount: active.length,
    newToday,
    latestAt: latest,
    totalTonnage,
  };
}

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    user_id: "u1",
    grain_type: "soja",
    tonnage: 500,
    country: "AR",
    region: "Córdoba",
    city: "Río Cuarto",
    price: 410,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-15",
    description:
      "Soja de primera, humedad 13,5%, grano sano. Entrega desde planta propia con balanza. Flete a cargo del comprador.",
    status: "active",
    image_url: null,
    created_at: "2026-04-18T12:00:00Z",
    updated_at: "2026-04-18T12:00:00Z",
    seller: {
      id: "u1",
      full_name: "Agro del Sur SRL",
      user_type: "seller",
      country: "AR",
      region: "Córdoba",
      city: "Río Cuarto",
    },
  },
  {
    id: "2",
    user_id: "u2",
    grain_type: "maiz",
    tonnage: 1200,
    country: "BR",
    region: "Mato Grosso",
    city: "Sorriso",
    price: null,
    currency: "USD",
    price_mode: "to_agree",
    delivery_date: "2026-06-01",
    description:
      "Maíz zafrinha, calidad exportación. Lotes disponibles mensualmente desde Rondonópolis y Sorriso. Condición FOB Paranaguá.",
    status: "active",
    image_url: null,
    created_at: "2026-04-20T09:30:00Z",
    updated_at: "2026-04-20T09:30:00Z",
    seller: {
      id: "u2",
      full_name: "Fazenda Esperança Ltda",
      user_type: "both",
      country: "BR",
      region: "Mato Grosso",
      city: "Sorriso",
    },
  },
  {
    id: "3",
    user_id: "u3",
    grain_type: "trigo",
    tonnage: 300,
    country: "UA",
    region: "Odesa",
    city: "Odesa",
    price: 240,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-04-30",
    description:
      "Trigo pan, proteína 11,5%, PH 78. Disponible en terminal portuaria. Carga inmediata.",
    status: "active",
    image_url: null,
    created_at: "2026-04-21T16:45:00Z",
    updated_at: "2026-04-21T16:45:00Z",
    seller: {
      id: "u3",
      full_name: "Black Sea Grain Co.",
      user_type: "seller",
      country: "UA",
      region: "Odesa",
      city: "Odesa",
    },
  },
  {
    id: "4",
    user_id: "u4",
    grain_type: "soja",
    tonnage: 2000,
    country: "US",
    region: "Iowa",
    city: "Des Moines",
    price: 405,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-25",
    description:
      "US No. 2 Yellow Soybeans. Available in container or bulk. Payment against BL. Origin certificates included.",
    status: "active",
    image_url: null,
    created_at: "2026-04-17T10:15:00Z",
    updated_at: "2026-04-17T10:15:00Z",
    seller: {
      id: "u4",
      full_name: "Midwest Grain Traders LLC",
      user_type: "seller",
      country: "US",
      region: "Iowa",
      city: "Des Moines",
    },
  },
  {
    id: "5",
    user_id: "u5",
    grain_type: "maiz",
    tonnage: 400,
    country: "AR",
    region: "Entre Ríos",
    city: "Paraná",
    price: 185,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-10",
    description:
      "Maíz temprano, humedad 14%. Entrega en planta o puerto Rosario. Consultar disponibilidad de camiones.",
    status: "active",
    image_url: null,
    created_at: "2026-04-19T08:20:00Z",
    updated_at: "2026-04-19T08:20:00Z",
    seller: {
      id: "u5",
      full_name: "Don Ernesto e Hijos",
      user_type: "seller",
      country: "AR",
      region: "Entre Ríos",
      city: "Paraná",
    },
  },
  {
    id: "6",
    user_id: "u6",
    grain_type: "trigo",
    tonnage: 150,
    country: "FR",
    region: "Île-de-France",
    city: "París",
    price: 220,
    currency: "EUR",
    price_mode: "to_agree",
    delivery_date: "2026-05-05",
    description:
      "Blé tendre panifiable, protéines 12%. Possibilité de contrats forward. Livraison Rouen.",
    status: "active",
    image_url: null,
    created_at: "2026-04-22T07:00:00Z",
    updated_at: "2026-04-22T07:00:00Z",
    seller: {
      id: "u6",
      full_name: "Céréales Île-de-France",
      user_type: "both",
      country: "FR",
      region: "Île-de-France",
      city: "París",
    },
  },
  {
    id: "7",
    user_id: "u7",
    grain_type: "girasol",
    tonnage: 250,
    country: "AR",
    region: "Buenos Aires",
    city: "Tres Arroyos",
    price: 520,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-06-10",
    description:
      "Girasol alto oleico, humedad 10%. Contrato forward disponible. Carga en terminal Quequén.",
    status: "active",
    image_url: null,
    created_at: "2026-04-22T15:00:00Z",
    updated_at: "2026-04-22T15:00:00Z",
    seller: {
      id: "u7",
      full_name: "Agroindustrial del Sur",
      user_type: "seller",
      country: "AR",
      region: "Buenos Aires",
      city: "Tres Arroyos",
    },
  },
  {
    id: "8",
    user_id: "u8",
    grain_type: "sorgo",
    tonnage: 800,
    country: "AR",
    region: "Santa Fe",
    city: "Rafaela",
    price: 175,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-20",
    description:
      "Sorgo granífero, apto forraje y exportación. Entrega puerto San Lorenzo. Cortado y acondicionado.",
    status: "active",
    image_url: null,
    created_at: "2026-04-16T11:00:00Z",
    updated_at: "2026-04-16T11:00:00Z",
    seller: {
      id: "u8",
      full_name: "Cooperativa Rafaela Ltda",
      user_type: "seller",
      country: "AR",
      region: "Santa Fe",
      city: "Rafaela",
    },
  },
  {
    id: "9",
    user_id: "u9",
    grain_type: "cebada",
    tonnage: 600,
    country: "AR",
    region: "Buenos Aires",
    city: "Tandil",
    price: 210,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-07-01",
    description:
      "Cebada cervecera variedad Andreia. Proteína 11,5%. Contrato con maltería regional disponible.",
    status: "active",
    image_url: null,
    created_at: "2026-04-21T09:00:00Z",
    updated_at: "2026-04-21T09:00:00Z",
    seller: {
      id: "u9",
      full_name: "Estancia La Providencia",
      user_type: "seller",
      country: "AR",
      region: "Buenos Aires",
      city: "Tandil",
    },
  },
  {
    id: "10",
    user_id: "u10",
    grain_type: "avena",
    tonnage: 120,
    country: "CA",
    region: "Saskatchewan",
    city: "Saskatoon",
    price: 380,
    currency: "USD",
    price_mode: "to_agree",
    delivery_date: "2026-06-15",
    description:
      "Oat milling grade. Test weight 40 lb/bu+. Certificates on request. CWB origin. Containerized.",
    status: "active",
    image_url: null,
    created_at: "2026-04-22T03:30:00Z",
    updated_at: "2026-04-22T03:30:00Z",
    seller: {
      id: "u10",
      full_name: "Prairie Grains Co-op",
      user_type: "seller",
      country: "CA",
      region: "Saskatchewan",
      city: "Saskatoon",
    },
  },
  {
    id: "11",
    user_id: "u11",
    grain_type: "arroz",
    tonnage: 400,
    country: "BR",
    region: "Rio Grande do Sul",
    city: "Pelotas",
    price: 590,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-30",
    description:
      "Arroz largo fino tipo 1, parboilizado disponible bajo pedido. Embalaje 25kg o bulk. Puerto Rio Grande.",
    status: "active",
    image_url: null,
    created_at: "2026-04-20T17:20:00Z",
    updated_at: "2026-04-20T17:20:00Z",
    seller: {
      id: "u11",
      full_name: "Arrozeira do Sul SA",
      user_type: "seller",
      country: "BR",
      region: "Rio Grande do Sul",
      city: "Pelotas",
    },
  },
  {
    id: "12",
    user_id: "u12",
    grain_type: "maiz",
    tonnage: 3500,
    country: "UA",
    region: "Mikolaiv",
    city: "Mikolaiv",
    price: 195,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-06-05",
    description:
      "Ukrainian yellow corn, GMO-free. Test weight 72 kg/hl. Phyto certificate included. FOB Mikolaiv.",
    status: "active",
    image_url: null,
    created_at: "2026-04-19T14:45:00Z",
    updated_at: "2026-04-19T14:45:00Z",
    seller: {
      id: "u12",
      full_name: "Dnipro Agritrade",
      user_type: "both",
      country: "UA",
      region: "Mikolaiv",
      city: "Mikolaiv",
    },
  },
  {
    id: "13",
    user_id: "u13",
    grain_type: "trigo",
    tonnage: 900,
    country: "AU",
    region: "Western Australia",
    city: "Perth",
    price: 260,
    currency: "USD",
    price_mode: "to_agree",
    delivery_date: "2026-07-10",
    description:
      "Australian Premium White (APW) wheat. Protein 10-11.5%. CBH Group certified. Bulk vessel loading.",
    status: "active",
    image_url: null,
    created_at: "2026-04-18T22:10:00Z",
    updated_at: "2026-04-18T22:10:00Z",
    seller: {
      id: "u13",
      full_name: "Westgrain Exports Pty",
      user_type: "seller",
      country: "AU",
      region: "Western Australia",
      city: "Perth",
    },
  },
  {
    id: "14",
    user_id: "u14",
    grain_type: "soja",
    tonnage: 1500,
    country: "PY",
    region: "Itapúa",
    city: "Encarnación",
    price: 398,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-18",
    description:
      "Soja zafra 2026. Humedad 13%. Carga puerto Villeta. Contratos forward para campaña siguiente.",
    status: "active",
    image_url: null,
    created_at: "2026-04-17T19:00:00Z",
    updated_at: "2026-04-17T19:00:00Z",
    seller: {
      id: "u14",
      full_name: "Agro Itapúa SA",
      user_type: "seller",
      country: "PY",
      region: "Itapúa",
      city: "Encarnación",
    },
  },
  {
    id: "15",
    user_id: "u15",
    grain_type: "girasol",
    tonnage: 450,
    country: "RU",
    region: "Rostov",
    city: "Rostov-on-Don",
    price: null,
    currency: "USD",
    price_mode: "to_agree",
    delivery_date: "2026-06-20",
    description:
      "Russian sunflower seed, confectionery grade. 98% purity. Shipment ex-Novorossiysk port.",
    status: "active",
    image_url: null,
    created_at: "2026-04-15T08:00:00Z",
    updated_at: "2026-04-15T08:00:00Z",
    seller: {
      id: "u15",
      full_name: "South Steppe Agro",
      user_type: "seller",
      country: "RU",
      region: "Rostov",
      city: "Rostov-on-Don",
    },
  },
  {
    id: "16",
    user_id: "u16",
    grain_type: "arroz",
    tonnage: 200,
    country: "IN",
    region: "Punjab",
    city: "Amritsar",
    price: 640,
    currency: "USD",
    price_mode: "fixed",
    delivery_date: "2026-05-28",
    description:
      "Basmati rice, long grain. 1121 variety. Export-grade packaging. Origin certificate available.",
    status: "active",
    image_url: null,
    created_at: "2026-04-14T13:30:00Z",
    updated_at: "2026-04-14T13:30:00Z",
    seller: {
      id: "u16",
      full_name: "Himalaya Exports Pvt",
      user_type: "seller",
      country: "IN",
      region: "Punjab",
      city: "Amritsar",
    },
  },
];
