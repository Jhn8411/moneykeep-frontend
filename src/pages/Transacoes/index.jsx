import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiBell, FiMenu, FiUser, FiRepeat } from 'react-icons/fi';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import FeedbackModal from '../../components/FeedbackModal';
import './Transacoes.css';

const Transacoes = () => {
  const [type, setType]               = useState('expense');
  const [amount, setAmount]           = useState('');
  const [date, setDate]               = useState('');
  const [categoryId, setCategoryId]   = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  const [categories, setCategories] = useState([]);
  const [summary, setSummary]       = useState({ totalBalance: 0, monthIncome: 0, monthExpense: 0 });
  const [loading, setLoading]       = useState(true);

  const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const { toggleMenu } = useOutletContext();
  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  const fetchData = async () => {
    try {
      const [catRes, sumRes] = await Promise.all([
        api.get('/categories'),
        api.get('/dashboard/summary'),
      ]);
      setCategories(catRes.data);
      setSummary(sumRes.data);
      if (catRes.data.length > 0) setCategoryId(catRes.data[0].id);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Ao trocar para Ganho, desmarca recorrente
  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') setIsRecurring(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !date || (type === 'expense' && !categoryId)) {
      setModal({
        isOpen: true, type: 'warning',
        title: 'Campos obrigatórios',
        message: 'Por favor, preencha todos os campos obrigatórios antes de continuar.',
      });
      return;
    }

    // Se recorrente, garante que a data foi preenchida (já validada acima)
    // O dia de vencimento é extraído da data pelo backend

    try {
      await api.post('/transactions', {
        type,
        amount: parseFloat(amount),
        transaction_date: date,
        category_id: type === 'expense' ? categoryId : null,
        description,
        is_recurring: type === 'expense' ? isRecurring : false,
      });

      // Extrair dia da data para exibir na mensagem de sucesso
      const day = date ? parseInt(date.split('-')[2], 10) : null;

      setModal({
        isOpen: true, type: 'success',
        title: 'Transação adicionada!',
        message: isRecurring && day
          ? `Despesa registrada com recorrência mensal todo dia ${day}.`
          : `Sua ${type === 'expense' ? 'despesa' : 'receita'} foi registrada com sucesso.`,
      });

      setAmount('');
      setDescription('');
      setIsRecurring(false);
      fetchData();
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      setModal({
        isOpen: true, type: 'error',
        title: 'Erro ao registrar',
        message: error.response?.data?.error || 'Ocorreu um erro ao guardar a transação. Tente novamente.',
      });
    }
  };

  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  if (loading) return <h2 style={{ padding: '32px', color: 'var(--color-primary)' }}>A carregar...</h2>;

  return (
    <div className="transacoes-container">

      {/* ── HEADER ── */}
      <header className="page-header">
        <div className="header-left">
          <FiMenu className="menu-toggle" size={26} onClick={toggleMenu} />
          <h1 className="page-title">Transações</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{user.name || 'Usuário'}</span>
          <div className="user-avatar"><FiUser /></div>
        </div>
      </header>

      <div className="transacoes-body">
        <div className="transacoes-grid">

          {/* ── Formulário ── */}
          <div className="form-card">
            <div className="form-header">
              <h2>Nova Transação</h2>
              <p>Adicione um ganho ou despesa</p>
            </div>

            <div className="form-body">
              <form onSubmit={handleSubmit}>

                {/* Toggle Despesa / Ganho */}
                <div className="type-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
                    onClick={() => handleTypeChange('expense')}
                  >
                    Despesa
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`}
                    onClick={() => handleTypeChange('income')}
                  >
                    Ganho
                  </button>
                </div>

                {/* Valor */}
                <div className="input-group">
                  <label>Valor da {type === 'expense' ? 'Despesa' : 'Receita'}</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="R$ 00,00"
                    className="input-amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {/* Data + Categoria */}
                <div className="form-row">
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Data</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Categoria</label>
                    <select
                      value={type === 'income' ? '' : categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required={type === 'expense'}
                      disabled={type === 'income'}
                    >
                      {type === 'income' ? (
                        <option value="">Não se aplica a ganhos</option>
                      ) : (
                        categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Descrição */}
                <div className="input-group">
                  <label>Descrição</label>
                  <input
                    type="text"
                    placeholder="Lanche da tarde no trabalho"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* ── Pill de Recorrência — só para Despesa ── */}
                {type === 'expense' && (
                  <div className="recurring-pill-wrapper">
                    <button
                      type="button"
                      className={`recurring-pill ${isRecurring ? 'recurring-pill--active' : ''}`}
                      onClick={() => setIsRecurring(!isRecurring)}
                    >
                      <FiRepeat size={14} />
                      Recorrência mensal
                    </button>

                    {/* Dica exibida apenas quando ativo */}
                    {isRecurring && date && (
                      <span className="recurring-hint">
                        Esta despesa se repetirá todo dia {parseInt(date.split('-')[2], 10)} de cada mês.
                      </span>
                    )}
                    {isRecurring && !date && (
                      <span className="recurring-hint recurring-hint--warn">
                        Preencha a data para definir o dia de vencimento.
                      </span>
                    )}
                  </div>
                )}

                <button type="submit" className="btn-submit">
                  Adicionar Transação
                </button>

              </form>
            </div>
          </div>

          {/* ── Resumo ── */}
          <div className="summary-side-card">
            <h3>Resumo</h3>
            <div className="summary-block">
              <span>Saldo atual</span>
              <strong>{formatCurrency(summary.totalBalance)}</strong>
            </div>
            <div className="summary-block">
              <span>Ganhos do mês</span>
              <strong className="income-value">{formatCurrency(summary.monthIncome)}</strong>
            </div>
            <div className="summary-block">
              <span>Despesas do mês</span>
              <strong className="expense-value">{formatCurrency(summary.monthExpense)}</strong>
            </div>
          </div>

        </div>

        {/* ── Lembrete ── */}
        <div className="reminder-section">
          <h3>Lembrete</h3>
          <div className="reminder-card">
            <div className="reminder-icon"><FiBell size={22} /></div>
            <span className="reminder-text">
              Mantenha o hábito de registar as suas transações diariamente para ter um controlo financeiro mais preciso!
            </span>
          </div>
        </div>

      </div>

      <FeedbackModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={closeModal}
      />
    </div>
  );
};

export default Transacoes;
