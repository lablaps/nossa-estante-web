
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import { Book, BookCondition } from '../types';
import ReferenceButtons from '../components/ReferenceButtons';

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Ficção',
    language: 'Português',
    condition: 'New' as BookCondition,
    synopsis: '',
    ownerNotes: '',
    isbn: ''
  });

  const conditionLabels: Record<BookCondition, string> = {
    'New': 'Novo',
    'Very Good': 'Muito Bom',
    'Good': 'Bom',
    'Used': 'Usado',
    'Fair': 'Regular'
  };

  const conditionDescriptions: Record<BookCondition, string> = {
    'New': 'Novo, sem uso, em perfeitas condições.',
    'Very Good': 'Lido, mas sem marcas de uso ou dobras.',
    'Good': 'Pequenas marcas de uso ou dobras leves.',
    'Used': 'Possui marcas visíveis de uso ou anotações.',
    'Fair': 'Bastante usado, com marcas evidentes.'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newBook: Book = {
      id: `book_${Date.now()}`,
      title: formData.title,
      author: formData.author,
      isbn: formData.isbn || 'N/A',
      category: formData.category,
      language: formData.language,
      ownerId: user.id,
      status: 'Available',
      condition: formData.condition,
      creditsCost: 2,
      locationApprox: 'Minha Área',
      distance: '0.0km',
      photos: ['https://picsum.photos/seed/newbook/400/600'],
      synopsis: formData.synopsis,
      ownerNotes: formData.ownerNotes
    };

    dbService.addBook(newBook);
    navigate('/minha-estante');
  };

  return (
    <Layout>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
        <header className="sticky top-0 z-30 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 px-6 border-b border-black/5 dark:border-white/5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-main dark:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="flex-1 text-center font-black text-lg text-text-main dark:text-white">Registrar Livro</h2>
          <div className="w-10"></div> {/* Spacer for symmetry */}
        </header>

        <form onSubmit={handleSubmit} className="px-6 pt-8 space-y-8 max-w-2xl mx-auto w-full">
          {/* Scan Section - Compacted as it's secondary to the manual fields in reference */}
          <div className="bg-surface-dark/40 rounded-[24px] p-4 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined filled">barcode_scanner</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Escanear ISBN</p>
                <p className="text-text-muted text-[10px] font-bold uppercase tracking-wider">Preenchimento Automático</p>
              </div>
            </div>
            <button type="button" className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform">
              Abrir Câmera
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-bold dark:text-white">Título</span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="ex: O Alquimista"
                  className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark dark:text-white focus:ring-2 focus:ring-primary border-0 shadow-sm placeholder:text-text-muted/50 font-medium"
                  required
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold dark:text-white">Autor</span>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  placeholder="ex: Paulo Coelho"
                  className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark dark:text-white focus:ring-2 focus:ring-primary border-0 shadow-sm placeholder:text-text-muted/50 font-medium"
                  required
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-sm font-bold dark:text-white">Categoria</span>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark dark:text-white border-0 shadow-sm font-bold text-sm appearance-none"
                    >
                      <option>Ficção</option>
                      <option>Não-Ficção</option>
                      <option>Autoajuda</option>
                      <option>Negócios</option>
                      <option>Infantil</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
                  </div>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-bold dark:text-white">Idioma</span>
                  <div className="relative">
                    <select
                      value={formData.language}
                      onChange={e => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark dark:text-white border-0 shadow-sm font-bold text-sm appearance-none"
                    >
                      <option>Português</option>
                      <option>Inglês</option>
                      <option>Espanhol</option>
                      <option>Francês</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Condition Segmented Control */}
            <div className="space-y-3">
              <span className="text-sm font-bold dark:text-white">Condição</span>
              <div className="bg-white dark:bg-surface-dark rounded-[24px] p-1 flex gap-1 shadow-sm overflow-x-auto no-scrollbar border border-black/5 dark:border-white/5">
                {(['New', 'Very Good', 'Good', 'Used'] as BookCondition[]).map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    className={`flex-1 py-3 px-2 rounded-[20px] text-xs font-bold transition-all whitespace-nowrap ${formData.condition === cond
                      ? 'bg-primary text-black shadow-lg shadow-primary/20'
                      : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                  >
                    {conditionLabels[cond]}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-text-muted font-bold ml-1">
                {conditionDescriptions[formData.condition]}
              </p>
            </div>

            {/* Photo Upload Slots */}
            <div className="space-y-3">
              <span className="text-sm font-bold dark:text-white">Fotos Reais do Livro</span>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                <button type="button" className="shrink-0 size-24 rounded-2xl border-2 border-primary border-dashed bg-primary/5 flex flex-col items-center justify-center text-primary group active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-4xl">add_a_photo</span>
                </button>
                {[1, 2, 3].map(i => (
                  <div key={i} className="shrink-0 size-24 rounded-2xl bg-white dark:bg-surface-dark flex items-center justify-center text-text-muted/30 border border-black/5 dark:border-white/5 shadow-sm">
                    <span className="material-symbols-outlined text-3xl">image</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="block space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-sm font-bold dark:text-white">Observações do Proprietário</span>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Opcional</span>
              </div>
              <textarea
                value={formData.ownerNotes}
                onChange={e => setFormData({ ...formData, ownerNotes: e.target.value })}
                placeholder="Mencione marcas, grifos ou danos..."
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark dark:text-white focus:ring-2 focus:ring-primary border-0 shadow-sm placeholder:text-text-muted/40 font-medium min-h-[100px] resize-none text-sm"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-bold dark:text-white">Sinopse</span>
              <textarea
                value={formData.synopsis}
                onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
                placeholder="Digite a descrição do livro..."
                className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-surface-dark dark:text-white focus:ring-2 focus:ring-primary border-0 shadow-sm placeholder:text-text-muted/40 font-medium min-h-[120px] resize-none text-sm"
                required
              />
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-5 bg-primary text-text-main font-black rounded-3xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all text-lg"
            >
              <span className="material-symbols-outlined filled">add_circle</span>
              Adicionar à Minha Estante
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBook;
