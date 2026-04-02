"use client";

import type { ReactNode } from "react";
import { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Monitor,
  Calendar,
  TrendingDown,
  Send,
  Brain,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import logo from "./assets/logo.png";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const TELEGRAM_URL = "https://t.me/med_gambit_bot";
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const PROBLEMS = [
  {
    Icon: Monitor,
    title: "Cursinho passivo",
    description: "Horas de videoaula que não viram conhecimento retido.",
  },
  {
    Icon: Calendar,
    title: "Sem rotina real",
    description:
      "Você sabe que precisa estudar. Só não consegue manter o ritmo.",
  },
  {
    Icon: TrendingDown,
    title: "Caro sem retorno",
    description: "R$15k/ano em plataformas que não sabem onde você erra.",
  },
];

const STEPS = [
  {
    step: "01",
    Icon: MessageSquare,
    title: "Você define sua prova e rotina",
    description:
      "Especialidade, dias disponíveis e horário preferido. Em 2 minutos.",
  },
  {
    step: "02",
    Icon: Send,
    title: "O bot te manda flashcards todo dia",
    description: "No horário certo, gerados por IA, no seu ritmo.",
  },
  {
    step: "03",
    Icon: Brain,
    title: "A IA aprende onde você erra",
    description: "E prioriza esses temas automaticamente nas próximas sessões.",
  },
];

const FEATURES = [
  "Flashcards gerados por IA baseados em provas reais",
  "Repetição espaçada adaptada ao seu desempenho",
  "Funciona pelo Telegram, sem instalar mais um app",
  "Notificações no horário que você escolher",
  "Relatório semanal de progresso e pontos fracos",
  "Funciona para qualquer especialidade médica",
];

const STATS = [
  { value: 5000, suffix: "+", label: "flashcards gerados\npor semana" },
  { value: 87, suffix: "%", label: "taxa de retenção\ncom revisão ativa" },
  { value: 2, suffix: " min", label: "para começar\na estudar" },
];

const MARQUEE_ITEMS = [
  "Aprovado na USP-SP",
  "UNIFESP 2024",
  "ENARE aprovado",
  "Repetição espaçada",
  "Flashcards por IA",
  "Sem instalar app",
  "100% gratuito",
  "Direto no Telegram",
];

// ─────────────────────────────────────────────
// Primitives
// ─────────────────────────────────────────────

interface MotionChildProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Reveals a single line of text by sliding it up from a clipped area.
 * Each line should be wrapped in its own <RevealLine>.
 */
function RevealLine({ children, delay = 0, className = "" }: MotionChildProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduce = useReducedMotion();

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={shouldReduce ? false : { y: "108%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : undefined}
        transition={{ duration: 0.72, ease: EXPO, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Fades a block up into view when it enters the viewport.
 */
function FadeUp({ children, delay = 0, className = "" }: MotionChildProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? false : { opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, ease: EXPO, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// AnimatedCounter
// ─────────────────────────────────────────────
function AnimatedCounter({ to, suffix = "" }: { to: number; suffix: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (shouldReduce) {
      setValue(to);
      return;
    }
    const startTime = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * to));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, to, shouldReduce]);

  return (
    <span ref={ref}>
      {value.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────
// Marquee
// ─────────────────────────────────────────────
function Marquee() {
  const shouldReduce = useReducedMotion();
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="overflow-hidden border-y border-[#111111]/10 py-4 bg-[#F2F0EB]">
      <motion.div
        className="flex gap-12 w-max"
        animate={shouldReduce ? undefined : { x: ["0%", "-33.333%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em] text-[#111111]/35 flex items-center gap-3"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shrink-0"
              aria-hidden
            />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CTA Button
// ─────────────────────────────────────────────
function CTAButton({ size = "md" }: { size?: "md" | "lg" }) {
  const shouldReduce = useReducedMotion();
  const isLg = size === "lg";

  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block w-full sm:w-auto"
    >
      <motion.button
        className={`relative w-full sm:w-auto bg-[#1DB954] text-white rounded-2xl flex items-center justify-center gap-2 font-semibold cursor-pointer overflow-hidden ${
          isLg
            ? "px-10 sm:px-16 py-5 sm:py-6 text-xl sm:text-2xl"
            : "px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg"
        }`}
        whileHover={
          shouldReduce
            ? undefined
            : {
                scale: 1.03,
                backgroundColor: "#1aa34a",
                boxShadow: isLg
                  ? "0 0 60px rgba(29,185,84,0.45), 0 24px 48px rgba(29,185,84,0.25)"
                  : "0 20px 40px rgba(29,185,84,0.28)",
              }
        }
        whileTap={shouldReduce ? undefined : { scale: 0.97 }}
        transition={{ duration: 0.22 }}
      >
        {/* Shimmer sweep */}
        {!shouldReduce && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 pointer-events-none"
            animate={{ x: ["-200%", "250%"] }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1.5,
            }}
          />
        )}

        <span className="relative z-10">
          {isLg ? "Abrir o medgambit no Telegram" : "Abrir no Telegram"}
        </span>

        <motion.span
          className="relative z-10"
          animate={shouldReduce ? undefined : { x: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className={isLg ? "w-6 h-6 sm:w-7 sm:h-7" : "w-5 h-5"} />
        </motion.span>
      </motion.button>
    </a>
  );
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
export default function App() {
  const shouldReduce = useReducedMotion();

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scrollBar = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Hero parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "18%"]);
  const heroFade = useTransform(heroScroll, [0, 0.75], [1, 0]);

  return (
    <div className="min-h-screen bg-[#F2F0EB] overflow-x-hidden">
      {/* ── Scroll progress ── */}
      {!shouldReduce && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-[#1DB954] origin-left z-50"
          style={{ scaleX: scrollBar }}
          aria-hidden
        />
      )}

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[100svh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-20 sm:pb-28 overflow-hidden"
      >
        {/* Ambient blobs */}
        {!shouldReduce && (
          <>
            <motion.div
              className="absolute top-[18%] right-[-6%] w-64 sm:w-[32rem] h-64 sm:h-[32rem] rounded-full bg-[#1DB954]/[0.07] blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
            <motion.div
              className="absolute bottom-[12%] left-[-6%] w-52 sm:w-80 h-52 sm:h-80 rounded-full bg-[#111111]/[0.04] blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0.45, 0.2] }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
              aria-hidden
            />
          </>
        )}

        <motion.div
          className="max-w-4xl mx-auto relative z-10 w-full"
          style={shouldReduce ? undefined : { y: heroY, opacity: heroFade }}
        >
          {/* Logo */}
          <motion.div
            className="mb-12 sm:mb-16"
            initial={shouldReduce ? false : { opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: EXPO }}
          >
            <img
              src={logo}
              alt="MedGambit"
              className="h-50 sm:h-54 md:h-32 w-auto"
            />
          </motion.div>

          {/* Headline — line-by-line reveal */}
          <div className="mb-6 sm:mb-8 space-y-1">
            {[
              "Seu assistente de",
              "estudos de residência.",
              "Direto no Telegram.",
            ].map((line, i) => (
              <RevealLine key={i} delay={0.06 + i * 0.1}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#111111] leading-[1.04] tracking-tight">
                  {line}
                </h1>
              </RevealLine>
            ))}
          </div>

          {/* Sub */}
          <FadeUp delay={0.45}>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#111111]/80 mb-6 sm:mb-8 max-w-3xl leading-snug">
              Estudo ativo todo dia, sem montar nada. A IA faz o trabalho chato.
            </p>
          </FadeUp>

          {/* Social proof */}
          <FadeUp delay={0.55}>
            <p className="text-sm sm:text-base text-[#111111]/45 mb-10 sm:mb-12 max-w-2xl">
              Baseado no método de quem passou na USP, UNIFESP e ENARE.
            </p>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.65}>
            <CTAButton size="md" />
          </FadeUp>
        </motion.div>

        {/* Scroll indicator */}
        {!shouldReduce && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            aria-hidden
          >
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#111111]/25">
              scroll
            </span>
            <div className="w-px h-8 bg-[#111111]/15 rounded-full overflow-hidden">
              <motion.div
                className="w-full h-4 bg-[#1DB954] rounded-full"
                animate={{ y: [-16, 16] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* ══════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════ */}
      <Marquee />

      {/* ══════════════════════════════════════
          STATS
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#111111]/10">
            {STATS.map((stat, i) => (
              <FadeUp
                key={i}
                delay={0.08 * i}
                className="text-center px-6 py-8 sm:py-4"
              >
                <div className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111111] tabular-nums mb-2 leading-none">
                  <AnimatedCounter to={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-[#111111]/45 leading-relaxed whitespace-pre-line">
                  {stat.label}
                </p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROBLEMA
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <RevealLine className="mb-12 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111]">
              O problema
            </h2>
          </RevealLine>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {PROBLEMS.map(({ Icon, title, description }, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.1}>
                <motion.div
                  className="text-center group"
                  whileHover={shouldReduce ? undefined : { y: -6 }}
                  transition={{ duration: 0.3, ease: EXPO }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-[#F2F0EB] flex items-center justify-center mb-6 mx-auto"
                    whileHover={
                      shouldReduce
                        ? undefined
                        : { scale: 1.1, backgroundColor: "#111111" }
                    }
                    transition={{ duration: 0.25 }}
                  >
                    <Icon className="w-7 h-7 text-[#111111] group-hover:text-white transition-colors duration-[250ms]" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111111] mb-3">
                    {title}
                  </h3>
                  <p className="text-[#111111]/70 text-base sm:text-lg leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMO FUNCIONA
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <RevealLine className="mb-12 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111]">
              Como funciona
            </h2>
          </RevealLine>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {STEPS.map(({ step, Icon, title, description }, i) => (
              <FadeUp key={i} delay={0.1 + i * 0.12}>
                <motion.div
                  className="relative bg-white rounded-3xl p-8 sm:p-10 shadow-sm overflow-hidden"
                  whileHover={
                    shouldReduce
                      ? undefined
                      : { y: -8, boxShadow: "0 28px 56px rgba(0,0,0,0.08)" }
                  }
                  transition={{ duration: 0.35, ease: EXPO }}
                >
                  {/* Ghost step number */}
                  <span
                    className="absolute -top-3 -right-1 text-8xl font-black text-[#111111]/[0.05] select-none pointer-events-none leading-none"
                    aria-hidden
                  >
                    {step}
                  </span>

                  <motion.div
                    className="bg-[#1DB954] text-white rounded-full w-12 h-12 flex items-center justify-center mb-6 shrink-0"
                    whileHover={
                      shouldReduce ? undefined : { scale: 1.08, rotate: 6 }
                    }
                    transition={{ duration: 0.25 }}
                  >
                    <Icon className="w-5 h-5" aria-hidden />
                  </motion.div>

                  <h3 className="text-xl sm:text-2xl font-black text-[#111111] mb-4">
                    {title}
                  </h3>
                  <p className="text-[#111111]/70 text-base sm:text-lg leading-relaxed">
                    {description}
                  </p>

                  {/* Slide-in accent underline on hover */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-[#1DB954]"
                    initial={{ width: 0 }}
                    whileHover={shouldReduce ? undefined : { width: "100%" }}
                    transition={{ duration: 0.4, ease: EXPO }}
                    aria-hidden
                  />
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIAL
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <FadeUp>
            <motion.div
              className="text-7xl sm:text-8xl md:text-9xl font-black text-[#1DB954] leading-none mb-4 select-none"
              animate={shouldReduce ? undefined : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              "
            </motion.div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p className="text-2xl sm:text-3xl md:text-4xl text-[#111111] mb-8 leading-relaxed font-medium">
              Qualidade é muito superior à quantidade de questões. O mais
              importante é revisar diariamente com flashcards.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className="text-base sm:text-lg font-black text-[#111111]">
              — Médico R2, aprovado na USP-SP
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] leading-tight">
              Tudo que você precisa.
              <br />
              <span className="text-[#1DB954]">Nada que você não precisa.</span>
            </h2>
          </FadeUp>

          <div>
            {FEATURES.map((feature, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <motion.div
                  className="flex items-center gap-4 py-4 sm:py-5 border-b border-[#111111]/10 last:border-0 cursor-default"
                  whileHover={shouldReduce ? undefined : { x: 10 }}
                  transition={{ duration: 0.22, ease: EXPO }}
                >
                  <motion.span
                    whileHover={
                      shouldReduce ? undefined : { scale: 1.2, rotate: 8 }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle2
                      className="w-6 h-6 text-[#1DB954] shrink-0"
                      aria-hidden
                    />
                  </motion.span>
                  <span className="text-base sm:text-lg text-[#111111] font-medium">
                    {feature}
                  </span>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-36 bg-[#111111] relative overflow-hidden">
        {/* Drifting radial glow */}
        {!shouldReduce && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                "radial-gradient(ellipse at 20% 60%, rgba(29,185,84,0.13) 0%, transparent 55%)",
                "radial-gradient(ellipse at 80% 40%, rgba(29,185,84,0.13) 0%, transparent 55%)",
                "radial-gradient(ellipse at 50% 80%, rgba(29,185,84,0.13) 0%, transparent 55%)",
                "radial-gradient(ellipse at 20% 60%, rgba(29,185,84,0.13) 0%, transparent 55%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
        )}

        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="space-y-1 mb-6 sm:mb-8">
            <RevealLine>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.04] tracking-tight">
                Comece hoje.
              </h2>
            </RevealLine>
            <RevealLine delay={0.08}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#1DB954] leading-[1.04] tracking-tight">
                É grátis.
              </h2>
            </RevealLine>
          </div>

          <FadeUp delay={0.2}>
            <p className="text-lg sm:text-xl md:text-2xl text-white/80 mb-2">
              Sem cadastro. Sem app. Só abre o Telegram.
            </p>
          </FadeUp>

          <FadeUp delay={0.28}>
            <p className="text-sm sm:text-base text-white/35 mb-12 sm:mb-16">
              Em breve no WhatsApp.
            </p>
          </FadeUp>

          <FadeUp delay={0.36}>
            <div className="flex justify-center">
              <CTAButton size="lg" />
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
