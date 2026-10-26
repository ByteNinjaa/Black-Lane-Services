import { Reveal } from "./Reveal";

type Tile = {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  width: number;
  height: number;
};

const weddings: Tile = {
  id: "weddings",
  title: "Weddings",
  body: "The couple, the parents and the wedding party, arriving together and on time. A reserve limousine waits on standby.",
  image: "/images/occ-weddings.jpg",
  alt: "A bride and groom raising glasses under a limousine’s starlight ceiling",
  width: 1300,
  height: 1598,
};

const side: Tile[] = [
  {
    id: "business",
    title: "Business",
    body: "Roadshows, client pickups and late dinners. One monthly invoice, discreet chauffeurs.",
    image: "/images/occ-business.jpg",
    alt: "A businesswoman on a call in the leather rear seat of a chauffeured car",
    width: 1400,
    height: 875,
  },
  {
    id: "nights",
    title: "Nights out",
    body: "Dinner, a Broadway show and a rooftop after. The bar is stocked and the night is yours.",
    image: "/images/occ-nights.jpg",
    alt: "Inside a stretch limousine: leather bench seating, a lit bar and a starlight ceiling",
    width: 1400,
    height: 875,
  },
];

function TileCard({ tile, large = false }: { tile: Tile; large?: boolean }) {
  return (
    <article
      className={`on-photo group relative h-full overflow-hidden bg-surface ${large ? "min-h-[32rem]" : "min-h-[20rem]"}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={tile.image}
        alt={tile.alt}
        width={tile.width}
        height={tile.height}
        loading="lazy"
        className="grade absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_6_6/0.92)_0%,rgb(6_6_6/0.45)_42%,transparent_72%)]"
      />
      <div className={`absolute inset-x-0 bottom-0 ${large ? "p-8 sm:p-10" : "p-7"}`}>
        <h3 className={`t-display ${large ? "t-display-lg" : "t-display-md"}`}>{tile.title}</h3>
        <p className={`mt-3 text-body ${large ? "max-w-[30rem]" : "max-w-[26rem]"}`}>{tile.body}</p>
      </div>
    </article>
  );
}

export function Occasions() {
  return (
    <section id="occasions" aria-labelledby="occasions-title" className="section border-t border-hairline">
      <div className="wrap">
        <Reveal className="max-w-[40rem]">
          <h2 id="occasions-title" className="t-display t-display-lg">
            Made for the occasion
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-3 lg:h-[min(84vh,52rem)] lg:grid-cols-12 lg:grid-rows-2">
          <Reveal className="lg:col-span-7 lg:row-span-2">
            <TileCard tile={weddings} large />
          </Reveal>
          {side.map((t, i) => (
            <Reveal key={t.id} delay={0.1 + i * 0.08} className="lg:col-span-5">
              <TileCard tile={t} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
