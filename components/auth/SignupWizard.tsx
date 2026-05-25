import React, { useState } from 'react';
import { authService } from '../../services/authService';

const SOCIAL_BUTTONS = [
  {
    label: 'Facebook',
    className: 'bg-[#1877F2] text-white',
    icon: <span className="text-xl font-black leading-none">f</span>,
  },
  {
    label: 'Gmail',
    className: 'bg-white text-[#202124] ring-1 ring-black/5',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#EA4335" d="M24 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.76a5.78 5.78 0 0 1-2.5 3.79v3.14h4.04c2.37-2.19 3.7-5.42 3.7-9.04Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.89l-4.04-3.14c-1.12.75-2.56 1.19-3.91 1.19-3 0-5.54-2.03-6.45-4.75H1.38v3.24A12 12 0 0 0 12 24Z" />
        <path fill="#4A90E2" d="M5.55 14.41A7.2 7.2 0 0 1 5.19 12c0-.84.14-1.65.36-2.41V6.35H1.38A12 12 0 0 0 0 12c0 1.94.46 3.77 1.38 5.65l4.17-3.24Z" />
        <path fill="#FBBC05" d="M12 4.77c1.77 0 3.35.61 4.6 1.81l3.45-3.45C17.95 1.15 15.24 0 12 0A12 12 0 0 0 1.38 6.35l4.17 3.24C6.46 6.8 9 4.77 12 4.77Z" />
      </svg>
    ),
  },
];

const FAVORITE_CATEGORIES = [
  'Romance', 'Ficção', 'Fantasia', 'Terror', 'Biografia',
  'Negócios', 'Autoajuda', 'Tecnologia', 'HQs', 'Acadêmico',
];

const PROFESSIONAL_INTERESTS = [
  'Tecnologia', 'Educação', 'Direito', 'Saúde',
  'Marketing', 'Design', 'Financas', 'Empreendedorismo',
];

const EXCHANGE_GOALS = [
  'Descobrir novos autores',
  'Trocar livros parados',
  'Criar networking',
  'Economizar em leituras',
  'Participar da comunidade',
];

const STEP_TITLES = ['Acesso', 'Perfil', 'Interesses', 'Conta'];

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

type SignupWizardProps = {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
};

const SocialButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  className: string;
}> = ({ label, icon, className }) => (
  <button
    type="button"
    className={`w-full flex items-center justify-center gap-3 rounded-3xl px-5 py-4 font-bold text-base shadow-sm transition-all hover:-translate-y-0.5 ${className}`}
  >
    <span className="flex items-center justify-center">{icon}</span>
    <span>Continuar com {label}</span>
  </button>
);

const StepChip: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`rounded-full px-4 py-2.5 text-sm font-bold transition-all ${
      selected
        ? 'bg-primary text-text-main shadow-lg shadow-primary/20'
        : 'bg-background-light text-text-muted ring-1 ring-black/5'
    }`}
  >
    {label}
  </button>
);

const SignupWizard: React.FC<SignupWizardProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [favoriteBook, setFavoriteBook] = useState('');
  const [readingMoment, setReadingMoment] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [professionalInterests, setProfessionalInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSelection = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter(current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  };

  const canContinue = () => {
    if (step === 0) return phone.replace(/\D/g, '').length >= 10;
    if (step === 1) return name.trim().length > 0 && city.trim().length > 0;
    if (step === 2) return categories.length > 0 && goals.length > 0;
    if (step === 3) {
      return email.trim().length > 0 && password.trim().length >= 6 && password === confirmPassword;
    }
    return true;
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(event.target.value));
  };

  const handleNext = async () => {
    if (!canContinue()) {
      setMessage(
        step === 3
          ? 'Confira seu e-mail e confirme a senha para finalizar o cadastro.'
          : 'Preencha as informacoes principais desta etapa para continuar.',
      );
      return;
    }

    setMessage('');
    if (step < STEP_TITLES.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signup({
        name,
        email,
        password_raw: password,
        role: 'ADMIN',
      });

      if (result) {
        onSuccess();
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage('Ja existe uma conta com este e-mail.');
      } else {
        setMessage('Não foi possível concluir o cadastro agora. Tente novamente em instantes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepSections = [
    <section key="access" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 1</p>
        <h2 className="text-3xl font-extrabold text-text-main">Como você quer começar?</h2>
        <p className="text-base text-text-muted font-medium">
          Entre pelo celular agora e deixe os atalhos visuais de Facebook e Gmail prontos para depois.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-base font-semibold ml-2">Numero do celular</label>
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">smartphone</span>
          <input
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full pl-14 pr-5 py-5 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
            placeholder="(98) 99999-9999"
            maxLength={15}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {SOCIAL_BUTTONS.map((button) => (
          <SocialButton key={button.label} label={button.label} className={button.className} icon={button.icon} />
        ))}
      </div>
    </section>,
    <section key="profile" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 2</p>
        <h2 className="text-3xl font-extrabold text-text-main">Monte seu perfil</h2>
        <p className="text-base text-text-muted font-medium">
          Essas informações ajudam a personalizar trocas, grupos e recomendações.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: 'Como prefere ser chamado?', icon: 'person', value: name, setValue: setName, placeholder: 'Seu nome ou apelido leitor' },
          { label: 'Cidade ou região', icon: 'location_on', value: city, setValue: setCity, placeholder: 'São Luís, Centro, Cohama...' },
          { label: 'Area profissional ou momento atual', icon: 'work', value: occupation, setValue: setOccupation, placeholder: 'Estudante, designer, pesquisador...' },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-base font-semibold ml-2">{field.label}</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">{field.icon}</span>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="w-full pl-14 pr-5 py-5 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
                placeholder={field.placeholder}
              />
            </div>
          </div>
        ))}
      </div>
    </section>,
    <section key="interests" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 3</p>
        <h2 className="text-3xl font-extrabold text-text-main">Seu jeito de ler</h2>
        <p className="text-base text-text-muted font-medium">
          Selecione interesses para aproximar sua conta de livros e trocas mais relevantes.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-base font-semibold ml-2">Categorias preferidas</label>
        <div className="flex flex-wrap gap-3">
          {FAVORITE_CATEGORIES.map((category) => (
            <StepChip
              key={category}
              label={category}
              selected={categories.includes(category)}
              onClick={() => toggleSelection(category, categories, setCategories)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-base font-semibold ml-2">Areas profissionais de interesse</label>
        <div className="flex flex-wrap gap-3">
          {PROFESSIONAL_INTERESTS.map((item) => (
            <StepChip
              key={item}
              label={item}
              selected={professionalInterests.includes(item)}
              onClick={() => toggleSelection(item, professionalInterests, setProfessionalInterests)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-base font-semibold ml-2">O que você busca na Nossa Estante?</label>
        <div className="flex flex-wrap gap-3">
          {EXCHANGE_GOALS.map((goal) => (
            <StepChip
              key={goal}
              label={goal}
              selected={goals.includes(goal)}
              onClick={() => toggleSelection(goal, goals, setGoals)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-base font-semibold ml-2">Livro favorito ou leitura marcante</label>
          <textarea
            value={favoriteBook}
            onChange={(e) => setFavoriteBook(e.target.value)}
            className="w-full min-h-[110px] px-5 py-4 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-base text-text-main transition-all resize-none"
            placeholder="Conte pra gente qual livro te marcou..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-base font-semibold ml-2">Quando você costuma ler?</label>
          <input
            type="text"
            value={readingMoment}
            onChange={(e) => setReadingMoment(e.target.value)}
            className="w-full px-5 py-4 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-base text-text-main transition-all"
            placeholder="No onibus, antes de dormir, fim de semana..."
          />
        </div>
      </div>
    </section>,
    <section key="account" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 4</p>
        <h2 className="text-3xl font-extrabold text-text-main">Finalize sua conta</h2>
        <p className="text-base text-text-muted font-medium">
          Falta só definir o acesso que você vai usar para entrar na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: 'E-mail', icon: 'mail', value: email, setValue: setEmail, type: 'email', placeholder: 'nome@exemplo.com' },
          { label: 'Senha', icon: 'lock', value: password, setValue: setPassword, type: 'password', placeholder: 'Minimo de 6 caracteres' },
          { label: 'Confirmar senha', icon: 'verified_user', value: confirmPassword, setValue: setConfirmPassword, type: 'password', placeholder: 'Repita a senha' },
        ].map((field) => (
          <div key={field.label} className="space-y-2">
            <label className="text-base font-semibold ml-2">{field.label}</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">{field.icon}</span>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="w-full pl-14 pr-5 py-5 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
                placeholder={field.placeholder}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-[#F8FAF9] p-5 ring-1 ring-black/5 space-y-3">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">Resumo rapido</p>
        <div className="grid grid-cols-1 gap-2 text-sm font-medium text-text-main">
          <p><span className="font-black">Celular:</span> {phone || 'Nao informado'}</p>
          <p><span className="font-black">Nome:</span> {name || 'Nao informado'}</p>
          <p><span className="font-black">Regiao:</span> {city || 'Nao informado'}</p>
          <p><span className="font-black">Categorias:</span> {categories.length > 0 ? categories.join(', ') : 'Nenhuma selecionada'}</p>
          <p><span className="font-black">Objetivos:</span> {goals.length > 0 ? goals.join(', ') : 'Nenhum selecionado'}</p>
        </div>
      </div>
    </section>,
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Criar conta</p>
        <h2 className="text-4xl font-extrabold text-text-main">Cadastro em etapas para a sua estante</h2>
        <p className="text-text-muted font-medium text-base max-w-2xl mx-auto">
          O cadastro continua multi-step, agora em um fluxo central para você entrar sem sair da página.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {STEP_TITLES.map((title, index) => (
          <div key={title} className="flex items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black transition-all duration-500 ${
              index <= step ? 'bg-primary text-text-main shadow-lg shadow-primary/25' : 'bg-white text-text-muted ring-1 ring-black/5'
            }`}>
              {index + 1}
            </div>
            <span className={`text-xs sm:text-sm font-black uppercase tracking-[0.18em] transition-colors ${
              index === step ? 'text-text-main' : 'text-text-muted'
            }`}>
              {title}
            </span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-[36px] border border-black/5 bg-white shadow-[0_28px_70px_-30px_rgba(20,40,24,0.22)]">
        <div
          className="flex min-h-[520px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${step * 100}%)` }}
        >
          {stepSections.map((section, index) => (
            <div key={index} className="w-full shrink-0 p-6 sm:p-8">
              {section}
            </div>
          ))}
        </div>

        <div className="border-t border-black/5 px-6 py-5 sm:px-8">
          {message && (
            <div className="mb-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
              {message}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setMessage('');
                setStep((current) => Math.max(0, current - 1));
              }}
              disabled={step === 0 || loading}
              className="rounded-2xl px-3 py-3 text-base font-black text-text-muted transition-all hover:text-text-main disabled:opacity-35"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="min-w-[220px] rounded-3xl bg-primary px-8 py-5 text-lg font-extrabold text-text-main shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Finalizando...' : step === STEP_TITLES.length - 1 ? 'Finalizar cadastro' : 'Continuar'}
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-base font-medium text-text-muted">
        Ja faz parte da comunidade?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-text-main font-bold hover:underline">
          Fazer login
        </button>
      </p>
    </div>
  );
};

export default SignupWizard;
