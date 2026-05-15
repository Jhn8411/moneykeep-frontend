import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiMenu, FiUser, FiRepeat, FiEdit2, FiTrash2, FiInfo } from 'react-icons/fi';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import FeedbackModal from '../../components/FeedbackModal';
import './Recorrentes.css';

const EMPTY_FORM = { description: '', amount: '', due_day: '', category_id: '' };

/**
 * Dado um due_day (1–31) e um ano/mês, retorna o dia real de vencimento.
 * Se o mês não tiver o dia (ex: dia 31 em fevereiro), usa o último dia do mês.
 */
const resolveDay = (dueDay, year, month) => {
  const lastDay = new Date(year, month, 0).getDate(); // dia 0 do mês seguinte = último dia do mês atual
  return Math.min(dueDay, lastDay);
};

/** Retorna texto descritivo do próximo vencimento */
const nextDueLabel = (dueDay) => {
  const today = new Date();
  const year  = today.getFullYear();
  const month = today.getMonth() + 1; // 1-indexed
  const day   = today.getDate();

  let targetMonth = month;
  let targetYear  = year;

  const resolvedThisMonth = resolveDay(dueDay, year, month);

  if (day > resolvedThisMonth) {
    // Já passou neste mês — próximo é no mês seguinte
    targetMonth = month === 12 ? 1 : month + 1;
    targetYear  = month === 12 ? year + 1 : year;
  }

  const resolvedDay = resolveDay(dueDay, targetYear, targetMonth);
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${resolvedDay} de ${months[targetMonth - 1]}.`;
};

const Recorrentes = () => {
  const { toggleMenu } = useOutletContext();
  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  const [items, setItems]           = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);

  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [modal, setModal]                     = useState({ isOpen: false, type: 'success', title: '', message: '', mode: 'feedback' });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      const [recRes, catRes] = await Promise.all([
        api.get('/recurring'),
        api.get('/categories'),
      ]);
      setItems(recRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Erro ao carregar recorrentes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  const handleModalConfirm = () => {
    if (modal.mode === 'confirm-delete') {
      executeDelete(pendingDeleteId);
    } else {
      closeModal();
    }
  };

  // ── Preencher formulário de edição ──
  const handleEdit = (item) => {
    setForm({
      description: item.description,
      amount:      item.amount,
      due_day:     item.due_day,
      category_id: item.category_id || '',
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  // ── Salvar edição ──
  const handleSubmit = async (e) => {
    e.preventDefault();

    const day = parseInt(form.due_day, 10);
    if (!day || day < 1 || day > 31) {
      setModal({ isOpen: true, type: 'warning', title: 'Dia inválido', message: 'O dia de vencimento deve ser entre 1 e 31.', mode: 'feedback' });
      return;
    }

    try {
      await api.put(`/recurring/${editingId}`, form);
      setModal({ isOpen: true, type: 'success', title: 'Despesa atualizada!', message: 'As alterações foram salvas com sucesso.', mode: 'feedback' });
      setForm(EMPTY_FORM);
      setEditingId(null);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.error || 'Ocorreu um erro. Tente novamente.';
      setModal({ isOpen: true, type: 'error', title: 'Erro ao salvar', message: msg, mode: 'feedback' });
    }
  };

  // ── Confirmar exclusão ──
  const handleDelete = (id, description) => {
    setPendingDeleteId(id);
    setModal({
      isOpen: true, type: 'confirm',
      title: 'Excluir despesa recorrente?',
      message: `"${description}" será removida permanentemente e não será mais lançada nos próximos meses.`,
      mode: 'confirm-delete',
    });
  };

  const executeDelete = async (id) => {
    closeModal();
    try {
      await api.delete(`/recurring/${id}`);
      fetchData();
    } catch {
      setModal({ isOpen: true, type: 'error', title: 'Erro ao excluir', message: 'Não foi possível remover a despesa. Tente novamente.', mode: 'feedback' });
    }
  };

  const totalMensal = items.reduce((acc, i) => acc + parseFloat(i.amount), 0);

  if (loading) return <h2 style={{ padding: '32px', color: 'var(--color-primary)' }}>A carregar...</h2>;

  return (
    <div className="recorrentes-container">

      {/* ── HEADER ── */}
      <header className="page-header">
        <div className="header-left">
          <FiMenu className="menu-toggle" size={26} onClick={toggleMenu} />
          <h1 className="page-title">Despesas Recorrentes</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{user.name || 'Usuário'}</span>
          <div className="user-avatar"><FiUser /></div>
        </div>
      </header>

      <div className="recorrentes-body">

        {/* ── FORMULÁRIO DE EDIÇÃO (aparece só ao clicar em Editar) ── */}
        {editingId && (
          <div className="form-card">
            <div className="form-header">
              <div className="form-header-icon"><FiEdit2 size={18} /></div>
              <div>
                <h2>Editar Despesa Recorrente</h2>
                <p>Atualize os dados abaixo e salve</p>
              </div>
            </div>

            <div className="form-body">
              <form onSubmit={handleSubmit}>

                <div className="input-group">
                  <label>Descrição *</label>
                  <input
                    type="text"
                    placeholder="Ex: Conta de luz, Netflix..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Valor (R$) *</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Dia do vencimento (1–31) *</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      placeholder="Ex: 20"
                      value={form.due_day}
                      onChange={(e) => setForm({ ...form, due_day: e.target.value })}
                      required
                    />
                    {/* Aviso caso dia > 28 */}
                    {parseInt(form.due_day) > 28 && (
                      <span className="due-day-hint">
                        <FiInfo size={12} /> Em meses sem o dia {form.due_day}, será usada automaticamente a última data do mês.
                      </span>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label>Categoria</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
                  <button type="submit" className="btn-submit-edit">Salvar Alterações</button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ── GRID: lista + painel ── */}
        <div className="recorrentes-grid">

          {/* ── LISTA ── */}
          <div className="list-section">
            <h3>Despesas Cadastradas</h3>

            {items.length === 0 ? (
              <div className="empty-state">
                <FiRepeat size={40} />
                <p>Nenhuma despesa recorrente cadastrada ainda.</p>
                <span>Ao cadastrar uma transação, ative "Recorrência mensal" para ela aparecer aqui.</span>
              </div>
            ) : (
              <div className="recurring-list">
                {items.map((item) => (
                  <div key={item.id} className="recurring-item">

                    <div className="recurring-item-left">
                      <div className="due-day-badge">
                        <span>dia</span>
                        <strong>{item.due_day}</strong>
                      </div>
                      <div className="recurring-item-info">
                        <strong className="recurring-item-desc">{item.description}</strong>
                        <span className="recurring-item-cat">{item.category_name || 'Sem categoria'}</span>
                        <span className="recurring-item-next">
                          Próx. vencimento: {nextDueLabel(item.due_day)}
                        </span>
                      </div>
                    </div>

                    <div className="recurring-item-right">
                      <span className="recurring-item-amount">{formatCurrency(item.amount)}</span>
                      <div className="recurring-item-actions">
                        <button
                          className="action-btn action-btn--edit"
                          title="Editar"
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          className="action-btn action-btn--delete"
                          title="Excluir"
                          onClick={() => handleDelete(item.id, item.description)}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── PAINEL LATERAL ── */}
          <div className="summary-side-card">
            <h3>Previsão Mensal</h3>
            <div className="summary-block">
              <span>Total previsto por mês</span>
              <strong className="expense-value">{formatCurrency(totalMensal)}</strong>
            </div>
            <div className="summary-block">
              <span>Despesas cadastradas</span>
              <strong>{items.length}</strong>
            </div>
            <div className="summary-tip">
              <FiRepeat size={16} />
              <span>
                Para adicionar uma recorrente, cadastre a transação e ative "Recorrência mensal".
                Em meses sem o dia de vencimento, o lançamento ocorre no último dia do mês.
              </span>
            </div>
          </div>

        </div>

      </div>

      <FeedbackModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={handleModalConfirm}
        onCancel={closeModal}
        confirmText={modal.mode === 'confirm-delete' ? 'Sim, excluir' : undefined}
      />
    </div>
  );
};

export default Recorrentes;
