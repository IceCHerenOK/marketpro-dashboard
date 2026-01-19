import React, { useMemo, useState } from 'react';
import { PlayCircle, RefreshCw } from 'lucide-react';
import { axiosInstance } from '../utils/api';

type ActionConfig = {
  id: string;
  name: string;
  description: string;
  method: string;
  path: string;
  defaultBody?: Record<string, any> | Array<any> | null;
  defaultParams?: Record<string, any> | null;
};

type MarketplaceKey = 'ozon' | 'wildberries';

type MarketplaceActions = {
  label: string;
  actions: ActionConfig[];
};

type Props = {
  title: string;
  description: string;
  marketplaces: Record<MarketplaceKey, MarketplaceActions>;
};

export default function MarketplaceActionPanel({ title, description, marketplaces }: Props) {
  const [activeMarketplace, setActiveMarketplace] = useState<MarketplaceKey>('ozon');
  const [selectedActionId, setSelectedActionId] = useState<string>(
    marketplaces.ozon.actions[0]?.id || ''
  );
  const [bodyText, setBodyText] = useState('');
  const [paramsText, setParamsText] = useState('');
  const [responseText, setResponseText] = useState('');
  const [loading, setLoading] = useState(false);

  const actions = marketplaces[activeMarketplace].actions;
  const selectedAction = useMemo(
    () => actions.find((action) => action.id === selectedActionId) || actions[0],
    [actions, selectedActionId]
  );

  const resetPayloads = () => {
    setBodyText(
      selectedAction?.defaultBody ? JSON.stringify(selectedAction.defaultBody, null, 2) : ''
    );
    setParamsText(
      selectedAction?.defaultParams ? JSON.stringify(selectedAction.defaultParams, null, 2) : ''
    );
  };

  React.useEffect(() => {
    setSelectedActionId(actions[0]?.id || '');
  }, [activeMarketplace, actions]);

  React.useEffect(() => {
    resetPayloads();
    setResponseText('');
  }, [selectedAction?.id]);

  const runAction = async () => {
    if (!selectedAction) return;
    setLoading(true);
    setResponseText('');
    try {
      const data = bodyText ? JSON.parse(bodyText) : undefined;
      const params = paramsText ? JSON.parse(paramsText) : undefined;
      const result = await axiosInstance.post(`/integrations/${activeMarketplace}/request`, {
        method: selectedAction.method,
        path: selectedAction.path,
        data,
        params
      });
      setResponseText(JSON.stringify(result.data, null, 2));
    } catch (error: any) {
      const details = error?.response?.data || error?.message || 'Неизвестная ошибка';
      setResponseText(JSON.stringify(details, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-sm text-[var(--text-tertiary)]">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {(Object.keys(marketplaces) as MarketplaceKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveMarketplace(key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeMarketplace === key
                ? 'bg-[var(--primary)] text-white'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {marketplaces[key].label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr,2fr]">
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[var(--text-secondary)]">Операции</div>
          <div className="space-y-2">
            {actions.map((action) => (
              <button
                key={action.id}
                onClick={() => setSelectedActionId(action.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selectedAction?.id === action.id
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--card-hover)]'
                }`}
              >
                <div className="text-sm font-semibold">{action.name}</div>
                <div className="text-xs text-[var(--text-tertiary)]">{action.description}</div>
                <div className="mt-2 text-xs text-[var(--text-secondary)]">
                  {action.method} {action.path}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
            <div className="text-sm font-semibold">Запрос</div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[var(--text-tertiary)]">Тело (JSON)</label>
                <textarea
                  value={bodyText}
                  onChange={(event) => setBodyText(event.target.value)}
                  className="input-field min-h-[180px] font-mono text-xs"
                  placeholder="{}"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-[var(--text-tertiary)]">Параметры (JSON)</label>
                <textarea
                  value={paramsText}
                  onChange={(event) => setParamsText(event.target.value)}
                  className="input-field min-h-[180px] font-mono text-xs"
                  placeholder="{}"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={runAction} disabled={loading}>
                {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <PlayCircle className="h-4 w-4 mr-2" />}
                Выполнить
              </button>
              <button className="btn-secondary" onClick={resetPayloads}>
                Сбросить
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
            <div className="text-sm font-semibold">Ответ</div>
            <pre className="mt-3 max-h-[320px] overflow-auto rounded-xl bg-white p-3 text-xs text-[var(--text-secondary)]">
              {responseText || 'Ответ появится здесь после выполнения запроса.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
