import React, { useEffect, useState } from 'react';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';
import { axiosInstance } from '../utils/api';

type KnowledgeItem = {
  id: number;
  title: string;
  category?: string;
  marketplace?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
};

type KnowledgeEntry = KnowledgeItem & {
  content_html: string;
};

const presentationCards = [
  {
    title: 'Заказы и продажи',
    description: 'Работа с заказами, статусами, отгрузками и возвратами.'
  },
  {
    title: 'Цены и остатки',
    description: 'Управление ценами, скидками и складскими остатками.'
  },
  {
    title: 'Реклама',
    description: 'Запуск кампаний, анализ эффективности и бюджеты.'
  },
  {
    title: 'Аналитика',
    description: 'Отчеты по продажам, воронкам и SKU-аналитика.'
  },
  {
    title: 'Финансы',
    description: 'Доходы, расходы, комиссии и взаиморасчеты.'
  }
];

export default function KnowledgeBase() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [selected, setSelected] = useState<KnowledgeEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    marketplace: '',
    tags: '',
    contentHtml: ''
  });

  const loadItems = async () => {
    const response = await axiosInstance.get('/knowledge');
    setItems(response.data.items || []);
  };

  const loadEntry = async (id: number) => {
    const response = await axiosInstance.get(`/knowledge/${id}`);
    setSelected(response.data.item);
  };

  const resetForm = () => {
    setForm({ title: '', category: '', marketplace: '', tags: '', contentHtml: '' });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.contentHtml) return;

    if (selected?.id) {
      await axiosInstance.put(`/knowledge/${selected.id}`, form);
      await loadEntry(selected.id);
    } else {
      await axiosInstance.post('/knowledge', form);
    }
    await loadItems();
    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/knowledge/${id}`);
    if (selected?.id === id) {
      setSelected(null);
    }
    await loadItems();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary-gradient)] text-white shadow-md">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">База знаний</h1>
            <p className="text-sm text-[var(--text-tertiary)]">
              Инструкции и обучающие материалы по использованию сервиса.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setSelected(null);
            resetForm();
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить материал
        </button>
      </div>

      <section className="grid gap-4 lg:grid-cols-5">
        {presentationCards.map((card) => (
          <div key={card.title} className="card">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-[var(--text-tertiary)]">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,2fr]">
        <div className="card space-y-4">
          <div className="text-sm font-semibold text-[var(--text-secondary)]">Материалы</div>
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => loadEntry(item.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  selected?.id === item.id
                    ? 'border-[var(--primary)] bg-[var(--primary-light)]'
                    : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] hover:bg-[var(--card-hover)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold">{item.title}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">
                      {item.category || 'Без категории'} · {item.marketplace || 'Все площадки'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setShowForm(true);
                        setForm({
                          title: item.title,
                          category: item.category || '',
                          marketplace: item.marketplace || '',
                          tags: item.tags || '',
                          contentHtml: selected?.id === item.id ? selected.content_html : ''
                        });
                        loadEntry(item.id);
                      }}
                      className="rounded-lg p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="rounded-lg p-2 text-[var(--text-tertiary)] hover:text-[var(--danger-color)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {selected ? (
            <div>
              <h2 className="text-xl font-semibold">{selected.title}</h2>
              <div className="mt-2 text-sm text-[var(--text-tertiary)]">
                {selected.category || 'Без категории'} · {selected.marketplace || 'Все площадки'} ·{' '}
                {selected.tags || 'Без тегов'}
              </div>
              <div
                className="knowledge-content mt-6"
                dangerouslySetInnerHTML={{ __html: selected.content_html || '' }}
              />
            </div>
          ) : (
            <div className="text-sm text-[var(--text-tertiary)]">
              Выберите материал слева, чтобы увидеть содержимое.
            </div>
          )}
        </div>
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="text-lg font-semibold">
              {selected ? 'Редактировать материал' : 'Новый материал'}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Заголовок"
                className="input-field"
              />
              <div className="grid gap-4 lg:grid-cols-3">
                <input
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Категория"
                  className="input-field"
                />
                <input
                  value={form.marketplace}
                  onChange={(e) => setForm({ ...form, marketplace: e.target.value })}
                  placeholder="Маркетплейс"
                  className="input-field"
                />
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="Теги"
                  className="input-field"
                />
              </div>
              <textarea
                value={form.contentHtml}
                onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
                placeholder="Rich контент (HTML)"
                className="input-field min-h-[240px]"
              />
              <div className="flex justify-end gap-3">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn-primary">
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
