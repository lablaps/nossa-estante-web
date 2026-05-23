
import React, { useEffect, useState } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';
import { Transaction, User } from '../types';

const Wallet: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setTransactions(currentUser ? await dbService.getTransactions() : []);
    };
    load();
  }, []);

  return (
    <Layout>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="p-6 md:p-12 space-y-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight dark:text-white">Painel e Insights</h1>
            <p className="text-text-muted font-medium">Acompanhe seu impacto na comunidade e sua carteira digital.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-primary text-black rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] filled">add</span>
              Adicionar Créditos
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black dark:bg-surface-dark rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Saldo Disponível</p>
                  <h2 className="text-6xl font-black flex items-center gap-4">
                    {user?.credits ?? 0}
                    <span className="material-symbols-outlined text-primary text-4xl filled">token</span>
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/10">
                {[
                  { l: 'Último Ganho', v: '+2', color: 'text-primary' },
                  { l: 'Trocas Pendentes', v: '03', color: 'text-white' },
                  // { l: 'CO2 Salvo', v: '4.2kg', color: 'text-primary' }, // Removed
                  { l: 'Ranking Global', v: '#142', color: 'text-white' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{stat.l}</p>
                    <p className={`text-lg font-black ${stat.color}`}>{stat.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[40px] p-10 border border-black/5 shadow-xl space-y-8">
            <div className="flex items-center gap-6">
              <div className="size-20 rounded-[30px] bg-primary/15 flex items-center justify-center border-4 border-[#F8FAF9] dark:border-background-dark shadow-xl text-primary text-2xl font-black uppercase">
                {user?.name?.charAt(0) || 'N'}
              </div>
              <div>
                <h3 className="text-xl font-black dark:text-white">{user?.name}</h3>
                <p className="text-xs text-text-muted font-bold">Membro Verificado</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-black/5">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Pontuação de Reputação</p>
                  <p className="text-4xl font-black dark:text-white">{user?.reputation ?? 0}</p>
                </div>
              </div>
              <div className="w-full h-3 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[96%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 bg-white dark:bg-surface-dark rounded-[40px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-black/5 flex items-center justify-between">
              <h3 className="font-black text-xl dark:text-white tracking-tight">Histórico de Transações</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAF9] dark:bg-background-dark/50">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Descrição</th>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Data</th>
                    <th className="px-8 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-black/5 transition-colors">
                      <td className="px-8 py-6 font-bold text-sm dark:text-white">
                        <div className="flex items-center gap-4">
                          {tx.description}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-xs text-text-muted font-bold">{tx.date}</td>
                      <td className={`px-8 py-6 text-sm font-black text-right ${tx.type === 'earn' ? 'text-primary' : 'text-red-500'}`}>
                        {tx.type === 'earn' ? '+' : '-'}{tx.amount} Cr.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-primary/5 dark:bg-white/5 rounded-[40px] p-8 border border-primary/20 space-y-4">
              <h4 className="font-black dark:text-white text-xl">Dica de Usuário</h4>
              <p className="text-sm text-text-muted leading-relaxed">Usuários que trocam pelo menos <span className="font-bold text-text-main dark:text-white">3 livros por mês</span> ganham o selo de "Curador" e prioridade em novos lançamentos!</p>
              <button className="text-primary font-bold text-sm hover:underline">Saiba mais sobre níveis →</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Wallet;
