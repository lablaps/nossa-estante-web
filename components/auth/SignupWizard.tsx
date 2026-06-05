import React, { useState } from 'react';
import { authService } from '../../services/authService';

const STEP_TITLES = ['Dados', 'Vinculo', 'Conta'];

const PROFESSIONS = [
  'Estudante',
  'Administrador',
  'Advogado',
  'Analista Administrativo',
  'Analista Comercial',
  'Analista Contabil',
  'Analista de Dados',
  'Analista de Marketing',
  'Analista de Recursos Humanos',
  'Analista de Sistemas',
  'Arquiteto',
  'Assistente Administrativo',
  'Assistente Social',
  'Atendente',
  'Auditor',
  'Bibliotecario',
  'Biologo',
  'Contador',
  'Coordenador',
  'Dentista',
  'Designer',
  'Designer Grafico',
  'Desenvolvedor Backend',
  'Desenvolvedor Frontend',
  'Desenvolvedor Full Stack',
  'Economista',
  'Educador Fisico',
  'Eletricista',
  'Enfermeiro',
  'Engenheiro Civil',
  'Engenheiro de Software',
  'Engenheiro Eletrico',
  'Engenheiro Mecanico',
  'Farmaceutico',
  'Fisioterapeuta',
  'Fotografo',
  'Gerente',
  'Jornalista',
  'Medico',
  'Motorista',
  'Nutricionista',
  'Pedagogo',
  'Professor',
  'Psicologo',
  'Publicitario',
  'Recepcionista',
  'Tecnico Administrativo',
  'Tecnico de Enfermagem',
  'Tecnico em Informatica',
  'Vendedor',
  'Veterinario',
  'Outro'
];

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

type SignupWizardProps = {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
};

type FormData = {
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  profession: string;
  linkedInstitution: string;
  course: string;
  semester: string;
  position: string;
  organization: string;
  department: string;
  roleDescription: string;
  password: string;
  passwordConfirmation: string;
};

const initialForm: FormData = {
  name: '',
  cpf: '',
  birthDate: '',
  phone: '',
  email: '',
  profession: '',
  linkedInstitution: '',
  course: '',
  semester: '',
  position: '',
  organization: '',
  department: '',
  roleDescription: '',
  password: '',
  passwordConfirmation: ''
};

const cleanDigits = (value: string) => value.replace(/\D/g, '');

const formatCPF = (value: string) => {
  const digits = cleanDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const formatPhone = (value: string) => {
  const digits = cleanDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const IconField: React.FC<{
  label: string;
  icon: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}> = ({ label, icon, value, onChange, type = 'text', placeholder, maxLength }) => (
  <div className="space-y-2">
    <label className="text-base font-semibold ml-2">{label}</label>
    <div className="relative flex items-center">
      <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">{icon}</span>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        className="w-full pl-14 pr-5 py-5 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
        placeholder={placeholder}
      />
    </div>
  </div>
);

const ProfessionField: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const filteredProfessions = PROFESSIONS
    .filter((profession) => profession.toLowerCase().includes(value.trim().toLowerCase()))
    .slice(0, 12);

  return (
    <div className="space-y-2">
      <label className="text-base font-semibold ml-2">Profissao</label>
      <div className="relative">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">work</span>
          <input
            type="search"
            value={value}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              onChange(event.target.value);
              setOpen(true);
            }}
            className="w-full pl-14 pr-14 py-5 rounded-3xl border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
            placeholder="Pesquise ou digite sua profissao"
          />
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="absolute right-4 flex size-8 items-center justify-center rounded-full text-text-muted hover:bg-black/5"
          >
            <span className="material-symbols-outlined">expand_more</span>
          </button>
        </div>

        {open && (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-72 overflow-y-auto rounded-3xl border border-black/5 bg-white p-2 shadow-2xl shadow-black/15">
            {(filteredProfessions.length > 0 ? filteredProfessions : ['Outro']).map((profession) => (
              <button
                key={profession}
                type="button"
                onClick={() => {
                  onChange(profession);
                  setOpen(false);
                }}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-bold text-text-main transition-all hover:bg-primary/15"
              >
                {profession}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
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

const SignupWizard: React.FC<SignupWizardProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const isStudent = form.profession.trim().toLowerCase() === 'estudante';

  const update = (field: keyof FormData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const stepErrors = () => {
    const errors: string[] = [];

    if (step === 0) {
      if (!form.name.trim()) errors.push('Nome completo e obrigatorio.');
      if (cleanDigits(form.cpf).length !== 11) errors.push('CPF deve ter 11 digitos.');
      if (!form.birthDate) errors.push('Data de nascimento e obrigatoria.');
      if (cleanDigits(form.phone).length < 10) errors.push('Telefone invalido.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.push('E-mail invalido.');
    }

    if (step === 1) {
      if (!form.profession.trim()) errors.push('Profissao e obrigatoria.');
      if (!form.linkedInstitution.trim()) errors.push('Instituicao vinculada e obrigatoria.');

      if (isStudent) {
        if (!form.course.trim()) errors.push('Curso e obrigatorio.');
        if (!form.semester.trim()) errors.push('Periodo/semestre e obrigatorio.');
      } else {
        if (!form.position.trim()) errors.push('Cargo e obrigatorio.');
        if (!form.organization.trim()) errors.push('Instituicao/empresa/orgao e obrigatoria.');
        if (!form.department.trim()) errors.push('Setor/departamento e obrigatorio.');
        if (!form.roleDescription.trim()) errors.push('Funcao exercida e obrigatoria.');
      }
    }

    if (step === 2) {
      if (!form.password) errors.push('Senha e obrigatoria.');
      if (!form.passwordConfirmation) errors.push('Confirmacao de senha e obrigatoria.');
      if (form.password && form.password.length < 6) errors.push('Senha deve ter ao menos 6 caracteres.');
      if (form.password !== form.passwordConfirmation) errors.push('Senha e confirmacao devem ser iguais.');
    }

    return errors;
  };

  const handleNext = async () => {
    const errors = stepErrors();
    if (errors.length > 0) {
      setMessage(errors.join(' '));
      return;
    }

    setMessage('');
    if (step < STEP_TITLES.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setLoading(true);
    try {
      const basePayload = {
        name: form.name.trim(),
        cpf: cleanDigits(form.cpf),
        birthDate: form.birthDate,
        phone: cleanDigits(form.phone),
        email: form.email.trim().toLowerCase(),
        profession: form.profession.trim(),
        linkedInstitution: form.linkedInstitution.trim(),
        password_raw: form.password,
        passwordConfirmation: form.passwordConfirmation,
        role: 'REGULAR'
      };

      const profilePayload = isStudent
        ? {
            course: form.course.trim(),
            semester: form.semester.trim()
          }
        : {
            position: form.position.trim(),
            organization: form.organization.trim(),
            department: form.department.trim(),
            roleDescription: form.roleDescription.trim()
          };

      const result = await authService.signup({ ...basePayload, ...profilePayload });
      if (result) onSuccess();
    } catch (error: any) {
      if (error.response?.status === 409) {
        setMessage('Ja existe uma conta com este e-mail.');
      } else {
        setMessage(error?.response?.data?.message || error?.response?.data?.title || 'Nao foi possivel concluir o cadastro agora. Tente novamente em instantes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const stepSections = [
    <section key="personal" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 1</p>
        <h2 className="text-3xl font-extrabold text-text-main">Seus dados pessoais</h2>
        <p className="text-base text-text-muted font-medium">
          Informe os dados principais para criar sua conta na Nossa Estante.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <IconField label="Nome completo" icon="person" value={form.name} onChange={(value) => update('name', value)} placeholder="Seu nome completo" />
        <IconField label="CPF" icon="badge" value={form.cpf} onChange={(value) => update('cpf', formatCPF(value))} placeholder="000.000.000-00" maxLength={14} />
        <IconField label="Data de nascimento" icon="calendar_month" type="date" value={form.birthDate} onChange={(value) => update('birthDate', value)} />
        <IconField label="Telefone" icon="smartphone" value={form.phone} onChange={(value) => update('phone', formatPhone(value))} placeholder="(11) 99999-9999" maxLength={15} />
        <IconField label="E-mail" icon="mail" type="email" value={form.email} onChange={(value) => update('email', value)} placeholder="nome@exemplo.com" />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {SOCIAL_BUTTONS.map((button) => (
          <SocialButton key={button.label} label={button.label} className={button.className} icon={button.icon} />
        ))}
      </div>
    </section>,
    <section key="link" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 2</p>
        <h2 className="text-3xl font-extrabold text-text-main">Seu vinculo</h2>
        <p className="text-base text-text-muted font-medium">
          A profissao selecionada define quais campos precisam ser preenchidos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <ProfessionField value={form.profession} onChange={(value) => update('profession', value)} />
        <IconField label="Instituicao vinculada" icon="apartment" value={form.linkedInstitution} onChange={(value) => update('linkedInstitution', value)} placeholder="Universidade, empresa ou orgao" />

        {isStudent ? (
          <>
            <IconField label="Curso" icon="menu_book" value={form.course} onChange={(value) => update('course', value)} placeholder="Direito" />
            <IconField label="Periodo/semestre" icon="history_edu" value={form.semester} onChange={(value) => update('semester', value)} placeholder="5" />
          </>
        ) : (
          <>
            <IconField label="Cargo" icon="assignment_ind" value={form.position} onChange={(value) => update('position', value)} placeholder="Analista Juridico" />
            <IconField label="Instituicao/empresa/orgao" icon="business" value={form.organization} onChange={(value) => update('organization', value)} placeholder="Escritorio XPTO" />
            <IconField label="Setor/departamento" icon="groups" value={form.department} onChange={(value) => update('department', value)} placeholder="Juridico" />
            <IconField label="Funcao exercida" icon="description" value={form.roleDescription} onChange={(value) => update('roleDescription', value)} placeholder="Atendimento e analise processual" />
          </>
        )}
      </div>
    </section>,
    <section key="account" className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Etapa 3</p>
        <h2 className="text-3xl font-extrabold text-text-main">Finalize sua conta</h2>
        <p className="text-base text-text-muted font-medium">
          Falta so definir o acesso que voce vai usar para entrar na plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <IconField label="Senha" icon="lock" type="password" value={form.password} onChange={(value) => update('password', value)} placeholder="Minimo de 6 caracteres" />
        <IconField label="Confirmar senha" icon="verified_user" type="password" value={form.passwordConfirmation} onChange={(value) => update('passwordConfirmation', value)} placeholder="Repita a senha" />
      </div>

      <div className="rounded-[28px] bg-[#F8FAF9] p-5 ring-1 ring-black/5 space-y-3">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-text-muted">Resumo rapido</p>
        <div className="grid grid-cols-1 gap-2 text-sm font-medium text-text-main">
          <p><span className="font-black">Nome:</span> {form.name || 'Nao informado'}</p>
          <p><span className="font-black">E-mail:</span> {form.email || 'Nao informado'}</p>
          <p><span className="font-black">Profissao:</span> {form.profession || 'Nao informado'}</p>
          <p><span className="font-black">Instituicao:</span> {form.linkedInstitution || 'Nao informado'}</p>
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
          Preencha apenas os dados que combinam com seu vinculo.
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
