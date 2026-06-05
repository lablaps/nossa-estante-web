import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';
import { authService } from '../services/authService';
import { bookService } from '../services/bookService';
import { dbService } from '../services/dbService';
import { Book } from '../types';

const BOOK_GENRES = [
  'Ficcao',
  'Nao-Ficcao',
  'Romance',
  'Fantasia / Ficcao Cientifica',
  'Terror / Suspense',
  'Biografia / Memorias',
  'Autoajuda',
  'Negocios / Carreira',
  'Infantil',
  'Jovem Adulto (YA)',
  'Academico / Tecnico',
  'Outros'
];

const MATERIAL_STATES = ['Novo', 'Muito Bom', 'Bom', 'Usado'];

type FormData = {
  title: string;
  author: string;
  gender: string;
  material_state: string;
  isbnSearch: string;
  isbn10: string;
  isbn13: string;
  coverURL: string;
  synopses: string;
  publisher: string;
  publishedDate: string;
  pageCount: string;
  language: string;
  edition: string;
  physicalFormat: string;
  publishPlace: string;
  cost: string;
  contributors: string;
};

const initialFormData: FormData = {
  title: '',
  author: '',
  gender: '',
  material_state: '',
  isbnSearch: '',
  isbn10: '',
  isbn13: '',
  coverURL: '',
  synopses: '',
  publisher: '',
  publishedDate: '',
  pageCount: '',
  language: 'pt',
  edition: '',
  physicalFormat: '',
  publishPlace: '',
  cost: '0',
  contributors: ''
};

const cleanISBN = (value: string) => value.replace(/[^0-9X]/gi, '').toUpperCase();

const SelectField: React.FC<{
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
}> = ({ label, value, options, placeholder, onChange, required }) => (
  <div className="space-y-1.5">
    <div className="px-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>
    </div>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      required={required}
      className="w-full px-5 pr-10 py-3 rounded-xl bg-white dark:bg-surface-dark dark:text-white focus:ring-4 focus:ring-primary/20 border border-black/5 dark:border-white/5 shadow-sm font-bold transition-all outline-none appearance-none cursor-pointer"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const FormField: React.FC<{
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  onChange: (value: string) => void;
  required?: boolean;
  min?: number;
  extra?: React.ReactNode;
}> = ({ label, value, placeholder, type = 'text', onChange, required, min, extra }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between px-2">
      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{label}</span>
      {extra}
    </div>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-surface-dark dark:text-white focus:ring-4 focus:ring-primary/20 border border-black/5 dark:border-white/5 shadow-sm placeholder:text-text-muted/40 font-bold min-h-[110px] resize-none text-sm transition-all outline-none"
      />
    ) : (
      <input
        type={type}
        min={min}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-5 py-3 rounded-xl bg-white dark:bg-surface-dark dark:text-white focus:ring-4 focus:ring-primary/20 border border-black/5 dark:border-white/5 shadow-sm placeholder:text-text-muted/50 font-bold transition-all outline-none"
      />
    )}
  </div>
);

const AddBook: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isFetchingBook, setIsFetchingBook] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate('/login', { replace: true });
        return;
      }
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const mergeISBNData = (data: Partial<FormData>) => {
    const hasConflicts = Object.entries(data).some(([key, value]) => {
      const field = key as keyof FormData;
      return Boolean(value) && Boolean(formData[field]) && formData[field] !== value;
    });

    const shouldOverwrite = hasConflicts
      ? window.confirm('Alguns campos ja estao preenchidos. Deseja sobrescrever com os dados do ISBN?')
      : false;

    setFormData(prev => {
      const next = { ...prev };
      Object.entries(data).forEach(([key, value]) => {
        const field = key as keyof FormData;
        if (!value) return;
        if (!next[field] || shouldOverwrite) {
          next[field] = value;
        }
      });
      return next;
    });
  };

  const fillBookFromISBN = async () => {
    const isbn = cleanISBN(formData.isbnSearch);
    setFormData(prev => ({ ...prev, isbnSearch: isbn }));
    setMessage('');
    setErrors([]);

    if (isbn.length !== 10 && isbn.length !== 13) {
      setMessage('Informe um ISBN-10 ou ISBN-13 valido.');
      return;
    }

    setIsFetchingBook(true);
    try {
      const bookInfo = await bookService.fetchBookByISBN(isbn);
      if (!bookInfo) {
        setMessage('ISBN nao encontrado. Preencha manualmente.');
        return;
      }

      const apiGender = bookInfo.categories?.find(category => BOOK_GENRES.includes(category));

      mergeISBNData({
        title: bookInfo.title || '',
        author: bookInfo.authors?.join(', ') || '',
        coverURL: bookInfo.thumbnail || '',
        synopses: bookInfo.description || '',
        publisher: bookInfo.publisher || '',
        publishedDate: bookInfo.publishedDate || '',
        pageCount: bookInfo.pageCount ? String(bookInfo.pageCount) : '',
        language: bookInfo.language || '',
        gender: apiGender || (bookInfo.categories?.length ? 'Outros' : ''),
        physicalFormat: bookInfo.physicalFormat || '',
        publishPlace: bookInfo.publishPlace || '',
        isbn10: isbn.length === 10 ? isbn : '',
        isbn13: isbn.length === 13 ? isbn : ''
      });
      setMessage('Dados encontrados. Revise antes de salvar.');
    } catch (error) {
      setMessage('Erro ao buscar ISBN. Tente novamente.');
    } finally {
      setIsFetchingBook(false);
    }
  };

  const validate = () => {
    const nextErrors: string[] = [];
    if (!formData.title.trim()) nextErrors.push('Titulo e obrigatorio.');
    if (!formData.author.trim()) nextErrors.push('Autor e obrigatorio.');
    if (!formData.gender.trim()) nextErrors.push('Genero e obrigatorio.');
    if (!formData.material_state.trim()) nextErrors.push('Estado fisico e obrigatorio.');
    if (Number(formData.cost || 0) < 0) nextErrors.push('Custo/pontos nao pode ser negativo.');

    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const cleanSearchISBN = cleanISBN(formData.isbnSearch);
      const book: Partial<Book> = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn10: formData.isbn10.trim() || (cleanSearchISBN.length === 10 ? cleanSearchISBN : ''),
        isbn13: formData.isbn13.trim() || (cleanSearchISBN.length === 13 ? cleanSearchISBN : ''),
        gender: formData.gender.trim(),
        language: formData.language.trim(),
        status: 'Available',
        material_state: formData.material_state.trim(),
        cost: Number(formData.cost || 0),
        coverURL: formData.coverURL.trim(),
        synopses: formData.synopses.trim(),
        publisher: formData.publisher.trim(),
        publishedDate: formData.publishedDate.trim(),
        pageCount: formData.pageCount ? Number(formData.pageCount) : undefined,
        edition: formData.edition.trim(),
        publishPlace: formData.publishPlace.trim(),
        physicalFormat: formData.physicalFormat.trim(),
        contributors: formData.contributors
          .split(',')
          .map(contributor => contributor.trim())
          .filter(Boolean)
      };

      await dbService.addBook(book);
      navigate('/minha-estante');
    } catch (error: any) {
      const apiMessage = error?.response?.data?.message || error?.response?.data?.title;
      setMessage(apiMessage || 'Erro ao cadastrar livro. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
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
          <button type="button" onClick={() => navigate(-1)} className="p-2 -ml-2 text-text-main dark:text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="flex-1 text-center font-black text-lg text-text-main dark:text-white">Cadastrar Livro</h2>
          <div className="w-10"></div>
        </header>

        <form onSubmit={handleSubmit} className="px-6 pt-6 space-y-5 max-w-4xl mx-auto w-full relative z-10">
          <div className="flex justify-between items-center mb-2 px-1 text-text-muted font-black text-[10px] uppercase tracking-[0.2em]">
            <span>Informacoes do Livro</span>
            <span className="text-primary">Cadastro</span>
          </div>

          <FormField
            label="Buscar por ISBN"
            value={formData.isbnSearch}
            onChange={value => updateField('isbnSearch', cleanISBN(value))}
            placeholder="Digite ISBN-10 ou ISBN-13"
            extra={
              <button
                type="button"
                onClick={fillBookFromISBN}
                disabled={isFetchingBook}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline disabled:opacity-60"
              >
                {isFetchingBook ? 'Buscando...' : 'Buscar ISBN'}
              </button>
            }
          />

          {(message || errors.length > 0) && (
            <div className="rounded-2xl bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 px-4 py-3 text-sm font-bold text-amber-700 dark:text-amber-300">
              {message && <p>{message}</p>}
              {errors.map(error => <p key={error}>{error}</p>)}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField label="Titulo" value={formData.title} onChange={value => updateField('title', value)} required />
            </div>
            <FormField label="Autor" value={formData.author} onChange={value => updateField('author', value)} required />
            <SelectField
              label="Genero"
              value={formData.gender}
              options={BOOK_GENRES}
              placeholder="Selecione o genero"
              onChange={value => updateField('gender', value)}
              required
            />
            <SelectField
              label="Estado fisico"
              value={formData.material_state}
              options={MATERIAL_STATES}
              placeholder="Selecione o estado"
              onChange={value => updateField('material_state', value)}
              required
            />
            <FormField label="Custo/pontos" type="number" min={0} value={formData.cost} onChange={value => updateField('cost', value)} />
            <FormField label="ISBN-10" value={formData.isbn10} onChange={value => updateField('isbn10', cleanISBN(value))} />
            <FormField label="ISBN-13" value={formData.isbn13} onChange={value => updateField('isbn13', cleanISBN(value))} />
            <div className="md:col-span-2">
              <FormField label="Capa (URL)" value={formData.coverURL} onChange={value => updateField('coverURL', value)} />
            </div>
            <FormField label="Editora" value={formData.publisher} onChange={value => updateField('publisher', value)} />
            <FormField label="Ano/data de publicacao" value={formData.publishedDate} onChange={value => updateField('publishedDate', value)} />
            <FormField label="Paginas" type="number" min={0} value={formData.pageCount} onChange={value => updateField('pageCount', value)} />
            <FormField label="Idioma" value={formData.language} onChange={value => updateField('language', value)} />
            <FormField label="Edicao" value={formData.edition} onChange={value => updateField('edition', value)} />
            <FormField label="Formato fisico" value={formData.physicalFormat} onChange={value => updateField('physicalFormat', value)} />
            <FormField label="Local de publicacao" value={formData.publishPlace} onChange={value => updateField('publishPlace', value)} />
            <FormField label="Contribuidores" value={formData.contributors} onChange={value => updateField('contributors', value)} placeholder="Separar por virgula" />
            <div className="md:col-span-2">
              <FormField
                label="Sinopse"
                type="textarea"
                value={formData.synopses}
                onChange={value => updateField('synopses', value)}
              />
            </div>
          </div>

          <div className="pt-8 mb-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-5 bg-primary hover:bg-[#0fd651] text-text-main font-black rounded-[32px] shadow-2xl shadow-primary/20 flex items-center justify-center gap-4 active:scale-[0.98] transition-all text-xl disabled:opacity-70"
            >
              <div className="size-8 bg-black/10 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined filled text-xl">library_add</span>
              </div>
              {isSubmitting ? 'Cadastrando...' : 'Salvar na Minha Estante'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBook;
