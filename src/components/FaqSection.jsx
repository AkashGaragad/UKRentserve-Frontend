import { FAQ_DATA } from '../data/staticData';

export default function FaqSection({ section }) {
  const items = FAQ_DATA[section] || [];
  return (
    <div className="mt-8">
      <h2
        className="text-2xl font-bold mb-4 pl-3 border-l-[5px] border-blue-600 dark:border-blue-400 text-gray-900 dark:text-gray-100"
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        Frequently asked questions
      </h2>
      <div className="max-w-2xl flex flex-col gap-2">
        {items.map(([q, a]) => (
          <details
            key={q}
            className="bg-white dark:bg-[#131b38] border border-blue-100 dark:border-[#2a3768] rounded-xl px-4 py-3 group"
          >
            <summary className="font-semibold cursor-pointer text-gray-800 dark:text-gray-100 list-none flex justify-between items-center">
              {q}
              <span className="ml-2 text-blue-500 group-open:rotate-180 transition-transform duration-200 select-none">▾</span>
            </summary>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
