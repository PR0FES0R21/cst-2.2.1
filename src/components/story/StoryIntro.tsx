import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSoundContext } from '../../contexts/SoundContext';

interface Scene {
  id: number;
  location: string;
  text: string[];
  background: string;
  character: {
    image: string;
    position: 'top-left' | 'top-center' | 'top-right' | 'center-left' | 'center' | 'center-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    size: {
      width: string;
      height: string;
    };
    animation: {
      initial: any;
      animate: any;
    };
  };
  textPosition?: 'left' | 'right';
}

interface StoryIntroProps {
  onComplete: () => void;
}

const getPositionClasses = (position: string) => {
  const positions = {
    'top-left': 'top-0 left-0',
    'top-center': 'top-0 left-1/2 -translate-x-1/2',
    'top-right': 'top-0 right-0',
    'center-left': 'top-1/2 -translate-y-1/2 left-0',
    'center': 'top-1 left-1/2 -translate-x-1/2 -translate-y-1',
    'center-right': 'top-1/2 -translate-y-1/2 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-0 right-0'
  };
  return positions[position as keyof typeof positions] || positions['center'];
};

const scenes: Scene[] = [
  {
    id: 1,
    location: "Smoketron Prime – Golden Era Archives",
    text: [
      "Smoketron was a civilization of light, their brilliance known across the galaxies.<br>",
      "They dreamed big and built technologies beyond limits.",
      " The future looked limitless."
    ],
    background: "/assets/images/schene/schene_1.png", // Gambar Smoketron yang sangat maju & makmur
    character: {
      image: "/assets/images/schene/char_schene_1.png", // Mungkin Smoke King di masa mudanya, optimis
      position: "bottom-left",
      size: { width: "w-auto", height: "h-1/1" },
      animation: { initial: { y: 0, scale: 0.8, opacity: 0 }, animate: { y: 0, scale: 1, opacity: 0.7 } }
    },
    textPosition: "left"
  },
  {
    id: 2,
    location: "Apex Innovation Labs – Smoketron",
    text: [
      "Their crowning achievement was $CIGAR.<br>",
      "A self-sustaining technology designed to elevate their civilization to the next level.<br>",
      "It was Smoketron’s masterpiece."
    ],
    background: "/assets/images/schene/schene_2.png", // Gambar teknologi $CIGAR yang berfungsi & canggih
    character: {
      image: "/assets/images/schene/char_schene_2.png", // Fokus pada teknologi $CIGAR itu sendiri
      position: "center",
      size: { width: "w-1/2", height: "h-1/1" }, // Sesuaikan ukuran
      animation: { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 0.9 } }
    },
    textPosition: "left"
  },
  {
    id: 3,
    location: "The Great Void – Post 'Krellnic Inversion'",
    text: [
      "But everything changed when the ‘Krellnic Inversion’ struck without warning.<br>",
      "A mysterious anomaly shattered their core systems.",
      " $CIGAR, once strong and proud, was now fragile and unstable."
    ],
    background: "/assets/images/schene/schene_3.png", // Gambar efek anomali kosmik atau kerusakan sistemik
    character: {
      image: "/assets/images/schene/char_schene_3.png", // Gambar teknologi $CIGAR yang rusak/tidak stabil
      position: "center-right",
      size: { width: "w-1/2", height: "h-1/2" },
      animation: { initial: { opacity: 1, filter: "grayscale(100%)" }, animate: { opacity: 0.6, filter: "grayscale(50%)", y: [0, 5, 0] }, transition: { yoyo: Infinity, duration: 3 } }
    },
    textPosition: "left"
  },
  {
    id: 4,
    location: "Smoketron Restoration Council",
    text: [
      "Their civilization now teetered on the edge of collapse.",
      " $CIGAR still held potential but couldn’t survive alone.<br>",
      "It needed a new, resilient foundation."
    ],
    background: "/assets/images/schene/schene_4.png", // Ruang dewan yang suram atau laboratorium darurat
    character: {
      image: "/assets/images/schene/char_schene_4.png", // Profesor Kal'Zor tampak khawatir tapi menemukan solusi
      position: "bottom-right",
      size: { width: "w-auto", height: "h-3/4" },
      animation: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 0.7 } }
    },
    textPosition: "left"
  },
  {
    id: 5,
    location: "Galactic Cartography Bay",
    text: [
      "The brightest minds scoured the cosmos for a solution.",
      " They discovered a protocol signature on a distant blue planet: Earth.",
      " A network called ‘Base’—the perfect host to rebuild $CIGAR."
    ],
    background: "/assets/images/schene/schene_5.png", // Peta bintang dengan Bumi/Base ditandai
     character: {
      image: "/assets/images/schene/char_schene_5.png", // Ilmuwan Smoketron menemukan Base
      position: "center-left",
      size: { width: "w-1/2", height: "h-1/2" },
      animation: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 0.8 } }
    },
    textPosition: "left" // Pindahkan teks ke kanan agar tidak menutupi karakter ilmuwan
  },
  {
    id: 6,
    location: "Transmission Outbound – Call to the Brave",
    text: [
      "A message was broadcast to Earth.<br>Smoketron sought brave allies, visionaries ready to rebuild $CIGAR on the Base network. <br> <br>", // Menggunakan "protocol BASE" sesuai permintaan Anda
      "Join us. Build the future. Claim the rewards."
    ],
    background: "/assets/images/schene/schene_6.png", // Bumi dengan overlay transmisi
    character: {
      image: "", // Emblem $CIGAR ditransmisikan
      position: "center",
      size: { width: "w-80", height: "h-80" }, // Disesuaikan
      animation: { initial: { scale: 0.5, opacity: 0 }, animate: { scale: 1, opacity: 0.6 }, transition: { delay: 1, duration: 1.5 } }
    }
  }
];

const StoryIntro: React.FC<StoryIntroProps> = ({ onComplete }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const { playSound } = useSoundContext();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTypingComplete && currentScene < scenes.length - 1 && autoAdvance) {
      timer = setTimeout(() => {
        setCurrentScene(prev => prev + 1);
        setIsTypingComplete(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [currentScene, isTypingComplete, autoAdvance]);

  const handleActivateProtocol = useCallback(() => {
    playSound('/assets/sounds/go.wav');
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  }, [onComplete, playSound]);

  const handlePrevScene = useCallback(() => {
    playSound('/assets/sounds/skip.wav');
    if (currentScene > 0) {
      setAutoAdvance(false);
      setCurrentScene(prev => prev - 1);
      setIsTypingComplete(false);
    }
  }, [currentScene, playSound]);

  const handleNextScene = useCallback(() => {
    playSound('/assets/sounds/skip.wav');
    if (currentScene < scenes.length - 1) {
      setAutoAdvance(false);
      setCurrentScene(prev => prev + 1);
      setIsTypingComplete(false);
    }
  }, [currentScene, playSound]);

  const NavigationArrow = ({ direction, onClick, disabled }: { direction: 'left' | 'right', onClick: () => void, disabled: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? 'left-4' : 'right-4'} 
                 z-50 w-12 h-12 rounded-full flex items-center justify-center
                 border border-cyan-glow/30 bg-black/50 backdrop-blur-sm
                 hover:border-cyan-glow hover:bg-cyan-glow/10 transition-all duration-300
                 ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
    >
      {direction === 'left' ? (
        <ChevronLeft className="w-6 h-6 text-cyan-glow" />
      ) : (
        <ChevronRight className="w-6 h-6 text-cyan-glow" />
      )}
    </button>
  );

  return (
    <motion.div 
      className="fixed inset-0 bg-black overflow-hidden"
      animate={isExiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="smoke-effect"></div>
      
      <NavigationArrow
        direction="left"
        onClick={handlePrevScene}
        disabled={currentScene === 0}
      />
      <NavigationArrow
        direction="right"
        onClick={handleNextScene}
        disabled={currentScene === scenes.length - 1}
      />
      
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {scenes.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentScene ? 'bg-cyan-glow w-4' : 'bg-cyan-glow/30'
            }`}
          />
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full"
        >
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10 }}
            style={{
              backgroundImage: `url(${scenes[currentScene].background})`
            }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          </motion.div>

          <motion.div
            className={`absolute flex items-center justify-center ${getPositionClasses(scenes[currentScene].character.position)} ${scenes[currentScene].character.size.width} ${scenes[currentScene].character.size.height}`}
            initial={scenes[currentScene].character.animation.initial}
            animate={scenes[currentScene].character.animation.animate}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {scenes[currentScene].character.image && (
              <img
                src={scenes[currentScene].character.image}
                className="h-full w-auto object-contain"
                alt=""
              />
            )}
          </motion.div>

          {currentScene === scenes.length - 1 ? (
            <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl text-center"
              >
                <div className="text-lg md:text-2xl text-cyan-glow font-orbitron mb-8 md:mb-12">
                  <Typewriter
                    onInit={(typewriter) => {
                      scenes[currentScene].text.forEach((line) => {
                        typewriter.typeString(line).pauseFor(1000).start();
                      });
                    }}
                    options={{ delay: 50, cursor: '|' }}
                  />
                </div>
                
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: scenes[currentScene].text.join("").length * 0.05 + scenes[currentScene].text.length }}
                  onClick={handleActivateProtocol}
                  className="px-6 py-3 md:px-8 md:py-4 bg-transparent border-2 border-cyan-glow text-cyan-glow 
                             font-orbitron text-base md:text-xl rounded hover:bg-cyan-glow/20 
                             transition-all duration-300 relative overflow-hidden
                             after:absolute after:inset-0 after:bg-cyan-glow/10 
                             after:opacity-0 hover:after:opacity-100 after:transition-opacity"
                >
                  ACTIVATE PROTOCOL
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <div className="relative z-10 h-full flex flex-col justify-between p-4 md:p-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white text-sm md:text-lg text-center mt-8 md:mt-2"
              >
                {scenes[currentScene].location}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`max-w-2xl mx-auto ${scenes[currentScene].textPosition === 'right' ? 'text-right' : 'text-left'}`}
              >
                <div className="text-base md:text-2xl text-cyan-glow font-orbitron mb-20 md:mb-3">
                  <Typewriter
                    onInit={(typewriter) => {
                      let typingCompleted = false;
                      scenes[currentScene].text.forEach((line, index) => {
                        typewriter.typeString(line).pauseFor(1000)
                          .callFunction(() => {
                            if (index === scenes[currentScene].text.length - 1 && !typingCompleted) {
                              setIsTypingComplete(true);
                              typingCompleted = true;
                            }
                          });
                      });
                      typewriter.start();
                    }}
                    options={{ delay: 50, cursor: '|' }}
                  />
                </div>
              </motion.div>
            </div>
          )}

          <div className="absolute top-4 left-4 w-12 h-12 md:w-32 md:h-32 border-l-2 border-t-2 border-cyan-glow/50 rounded-tl-lg"></div>
          <div className="absolute top-4 right-4 w-12 h-12 md:w-32 md:h-32 border-r-2 border-t-2 border-cyan-glow/50 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 md:w-32 md:h-32 border-l-2 border-b-2 border-cyan-glow/50 rounded-bl-lg"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 md:w-32 md:h-32 border-r-2 border-b-2 border-cyan-glow/50 rounded-br-lg"></div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default StoryIntro;