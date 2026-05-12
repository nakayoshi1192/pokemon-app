// app/type/[name]/page.js

export async function generateMetadata({ params }) {
  const { name } = await params;

  const response = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
  const data = await response.json();

  const jaTypeName = data.names.find(n => n.language.name === "ja-hrkt")?.name ?? data.name;


  return {
    title: `${jaTypeName}タイプのポケモン`,
    description: `${jaTypeName}タイプのポケモン一覧`,
    openGraph: {
      title: `${jaTypeName}タイプのポケモン`,
      images: [data.sprites['generation-viii']['brilliant-diamond-shining-pearl'].symbol_icon],
    },
  };
}

export default async function PokemonDetail({ params }) {

  const { name } = await params;

  const response = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
  const data = await response.json();
  const jaTypeName = data.names.find(n => n.language.name === "ja-hrkt")?.name ?? data.name;
  const pokemon = data.pokemon;


  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">{jaTypeName}タイプのポケモン一覧</h1>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {pokemon.map((pokemon, index) => {
          const url = pokemon.pokemon.name;

          function getLastSegment(urlStr) {
            const cleaned = urlStr.replace(/[?#].*$/, '').replace(/\/+$/, '');
            const m = cleaned.match(/\/([^\/]+)$/);
            return m ? decodeURIComponent(m[1]) : null;
          }

          const id = getLastSegment(pokemon.pokemon.url);

          return (
            <a
              key={pokemon.pokemon.name}
              href={`/pokemon/${id}`}
              className="border border-gray-300 rounded-lg p-4 text-center
                        no-underline text-inherit hover:bg-gray-50"
                          >
              <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                alt={pokemon.pokemon.name}
                width={96}
                height={96}
              />
              <p>No.{id}</p>
              <p className="font-bold capitalize">{pokemon.pokemon.name}</p>
            </a>
          );
        })}
      </div>
    </main>
  );

}