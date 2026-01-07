import { useEffect, useState } from "react";

type NewsItem = {
  topic: string;
  description: string;
  source: string;
};

export default function TodayNewsSection() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/v1/news/get")
      .then((res) => res.json())
      .then((data) => {
        const formatted =
          (data.latestContent ?? []).map((item: any) => {
            const news = item.article_lead || item.article_list;

            return {
              topic: news?.title,
              description: news?.description,
              source: news?.source,
            };
          });

        setNewsList(formatted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm p-4">Loading news...</p>;

  return (
    <section className="w-full p-4 bg-white rounded-xl border border-green-200">
      <h2 className="text-sm font-semibold text-green-900 mb-3">
        Today News · Deshaya
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {newsList.map((item, index) => (
          <a
            key={index}
            href={item.source}
            target="_blank"
            rel="noopener noreferrer"
            className="relative p-3 rounded-lg border border-gray-200 bg-green-50"
          >
            <p className="text-l font-bold">{item.topic}</p>
            <p className="text-sm">{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
