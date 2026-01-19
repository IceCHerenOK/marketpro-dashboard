import React, { useMemo, useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { ozonEndpoints } from '../data/ozonEndpoints';
import { wbEndpoints } from '../data/wbEndpoints';

const marketplaces = {
  ozon: {
    label: 'Ozon',
    accent: 'from-emerald-500 to-emerald-700',
    data: ozonEndpoints
  },
  wb: {
    label: 'Wildberries',
    accent: 'from-orange-500 to-orange-600',
    data: wbEndpoints
  }
} as const;

type MarketplaceKey = keyof typeof marketplaces;

const methodStyles: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-amber-100 text-amber-700',
  PATCH: 'bg-purple-100 text-purple-700',
  DELETE: 'bg-rose-100 text-rose-700',
  API: 'bg-slate-100 text-slate-600'
};

export default function Documentation() {
  const [activeTab, setActiveTab] = useState<MarketplaceKey>('ozon');
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  const { data, label, accent } = marketplaces[activeTab];

  const groups = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => unique.add(item.group));
    return ['all', ...Array.from(unique).sort()];
  }, [data]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.filter((item) => {
      const matchesGroup = selectedGroup === 'all' || item.group === selectedGroup;
      const matchesQuery =
        normalized.length === 0 ||
        item.path.toLowerCase().includes(normalized) ||
        item.method.toLowerCase().includes(normalized) ||
        item.group.toLowerCase().includes(normalized);
      return matchesGroup && matchesQuery;
    });
  }, [data, query, selectedGroup]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      if (!map.has(item.group)) {
        map.set(item.group, []);
      }
      map.get(item.group)!.push(item);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-md`}>
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Документация маркетплейсов</h1>
              <p className="text-sm text-[var(--text-tertiary)]">
                Все возможности API, сгруппированные по доменам и готовые к подключению в системе.
              </p>
            </div>
          </div>
        </div>
        <div className="inline-flex rounded-full bg-[var(--bg-tertiary)] p-1 text-sm font-medium">
          {(Object.keys(marketplaces) as MarketplaceKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSelectedGroup('all');
                setQuery('');
              }}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === key
                  ? 'bg-white text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {marketplaces[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr,auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по эндпоинтам, методам, группам"
            className="input-field pl-11"
          />
        </div>
        <div>
          <select
            value={selectedGroup}
            onChange={(event) => setSelectedGroup(event.target.value)}
            className="input-field"
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group === 'all' ? 'Все группы' : group}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-end gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] px-4 py-3 text-sm text-[var(--text-tertiary)]">
          <span>{label}</span>
          <span className="text-[var(--text-primary)]">{filtered.length} эндпоинтов</span>
        </div>
      </div>

      <div className="grid gap-6">
        {grouped.map(([group, endpoints]) => (
          <section key={group} className="card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{group}</h2>
                <p className="text-sm text-[var(--text-tertiary)]">{endpoints.length} маршрутов</p>
              </div>
              <span className={`inline-flex items-center rounded-full bg-gradient-to-br ${accent} px-4 py-1 text-xs font-semibold text-white`}>
                {label}
              </span>
            </div>

            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {endpoints.map((endpoint) => (
                <div
                  key={`${endpoint.method}-${endpoint.path}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] px-4 py-3"
                >
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-tertiary)] uppercase">{endpoint.group}</span>
                    <span className="font-medium text-[var(--text-primary)]">{endpoint.path}</span>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${methodStyles[endpoint.method] || 'bg-slate-100 text-slate-600'}`}>
                    {endpoint.method}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
