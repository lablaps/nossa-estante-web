import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import { Book, User } from '../types';
import ReferenceButtons from '../components/ReferenceButtons';
import { bookService } from '../services/bookService';

const BOOK_GENRES = [
  'Ficção',
  'Não-Ficção',
  'Romance',
  'Fantasia / Ficção Científica',
  'Terror / Suspense',
  'Biografia / Memórias',
  'Autoajuda',
  'Negócios / Carreira',
  'Infantil',
  'Jovem Adulto (YA)',
  'Acadêmico / Técnico',
  'Outros'
];

const SelectField: React.FC<{ label: string, icon?: string, value: string, options: string[], onChange: (val: string) => void, required?: boolean }> = ({ label, icon, value, options, onChange, required }) => (
  <div className="space-y-1.5">
    <div className="px-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>
    </div>
    <div className="relative flex items-center group">
      {icon && (
        <span className="material-symbols-outlined absolute left-4 text-primary group-focus-within:text-primary-dark transition-colors z-10 pointer-events-none">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className={`w-full ${icon ? 'pl-12' : 'px-5'} pr-10 py-3 rounded-xl bg-white dark:bg-surface-dark dark:text-white focus:ring-4 focus:ring-primary/20 border border-black/5 dark:border-white/5 shadow-sm font-bold transition-all outline-none appearance-none cursor-pointer`}
      >
        <option value="" disabled>Selecione o gênero</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-4 text-text-muted/40 pointer-events-none">
        expand_more
      </span>
    </div>
  </div>
);

const FormField: React.FC<{ label: string, icon?: string, value: string, placeholder?: string, type?: string, onChange: (val: string) => void, required?: boolean, extra?: React.ReactNode }> = ({ label, icon, value, placeholder, type = "text", onChange, required, extra }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between px-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>
      {extra}
    </div>
    <div className="relative flex items-center group">
      {icon && (
        <span className="material-symbols-outlined absolute left-4 text-primary group-focus-within:text-primary-dark transition-colors z-10">
          {icon}
        </span>
      )}
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-surface-dark dark:text-white focus:ring-4 focus:ring-primary/20 border border-black/5 dark:border-white/5 shadow-sm placeholder:text-text-muted/40 font-bold min-h-[100px] resize-none text-sm transition-all"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full ${icon ? 'pl-12' : 'px-5'} pr-4 py-3 rounded-xl bg-white dark:bg-surface-dark dark:text-white focus:ring-4 focus:ring-primary/20 border border-black/5 dark:border-white/5 shadow-sm placeholder:text-text-muted/50 font-bold transition-all outline-none`}
        />
      )}
    </div>
  </div>
);

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetchingBook, setIsFetchingBook] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    gender: 'Ficção',
    synopses: '',
    isbn: '',
    pages: '',
    cost: 1,
    material_state: 'Good',
    publisher: '',
    publishedDate: '',
    language: '',
    coverURL: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleISBNChange = async (isbn: string) => {
    setFormData(prev => ({ ...prev, isbn }));

    // Auto-fetch if ISBN looks complete (10 or 13 chars)
    const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
    if ((cleanIsbn.length === 10 || cleanIsbn.length === 13) && !isFetchingBook) {
      setIsFetchingBook(true);
      try {
        const bookInfo = await bookService.fetchBookByISBN(cleanIsbn);
        if (bookInfo) {
          setFormData(prev => {
            const categoryMap: Record<string, string> = {
              'Fiction': 'Ficção',
              'Non-fiction': 'Não-Ficção',
              'Self-help': 'Autoajuda',
              'Business': 'Negócios',
              'Juvenile fiction': 'Infantil',
              'Fantasy': 'Fantasia',
              'Horror': 'Terror',
              'Romance': 'Romance'
            };

            return {
              ...prev,
              title: bookInfo.title || prev.title,
              author: bookInfo.authors.length > 0 ? bookInfo.authors.join(', ') : prev.author,
              pages: bookInfo.pageCount?.toString() || prev.pages,
              synopses: bookInfo.description || prev.synopses,
              publisher: bookInfo.publisher || prev.publisher,
              publishedDate: bookInfo.publishedDate || prev.publishedDate,
              language: bookInfo.language || prev.language,
              coverURL: bookInfo.thumbnail || prev.coverURL
            };
          });
        }
      } catch (error) {
        console.error('Dynamic lookup failed:', error);
      } finally {
        setIsFetchingBook(false);
      }
    }
  };

  const conditionLabels: Record<string, string> = {
    'New': 'Novo',
    'Very Good': 'Muito Bom',
    'Good': 'Bom',
    'Used': 'Usado'
  };

  const conditionDescriptions: Record<string, string> = {
    'New': 'Novo, sem uso, em perfeitas condições.',
    'Very Good': 'Lido, mas sem marcas de uso ou dobras.',
    'Good': 'Pequenas marcas de uso ou dobras leves.',
    'Used': 'Possui marcas visíveis de uso ou anotações.'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para adicionar um livro.');
      return;
    }

    try {
      const newBook: Partial<Book> = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn, 
        isbn10: formData.isbn.length === 10 ? formData.isbn : undefined,
        isbn13: formData.isbn.length === 13 ? formData.isbn : undefined,
        gender: formData.gender,
        user: user.email || '', 
        status: 'Available',
        material_state: conditionLabels[formData.material_state] || 'Good',
        cost: formData.cost,
        synopses: formData.synopses,
        pages: formData.pages,
        publisher: formData.publisher,
        publishedDate: formData.publishedDate,
        language: formData.language,
        coverURL: formData.coverURL
      };

      await dbService.addBook(newBook);
      navigate('/minha-estante');
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Erro ao adicionar livro. Verifique se o servidor está rodando.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
        <header className="sticky top-0 z-30 flex items-center bg-white/80 dark:bg-background-dark/80 backdrop-blur-md p-4 px-6 border-b border-black/5 dark:border-white/5">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-main dark:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="flex-1 text-center font-black text-lg text-text-main dark:text-white">Registrar Livro</h2>
          <div className="w-10"></div>
        </header>

        <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-5 max-w-4xl mx-auto w-full relative z-10">
          <div className="flex justify-between items-center mb-2 px-1 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">
            <span>Informações do Livro</span>
            <span className="text-primary">Etapa 1 de 1</span>
          </div>

          <FormField
            label="ISBN (Preenchimento Automático)"
            icon="barcode"
            value={formData.isbn}
            onChange={handleISBNChange}
            placeholder="Digite o código ISBN (ex: 9780132350884)"
            extra={isFetchingBook && (
              <div className="flex items-center gap-2 text-primary animate-pulse">
                <div className="size-3 border-2 border-primary/30 border-t-primary animate-spin rounded-full"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Buscando...</span>
              </div>
            )}
          />

          <div className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    label="Título da Obra"
                    value={formData.title}
                    onChange={val => setFormData({ ...formData, title: val })}
                    placeholder="ex: O Alquimista"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                  <FormField
                    label="Autor(es)"
                    value={formData.author}
                    onChange={val => setFormData({ ...formData, author: val })}
                    placeholder="ex: Paulo Coelho"
                    required
                  />
                  <SelectField
                    label="Gênero Principal"
                    icon="category"
                    value={formData.gender}
                    options={BOOK_GENRES}
                    onChange={val => setFormData({ ...formData, gender: val })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
                  <FormField
                    label="Número de Páginas"
                    type="number"
                    value={formData.pages}
                    onChange={val => setFormData({ ...formData, pages: val })}
                    placeholder="ex: 250"
                    required
                  />
                  <FormField
                    label="Custo da Troca"
                    type="number"
                    value={formData.cost.toString()}
                    onChange={val => setFormData({ ...formData, cost: parseInt(val) || 1 })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Estado de Conservação</span>
              </div>
              <div className="bg-white dark:bg-surface-dark rounded-[28px] p-1.5 flex gap-1 shadow-sm border border-black/5 dark:border-white/5 overflow-hidden">
                {['New', 'Very Good', 'Good', 'Used'].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => setFormData({ ...formData, material_state: cond })}
                    className={`flex-1 py-4 px-2 rounded-[22px] text-[10px] font-black uppercase tracking-widest transition-all ${formData.material_state === cond
                      ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-[1.02]'
                      : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                  >
                    {conditionLabels[cond]}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-text-muted font-bold px-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                {conditionDescriptions[formData.material_state]}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <FormField
                label="Sinopse do Livro"
                type="textarea"
                value={formData.synopses}
                onChange={val => setFormData({ ...formData, synopses: val })}
                placeholder="Uma breve descrição da história ou conteúdo..."
                required
              />
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
              <div className="px-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Metadados Adicionais (Opcional)</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Editora"
                  value={formData.publisher}
                  onChange={val => setFormData({ ...formData, publisher: val })}
                  placeholder="ex: Pearson"
                />
                <FormField
                  label="Data de Publicação"
                  value={formData.publishedDate}
                  onChange={val => setFormData({ ...formData, publishedDate: val })}
                  placeholder="ex: 2021"
                />
                <FormField
                  label="Idioma"
                  value={formData.language}
                  onChange={val => setFormData({ ...formData, language: val })}
                  placeholder="ex: Português"
                />
                <FormField
                  label="URL da Capa"
                  value={formData.coverURL}
                  onChange={val => setFormData({ ...formData, coverURL: val })}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="pt-8 mb-12">
            <button
              type="submit"
              className="w-full py-5 bg-primary hover:bg-[#0fd651] text-text-main font-black rounded-[32px] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 active:scale-[0.98] transition-all text-xl"
            >
              <div className="size-8 bg-black/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined filled text-xl">library_add</span>
              </div>
              Registrar na Minha Estante
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBook;
