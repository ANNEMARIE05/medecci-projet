import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Calendar, 
  ArrowRight, 
  BookOpen, 
  Quote, 
  Clock, 
  MapPin, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Volume2, 
  Radio
} from 'lucide-react';
import { VERSETS_BIBLIQUES, PROGRAMMES_CULTES } from '../../constants';
import { PHOTOS } from '../../constants/photos';
import evenementService from '../../services/evenementService';
import actualiteService from '../../services/actualiteService';
import type { Evenement, Actualite } from '../../types/models';
import { formaterDate } from '../../utils/formateur';

export const Accueil: React.FC = () => {
  const [verset, setVerset] = useState(VERSETS_BIBLIQUES[0]);
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [actualites, setActualites] = useState<Actualite[]>([]);

  useEffect(() => {
    evenementService.recupererEvenements().then(setEvenements).catch(console.error);
    actualiteService.recupererActualites().then(setActualites).catch(console.error);
  }, []);

  // Utiliser les vraies photos pour le slider
  // Si PHOTOS est vide, utiliser des fallbacks
  const getPhoto = (index: number, fallback: string) => {
    return PHOTOS && PHOTOS.length > index ? PHOTOS[index] : fallback;
  };

  const slides = [
    {
      id: 1,
      image: '/prophete_assande.png',
      badge: 'MOT D\'ORDRE 2026',
      title: '« Moi, je choisis la bonne Part »',
      verset: 'Luc 10 V 42',
      description: 'L\'orientation spirituelle et prophétique de notre mission décryptée par notre Président, le Prophète ASSANDE Jacques.',
      btnText: 'Lire l\'enseignement complet',
      btnLink: '/blog'
    },
    {
      id: 2,
      image: getPhoto(12, 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=1920'),
      badge: 'BIENVENUE À LA MEDEC-CI',
      title: 'Une Mission pour adorer Dieu en Esprit et en Vérité',
      description: 'Un lieu de foi, de restauration spirituelle et de communion fraternelle pour toute la communauté chrétienne.',
      btnText: 'Nos programmes de cultes',
      btnLink: '/programmes'
    },
    {
      id: 3,
      image: '/epouse_assande.png',
      badge: 'CONVENTION FEMMES DE VALEUR',
      title: 'Bâtir sa Vie et son Foyer sur le Rocher',
      description: 'Découvrez les activités de la Direction Nationale des Femmes dirigée par l\'Apôtre Christine ASSANDE.',
      btnText: 'Qui sommes-nous ?',
      btnLink: '/a-propos'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [directionSlide, setDirectionSlide] = useState<'next' | 'prev'>('next');

  // État pour le lecteur audio
  const [sermonActif, setSermonActif] = useState<{ titre: string; pasteur: string; url: string } | null>(null);
  const [enLecture, setEnLecture] = useState(false);
  const [progresAudio, setProgresAudio] = useState(35);

  // État pour le compte à rebours
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const index = Math.floor(Math.random() * VERSETS_BIBLIQUES.length);
    setVerset(VERSETS_BIBLIQUES[index]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const prochain = (currentSlide + 1) % slides.length;
      changerSlideAvecAnimation(prochain, 'next');
    }, 8000);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  // Compte à rebours vers le prochain culte du dimanche à 08h30
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextSunday = new Date();
      nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
      nextSunday.setHours(8, 30, 0, 0);
      if (nextSunday <= now) {
        nextSunday.setDate(nextSunday.getDate() + 7);
      }
      const difference = nextSunday.getTime() - now.getTime();
      
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simuler le progrès de l'audio quand il joue
  useEffect(() => {
    let interval: any;
    if (enLecture) {
      interval = setInterval(() => {
        setProgresAudio((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [enLecture]);

  useEffect(() => {
    // Entrance animation: slide in from opposite direction
    const entryX = directionSlide === 'next' ? 100 : -100;

    gsap.set('.hero-badge', { opacity: 0, x: entryX, y: 0 });
    gsap.set('.hero-title', { opacity: 0, x: entryX * 1.2, y: 0, scale: 0.96 });
    gsap.set('.hero-verset', { opacity: 0, x: entryX, y: 0, scale: 0.8 });
    gsap.set('.hero-description', { opacity: 0, x: entryX * 1.1, y: 0 });
    gsap.set('.hero-buttons', { opacity: 0, x: entryX, y: 0 });

    const tlIn = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    tlIn.to('.hero-badge', { opacity: 1, x: 0, duration: 0.65 })
        .to('.hero-title', { opacity: 1, x: 0, scale: 1, duration: 0.8 }, '-=0.45')
        .to('.hero-verset', { opacity: 1, x: 0, scale: 1, duration: 0.65, ease: 'back.out(1.5)' }, '-=0.6')
        .to('.hero-description', { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
        .to('.hero-buttons', { opacity: 1, x: 0, duration: 0.65 }, '-=0.55');
  }, [currentSlide]);


  const changerSlideAvecAnimation = (prochainIndex: number, direction: 'next' | 'prev' = 'next') => {
    // Determine exit direction
    const moveX = direction === 'next' ? -100 : 100;

    const tlOut = gsap.timeline({
      onComplete: () => {
        setDirectionSlide(direction);
        setCurrentSlide(prochainIndex);
      }
    });

    tlOut.to('.hero-badge', { opacity: 0, x: moveX, duration: 0.25, ease: 'power2.in' })
         .to('.hero-title', { opacity: 0, x: moveX * 1.2, scale: 0.98, duration: 0.3, ease: 'power2.in' }, '-=0.15')
         .to('.hero-verset', { opacity: 0, x: moveX, scale: 0.9, duration: 0.25, ease: 'power2.in' }, '-=0.25')
         .to('.hero-description', { opacity: 0, x: moveX * 1.1, duration: 0.3, ease: 'power2.in' }, '-=0.25')
         .to('.hero-buttons', { opacity: 0, x: moveX, duration: 0.25, ease: 'power2.in' }, '-=0.25');
  };

  const prevSlide = () => {
    const prochain = (currentSlide - 1 + slides.length) % slides.length;
    changerSlideAvecAnimation(prochain, 'prev');
  };

  const nextSlide = () => {
    const prochain = (currentSlide + 1) % slides.length;
    changerSlideAvecAnimation(prochain, 'next');
  };

  const jouerSermon = (titre: string, pasteur: string) => {
    setSermonActif({ titre, pasteur, url: '#' });
    setEnLecture(true);
    setProgresAudio(0);
  };

  const prochainsEvs = evenements.slice(0, 2);
  const dernieresActus = actualites.slice(0, 3);

  // Liste des sermons du jour
  const sermonsDuJour = [
    {
      titre: "Marcher dans la fidélité en temps de crise",
      pasteur: "Prophète ASSANDE Jacques",
      date: "28 Juin 2026",
      image: getPhoto(4, 'https://images.unsplash.com/photo-1544717277-994b96273b24?auto=format&fit=crop&q=80&w=600'),
      duree: "45:12"
    },
    {
      titre: "La puissance d'une prière fervente et persévérante",
      pasteur: "Apôtre Christine ASSANDE",
      date: "21 Juin 2026",
      image: getPhoto(7, 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&q=80&w=600'),
      duree: "38:50"
    },
    {
      titre: "Bâtir des fondations spirituelles inébranlables",
      pasteur: "Pasteur MORIBA Komon Joseph",
      date: "14 Juin 2026",
      image: getPhoto(25, 'https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&q=80&w=600'),
      duree: "52:10"
    }
  ];

  return (
    <div className="bg-[#F8FAFC] space-y-12 sm:space-y-20 pb-12 sm:pb-20 overflow-x-hidden font-outfit">
      
      {/* 1. HERO BANNER SLIDER AVEC EFFET KEN BURNS */}
      <section className="relative min-h-[75vh] md:min-h-[92vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden py-12 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Image avec animation de zoom (Ken Burns) */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: 8, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
              style={{
                backgroundImage: `url('${slides[currentSlide].image}')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
          </motion.div>
        </AnimatePresence>

        {/* Lueurs d'ambiance colorées */}
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-medecci-bleuRoyal/25 blur-3xl pointer-events-none glow-bleu" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-medecci-or/15 blur-3xl pointer-events-none glow-or" />

        {/* Contenu textuel */}
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 space-y-8 z-10">
          <div key={currentSlide} className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-md hero-badge opacity-0">
              <span className="h-2 w-2 rounded-full bg-medecci-or animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-medecci-or">
                {slides[currentSlide].badge}
              </span>
            </div>

            <h1 className="font-cormorant italic font-bold text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-tight text-white tracking-tight hero-title opacity-0">
              {slides[currentSlide].title.includes('Moi, je choisis') ? (
                <>
                  Moi, je choisis la<br />
                  <span className="font-poppins not-italic font-black text-transparent bg-clip-text bg-gradient-to-r from-medecci-bleuClair via-medecci-bleuRoyal to-medecci-or">
                    bonne Part
                  </span>
                </>
              ) : slides[currentSlide].title.includes('adorer Dieu') ? (
                <>
                  Adorer Dieu en<br />
                  <span className="font-poppins not-italic font-black text-transparent bg-clip-text bg-gradient-to-r from-medecci-bleuRoyal via-medecci-bleuClair to-medecci-or">
                    Esprit et en Vérité
                  </span>
                </>
              ) : (
                <span className="font-poppins not-italic font-black">{slides[currentSlide].title}</span>
              )}
            </h1>

            {slides[currentSlide].verset && (
              <p className="font-cormorant italic text-2xl sm:text-3xl text-medecci-or -mt-3 hero-verset opacity-0">
                — {slides[currentSlide].verset} —
              </p>
            )}

            <p className="text-sm sm:text-lg text-slate-350 max-w-3xl mx-auto font-light leading-relaxed hero-description opacity-0">
              {slides[currentSlide].description}
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 hero-buttons opacity-0">
              <Link
                href={slides[currentSlide].btnLink}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair hover:from-amber-500 hover:to-medecci-or text-slate-950 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm font-bold shadow-lg transition-colors duration-300"
              >
                <span>{slides[currentSlide].btnText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dons"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm font-bold backdrop-blur-sm transition-colors duration-300"
              >
                <Heart className="h-4 w-4 text-medecci-or fill-medecci-or" />
                <span>Soutenir la Mission</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Flèches de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/20 transition-all z-20 group hidden sm:block focus:outline-none"
        >
          <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/15 hover:border-white/20 transition-all z-20 group hidden sm:block focus:outline-none"
        >
          <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (i === currentSlide) return;
                const direction = i > currentSlide ? 'next' : 'prev';
                changerSlideAvecAnimation(i, direction);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-8 bg-medecci-or' : 'w-2.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. SECTION PROCHAIN EVENEMENT AVEC COMPTE A REBOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl border border-[#E2E8F0] shadow-premium p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-8"
        >
          {/* Label de l'événement */}
          <div className="space-y-4 text-center lg:text-left lg:max-w-md">
            <div className="inline-flex items-center space-x-2 bg-medecci-bleuClair/10 text-medecci-bleuClair px-3 py-1 rounded-full text-xs font-semibold uppercase">
              <Radio className="h-3.5 w-3.5 animate-pulse text-medecci-bleuClair" />
              <span>Prochain Culte Dominical</span>
            </div>
            <h2 className="font-poppins text-2xl sm:text-3xl font-black text-[#0B3C91] leading-tight">
              Culte d'Adoration, de Louange et de Parole
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Rejoignez-nous en présentiel à notre temple principal de Koumassi pour un moment d'adoration exceptionnel.
            </p>
          </div>

          {/* Grille du Compte à Rebours */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
            {[
              { label: 'J', value: timeLeft.days },
              { label: 'H', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Sec', value: timeLeft.seconds }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shadow-sm">
                  <span className="font-poppins font-bold text-xl sm:text-4xl text-[#0B3C91]">
                    {String(item.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="shrink-0 w-full lg:w-auto text-center">
            <Link
              href="/programmes"
              className="inline-flex items-center justify-center space-x-2 bg-[#0B3C91] hover:bg-[#1E88E5] text-white px-7 py-3.5 rounded-xl font-bold shadow-md transition-colors w-full sm:w-auto"
            >
              <span>Tous les cultes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 3. VERSET BIBLIQUE DU JOUR */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-premium border border-[#E2E8F0] text-center"
        >
          {/* Logo d'arrière-plan en filigrane */}
          <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-[#0B3C91] pointer-events-none">
            <Quote className="h-64 w-64" />
          </div>

          <div className="relative space-y-6">
            <div className="flex justify-center">
              <span className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] text-medecci-or rounded-full shadow-inner">
                <BookOpen className="h-6 w-6" />
              </span>
            </div>
            <h3 className="font-poppins font-black text-xs tracking-widest uppercase text-slate-400">
              Parole de Grâce du Jour
            </h3>
            <blockquote className="font-cormorant italic text-3xl sm:text-4xl text-[#0B3C91] leading-relaxed font-bold">
              "{verset.texte}"
            </blockquote>
            <cite className="block font-poppins font-bold text-medecci-or not-italic text-xs tracking-wider uppercase">
              — {verset.reference}
            </cite>
          </div>
        </motion.div>
      </section>

      {/* 4. PRÉSENTATION FONDATRICE & HISTORIQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Texte de gauche */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center space-x-2 bg-[#0B3C91]/10 text-[#0B3C91] px-3.5 py-1.5 rounded-full border border-[#0B3C91]/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B3C91]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                À Propos de la MEDECCI
              </span>
            </div>
            <h2 className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B3C91] leading-tight">
              Bâtir des vies par la foi pure et l'évangélisation prophétique
            </h2>
            <p className="text-slate-655 leading-relaxed text-sm sm:text-base font-light">
              La Mission Évangélique de Dieu en Christ en Côte d'Ivoire (MEDECCI) is a church community focused on revival and spiritual transformation. Founded on Christian love and deep study of the Bible, our mission is to restore lives and families and spread the pure gospel of Jesus-Christ.
            </p>
            <p className="text-slate-655 leading-relaxed text-sm sm:text-base font-light">
              Under the spiritual leadership of Prophet ASSANDE Jacques and Apostle Christine ASSANDE, MEDECCI runs several departments including JMEDECCI for youth and the National Women Association, along with social relief efforts.
            </p>
            <div className="pt-4">
              <Link
                href="/a-propos"
                className="inline-flex items-center space-x-2 text-[#1E88E5] font-bold hover:text-[#0B3C91] transition-colors group"
              >
                <span>Découvrir notre histoire & nos croyances</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Image de droite */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -top-6 -left-6 w-80 h-80 bg-blue-100 rounded-3xl blur-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-80 h-80 bg-amber-100 rounded-3xl blur-3xl -z-10" />
            <div className="overflow-hidden rounded-3xl border border-[#E2E8F0] shadow-premium bg-white p-4">
              <img
                src={getPhoto(19, 'https://images.unsplash.com/photo-1548625361-155deee223cb?auto=format&fit=crop&q=80&w=800')}
                alt="Assemblée chrétienne MEDECCI"
                className="w-full h-[280px] sm:h-[380px] lg:h-[450px] object-cover rounded-2xl transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. CULTES DE LA SEMAINE & PROCHAINS RENDEZ-VOUS */}
      <section className="bg-white border-y border-[#E2E8F0] py-12 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-medecci-or/10 text-medecci-or px-3.5 py-1.5 rounded-full border border-medecci-or/10">
              <span className="h-1.5 w-1.5 rounded-full bg-medecci-or" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Notre Calendrier
              </span>
            </div>
            <h2 className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B3C91]">
              Cultes & Événements à Venir
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-light">
              Participez activement à nos cultes réguliers pour vous nourrir spirituellement de la parole de Dieu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            
            {/* CULTES DE LA SEMAINE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#F8FAFC] rounded-3xl p-5 sm:p-8 border border-[#E2E8F0] flex flex-col justify-between"
            >
              <div className="space-y-6">
                <h3 className="font-poppins text-xl font-black text-[#0B3C91] border-b border-[#E2E8F0] pb-4">
                  Cultes Hebdomadaires
                </h3>
                <div className="space-y-6">
                  {PROGRAMMES_CULTES.slice(0, 3).map((culte) => (
                    <div key={culte.id} className="flex items-start space-x-4">
                      <div className="p-3 bg-[#0B3C91]/5 text-[#0B3C91] rounded-xl shrink-0 border border-[#0B3C91]/5">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-800 text-sm">{culte.titre}</h4>
                        <p className="text-xs text-medecci-or font-bold uppercase tracking-wider">{culte.jour} — {culte.horaire}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 border-t border-[#E2E8F0] mt-8">
                <Link
                  href="/programmes"
                  className="flex items-center justify-between text-[#0B3C91] hover:text-[#1E88E5] font-bold text-sm"
                >
                  <span>Consulter tous les horaires</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>

            {/* ÉVÉNEMENTS DU CALENDRIER (2 Cartes) */}
            {prochainsEvs.map((ev, index) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (index + 1) * 0.15 }}
                className="bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="relative h-56 w-full overflow-hidden">
                    <img 
                      src={ev.image || getPhoto(10 + index * 5, '')} 
                      alt={ev.titre} 
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    />
                    <span className="absolute top-4 left-4 bg-[#0B3C91] text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border border-white/10">
                      {ev.categorie}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-poppins text-lg font-bold text-slate-850 group-hover:text-[#1E88E5] transition-colors leading-snug">
                      {ev.titre}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-light">
                      {ev.description}
                    </p>
                    <div className="space-y-2 pt-2 text-slate-500 text-xs font-semibold">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-medecci-or shrink-0" />
                        <span>Le {formaterDate(ev.dateDebut, true)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-medecci-or shrink-0" />
                        <span className="truncate">{ev.lieu}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100">
                  <Link
                    href="/contact"
                    className="flex items-center justify-between text-[#0B3C91] hover:text-[#1E88E5] font-bold text-sm"
                  >
                    <span>S'informer / S'inscrire</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECTION LECTEUR DE SERMONS DU JOUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-medecci-or/10 text-medecci-or px-3.5 py-1.5 rounded-full border border-medecci-or/10">
            <span className="h-1.5 w-1.5 rounded-full bg-medecci-or" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Enseignements récents
            </span>
          </div>
          <h2 className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B3C91]">
            Prédications à Écouter
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light">
            Écoutez les messages inspirants de nos pasteurs et grandissez spirituellement chaque jour.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {sermonsDuJour.map((sermon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-5 space-y-4 hover:border-medecci-or/40 transition-colors shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-44 rounded-2xl overflow-hidden group">
                  <img src={sermon.image} alt={sermon.titre} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => jouerSermon(sermon.titre, sermon.pasteur)}
                      className="p-4 bg-white text-[#0B3C91] rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                      <Play className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {sermon.duree}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sermon.date}</span>
                  <h4 className="font-poppins font-bold text-slate-800 text-sm sm:text-base leading-snug line-clamp-2">
                    {sermon.titre}
                  </h4>
                  <p className="text-xs text-medecci-or font-bold uppercase tracking-wider">{sermon.pasteur}</p>
                </div>
              </div>
              <button
                onClick={() => jouerSermon(sermon.titre, sermon.pasteur)}
                className="w-full py-3 border border-[#E2E8F0] hover:border-medecci-or hover:bg-medecci-or/5 text-slate-700 hover:text-medecci-or rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Écouter le message</span>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 7. TRACKER DE DONS - CONSTRUCTION DU TEMPLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl p-5 sm:p-8 lg:p-12 border border-[#E2E8F0] shadow-premium grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center"
        >
          {/* Texte explicatif */}
          <div className="space-y-5">
            <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-600 px-3.5 py-1.5 rounded-full border border-amber-100 text-xs font-semibold uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              <span>Projet Construction 2026</span>
            </div>
            <h3 className="font-poppins text-xl sm:text-3xl lg:text-4xl font-black text-[#0B3C91] leading-tight">
              Bâtissons Ensemble la Maison du Seigneur
            </h3>
            <p className="text-slate-655 text-xs sm:text-sm font-light leading-relaxed">
              Nous avons initié le projet d'agrandissement et de rénovation de notre temple principal pour offrir un meilleur cadre d'adoration et accueillir les fidèles de plus en plus nombreux. Votre générosité propulsera cette œuvre divine.
            </p>
            <div className="pt-2">
              <Link
                href="/dons"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair text-white px-6 py-3.5 rounded-xl text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
              >
                <Heart className="h-4 w-4 fill-white" />
                <span>Participer au Projet</span>
              </Link>
            </div>
          </div>

          {/* Jauge d'impact */}
          <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] space-y-6">
            <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
              <span className="text-slate-550 uppercase tracking-wider">Montant Récolté</span>
              <span className="text-[#0B3C91]">18 450 000 FCFA / 30 000 000 FCFA</span>
            </div>

            {/* Barre de progression animée */}
            <div className="h-4 bg-slate-200/60 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '61.5%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-medecci-bleuRoyal to-medecci-bleuClair rounded-full"
              />
            </div>

            <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
              <span>Objectif : 61.5% Atteint</span>
              <span>115 Donateurs engagés</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 8. LATEST ARTICLES & BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 bg-[#0B3C91]/10 text-[#0B3C91] px-3.5 py-1.5 rounded-full border border-[#0B3C91]/10">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0B3C91]" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Actualités & Annonces
              </span>
            </div>
            <h2 className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-black text-[#0B3C91]">
              Nouvelles de notre Communauté
            </h2>
          </div>
          <Link
            href="/blog"
            className="flex items-center space-x-2 text-[#0B3C91] font-bold text-sm hover:text-[#1E88E5] group shrink-0"
          >
            <span>Lire toutes les actualités</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {dernieresActus.map((actu, index) => (
            <motion.article
              key={actu.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={actu.image || getPhoto(30 + index * 6, '')}
                    alt={actu.titre}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-750"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    Publié le {formaterDate(actu.datePublication)}
                  </span>
                  <h3 className="font-poppins text-base font-bold text-slate-800 group-hover:text-[#1E88E5] transition-colors line-clamp-2 leading-snug">
                    {actu.titre}
                  </h3>
                  <p className="text-slate-555 text-xs leading-relaxed line-clamp-3 font-light">
                    {actu.description}
                  </p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <Link
                  href="/blog"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#0B3C91] hover:text-[#1E88E5]"
                >
                  <span>Lire l'article</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 9. APPEL A L'ACTION - REJOINDRE L'EGLISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-slate-950 via-[#0B3C91] to-slate-950 rounded-3xl p-6 sm:p-10 lg:p-16 text-center text-white relative overflow-hidden shadow-premium"
        >
          {/* Vraie photo d'assemblée en fond */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 bg-[url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800')]" 
            style={{ backgroundImage: `url('${getPhoto(5, '')}')` }}
          />
          <div className="relative max-w-3xl mx-auto space-y-6">
            <h2 className="font-poppins text-2xl sm:text-4xl lg:text-5xl font-black leading-tight">
              Trouvez un Refuge Spirituel à la MEDECCI
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light max-w-2xl mx-auto">
              Que vous cherchiez des réponses spirituelles, un soutien par la prière chrétienne, ou un lieu pour célébrer le Seigneur, vous êtes accueillis les bras ouverts.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Link
                href="/contact"
                className="bg-white text-[#0B3C91] hover:bg-slate-100 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm font-bold transition-colors shadow-md"
              >
                Nous contacter
              </Link>
              <Link
                href="/programmes"
                className="bg-medecci-or text-slate-950 hover:bg-amber-400 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm font-bold transition-colors shadow-md"
              >
                Horaires des cultes
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 10. MINI LECTEUR AUDIO DYNAMIQUE FLOTTANT */}
      <AnimatePresence>
        {sermonActif && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[420px] bg-white/95 backdrop-blur-md border border-[#E2E8F0] rounded-3xl p-5 shadow-2xl z-50 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="h-12 w-12 rounded-xl bg-[#0B3C91]/5 text-[#0B3C91] flex items-center justify-center shrink-0 border border-[#0B3C91]/5 animate-pulse">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-poppins font-bold text-xs text-slate-450 uppercase tracking-widest">En cours de lecture</h5>
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{sermonActif.titre}</h4>
                  <p className="text-[10px] text-medecci-or font-bold uppercase truncate">{sermonActif.pasteur}</p>
                </div>
              </div>
              <button
                onClick={() => setSermonActif(null)}
                className="text-slate-450 hover:text-slate-650 font-bold text-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Barre de progression interactive */}
            <div className="space-y-1">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-[#0B3C91] rounded-full transition-all duration-300"
                  style={{ width: `${progresAudio}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] font-bold text-slate-450">
                <span>00:15</span>
                <span>45:00</span>
              </div>
            </div>

            {/* Boutons de contrôle */}
            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={() => setEnLecture(!enLecture)}
                className="h-12 w-12 bg-[#0B3C91] hover:bg-[#1E88E5] text-white rounded-full flex items-center justify-center shadow-md transition-colors"
              >
                {enLecture ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Accueil;
