// app/bookmarks/page.js
import Database from 'better-sqlite3';

export const dynamic = 'force-dynamic';

async function removeBookmark(formData) {
  "use server";

  const pokemonId = Number(formData.get("pokemon_id"));
  const pokemonName = String(formData.get("pokemon_name") || "");
  const note = String(formData.get("note") || "").trim().slice(0, 120);

  const db = new Database("app.db");
  db.prepare(
    "DELETE FROM bookmarks WHERE pokemon_id = ?"
  ).run(pokemonId);
  db.close();
}


export default function BookmarksPage() {
  // サーバーでSQLiteからデータを取得
  const db = new Database('app.db');
  const bookmarks = db.prepare(
    'SELECT * FROM bookmarks ORDER BY created_at DESC'
  ).all();
  db.close();

  return (
    <main className="p-8 max-w-xl mx-auto">
      <a href="/" className="text-blue-600 hover:underline">← 図鑑に戻る</a>
      <h1 className="text-2xl font-bold mt-4">お気に入りポケモン</h1>

      <div className="mt-4">
        {bookmarks.map(bookmark => (
          <a
            key={bookmark.id}
            href={`/pokemon/${bookmark.pokemon_id}`}
            className="flex items-center gap-4 p-4 border-b border-gray-200
            no-underline text-inherit hover:bg-gray-900"
              >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${bookmark.pokemon_id}.png`}
              alt={bookmark.pokemon_name}
              width={64}
              height={64}
            />
            <div>
              <p className="font-bold capitalize">{bookmark.pokemon_name}</p>
              <p className="text-gray-500 text-sm">{bookmark.note}</p>

              <form action={removeBookmark} className="mt-6 space-y-2"> <input type="hidden" name="pokemon_id" value={bookmark.pokemon_id} />
                <input type="hidden" name="pokemon_name" value={bookmark.pokemon_name} />
                <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" > 削除 </button>
              </form>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
