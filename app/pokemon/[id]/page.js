// app/pokemon/[id]/page.js
import Database from "better-sqlite3";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function addBookmark(formData) {
  "use server";

  const pokemonId = Number(formData.get("pokemon_id"));
  const pokemonName = String(formData.get("pokemon_name") || "");
  const note = String(formData.get("note") || "").trim().slice(0, 120);

  const db = new Database("app.db");
  db.prepare(
    "INSERT OR IGNORE INTO bookmarks (pokemon_id, pokemon_name, note) VALUES (?, ?, ?)"
  ).run(pokemonId, pokemonName, note);
  db.close();

  revalidatePath("/bookmarks");
  redirect("/bookmarks");
}


export async function generateMetadata({ params }) {
  const { id } = await params;

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();

  return {
    title: `No.${pokemon.id} ${pokemon.name}`,
    description: `${pokemon.name}のステータス・タイプ情報`,
    openGraph: {
      title: `No.${pokemon.id} ${pokemon.name}`,
      images: [pokemon.sprites.other['official-artwork'].front_default],
    },
  };
}

export default async function PokemonDetail({ params }) {
  const { id } = await params;

  // サーバーでPokéAPIからデータを取得
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const pokemon = await response.json();

  return (
    <main className="p-8 max-w-xl mx-auto">
      <a href="/" className="text-blue-600 hover:underline">← 一覧に戻る</a>

      <div className="text-center mt-4">
        <img
          src={pokemon.sprites.other['official-artwork'].front_default}
          alt={pokemon.name}
          width={300}
          height={300}
        />
        <h1 className="text-2xl font-bold capitalize mt-2">
          No.{pokemon.id} {pokemon.name}
        </h1>
      </div>

      <table className="w-full border-collapse mt-4">
        <tbody>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">タイプ</th>
            <td className="p-2">
              {pokemon.types.map((t, index) => {
                return (
                  <span key={t.type.name}>
                    {index > 0 && ', '}
                    <a href={`/type/` + t.type.name} className="text-blue-600 hover:underline">{t.type.name}</a>
                  </span>
                );
              })}
            </td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">高さ</th>
            <td className="p-2">{pokemon.height / 10} m</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">重さ</th>
            <td className="p-2">{pokemon.weight / 10} kg</td>
          </tr>
          <tr className="border-b border-gray-300">
            <th className="p-2 text-left">基本経験値</th>
            <td className="p-2">{pokemon.base_experience}</td>
          </tr>
        </tbody>
      </table>
      
      <h2 className="text-xl font-bold mt-6">ステータス</h2>
      <div className="mt-2">
        {pokemon.stats.map(stat => (
          <div key={stat.stat.name} className="mb-2">
            <div className="flex justify-between mb-1">
              <span className="capitalize">{stat.stat.name}</span>
              <span>{stat.base_stat}</span>
            </div>
            <div className="bg-gray-200 rounded h-2">
              <div
                className="bg-green-500 rounded h-full"
                style={{ width: `${Math.min(stat.base_stat / 255 * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div>
        <form action={addBookmark} className="mt-6 space-y-2"> <input type="hidden" name="pokemon_id" value={pokemon.id} />
        <input type="hidden" name="pokemon_name" value={pokemon.name} />
        <input type="text" name="note" maxLength={120} placeholder="メモ（任意）" className="w-full border rounded px-3 py-2" />
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" > ブックマークに追加 </button> </form>
      </div>
    </main>
  );
}