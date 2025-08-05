// src/components/sections/JoinMissionSection.tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'; // Ditambahkan useCallback
import Button from '../ui/Button';
import { Rocket, ChevronRight, CheckCircle, Copy as CopyIcon, Share2 } from 'lucide-react';
import { useSoundContext } from '../../contexts/SoundContext';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';

const API_BASE_URL = 'https://cigarapi.up.railway.app';

interface ApiResponse {
  success: boolean;
  message: string;
  wallet_address: string;
  referral_code?: string;
}

const JoinMissionSection: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentUserReferralCode, setCurrentUserReferralCode] = useState('');
  const [initialReferrerCode, setInitialReferrerCode] = useState<string | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const sectionRef = useRef<HTMLElement>(null);
  const { playSound } = useSoundContext();
  const { address: connectedAddress, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && connectedAddress) {
      setWalletAddress(connectedAddress);
    }
  }, [isConnected, connectedAddress]);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCodeFromUrl = urlParams.get('ref');
    if (refCodeFromUrl) {
      setInitialReferrerCode(refCodeFromUrl.toUpperCase());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error('Please enter your Comm-link Address.', { position: 'bottom-center' });
      return;
    }
    
    playSound('/assets/sounds/robot-click.wav');
    setIsSubmitting(true);
    setSubmissionMessage('');

    try {
      const payload = {
        wallet_address: walletAddress.trim(),
      };

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        setCurrentUserReferralCode(data.referral_code || '');
        setSubmissionMessage(data.message || 'Registration confirmed, Ally! Welcome to the $CIGAR Initiative.');
        setIsSubmitted(true);
        toast.success(data.message || 'Registration successful!', { position: 'bottom-center' });
      } else {
        const errorMessage = data.message || 'Registration failed. Please try again.';
        toast.error(errorMessage, { position: 'bottom-center' });
      }
    } catch (error) {
      console.error('Registration API error:', error);
      toast.error('An error occurred while connecting to the transmission server. Please try again later.', { position: 'bottom-center' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elementsToObserve = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elementsToObserve?.forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      elementsToObserve?.forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  const referralLink = useMemo(() => {
    if (!currentUserReferralCode) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}?ref=${currentUserReferralCode}`;
  }, [currentUserReferralCode]);

  const handleCopyReferralLink = useCallback(async () => {
    playSound('/assets/sounds/robot-click.wav');
    if (referralLink) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(referralLink);
          toast.success('Referral link copied to clipboard!', { position: 'bottom-center', duration: 2000 });
          return;
        } catch (err) {
          console.error('navigator.clipboard.writeText failed: ', err);
          // Fallback akan dijalankan di bawah jika ini gagal
        }
      }
      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      textArea.style.position = "fixed";  // Prevent scrolling to bottom
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          toast.success('Referral link copied (fallback)!', { position: 'bottom-center', duration: 2000 });
        } else {
          toast.error('Failed to copy referral link using fallback.', { position: 'bottom-center', duration: 3000 });
        }
      } catch (err) {
        console.error('Fallback copy failed: ', err);
        toast.error('Copying referral link is not supported on your browser.', { position: 'bottom-center', duration: 3000 });
      } finally {
        document.body.removeChild(textArea);
      }
    } else {
      toast.error('No referral link to copy.', { position: 'bottom-center' });
    }
  }, [referralLink, playSound]);
  
  return (
    <section 
      id="join" 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-dark-blue/40 to-black"></div>
      <div className="tech-grid absolute inset-0 opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            <Rocket className="h-12 w-12 text-cyan-glow mx-auto mb-4" />
            <h2 className="section-title">Accept the <span className="text-cyan-glow glow-text">Transmission</span></h2>
            <p className="section-subtitle">
            Join the mission. Not as a follower. But as a flamebearer. Relay operators, explorers, and techno-pioneers—your path begins now.
            </p>
          </div>
          
          <div className="bg-gray-900/30 backdrop-blur-md border border-cyan-glow/30 rounded-lg p-8 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="wallet" className="block font-orbitron text-cyan-glow mb-2">Your Comm-link Address (Base Network)</label>
                  <input 
                    type="text" 
                    id="wallet"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full bg-black/50 border border-cyan-glow/50 text-gray-200 p-3 rounded-md focus:outline-none focus:border-cyan-glow focus:ring-1 focus:ring-cyan-glow font-spaceMono"
                    placeholder={isConnected && connectedAddress ? connectedAddress : "0x..."}
                    required
                  />
                  {initialReferrerCode && (
                    <p className="text-xs text-magenta-glow mt-2 animate-fadeIn">
                      Recruited via Alliance Code: {initialReferrerCode}
                    </p>
                  )}
                   {isConnected && connectedAddress && walletAddress === connectedAddress && (
                    <p className="text-xs text-cyan-glow/70 mt-1">
                      Using connected wallet address.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="text-gray-400 text-sm order-2 md:order-1">
                    By joining, you accept the call of duty within the Terran Alliance.
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto order-1 md:order-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>Processing Transmission...</span>
                    ) : (
                      <>
                        <span>Join the Mission</span>
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 text-cyan-glow mx-auto mb-4" />
                <h3 className="font-orbitron text-2xl text-white mb-2">Transmission Received, Ally!</h3>
                <p className="text-gray-300 mb-6">
                  {submissionMessage || "You're in the $CIGAR mission. Await news on the $CIGAR airdrop."}
                </p>
                
                {currentUserReferralCode && referralLink && (
                  <div className="mt-8 pt-6 border-t border-cyan-glow/20">
                    <div className="flex items-center justify-center mb-3">
                        <Share2 className="h-5 w-5 text-magenta-glow mr-2"/>
                        <h4 className="font-orbitron text-lg text-magenta-glow">Share Your Alliance Code!</h4>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      Invite fellow pioneers to expand our alliance and amplify mission rewards.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-3 bg-black/50 p-3 rounded-lg border border-magenta-glow/30">
                      <input 
                        type="text" 
                        value={referralLink} 
                        readOnly 
                        className="w-full sm:flex-grow bg-transparent text-gray-200 p-2 rounded font-spaceMono text-sm select-all"
                        onFocus={(e) => e.target.select()}
                      />
                      <Button 
                        onClick={handleCopyReferralLink} // Fungsi ini sekarang sudah diimplementasikan
                        variant="secondary"
                        glowColor="magenta"
                        size="sm"
                        className="w-full sm:w-auto px-4 py-2 flex items-center"
                      >
                        <CopyIcon className="h-4 w-4 mr-2" />
                        Copy Code
                      </Button>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => {
                    playSound('/assets/sounds/robot-click.wav');
                    setIsSubmitted(false); 
                    setCurrentUserReferralCode('');
                    setSubmissionMessage('');
                    if (isConnected && connectedAddress) {
                        setWalletAddress(connectedAddress);
                    } else {
                        setWalletAddress('');
                    }
                    setInitialReferrerCode(null);
                  }} 
                  className="mt-8"
                >
                  Register Another Comm-link
                </Button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="tech-card animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200">
              <h3 className="font-orbitron text-lg text-cyan-glow mb-2">Connect</h3>
              <p className="text-gray-400 text-sm">
              Signal your intent to join the expedition. Register your comm-link to sync with the interstellar alliance network.
              </p>
            </div>
            
            <div className="tech-card animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300">
              <h3 className="font-orbitron text-lg text-cyan-glow mb-2">Pioneer Discovery</h3>
              <p className="text-gray-400 text-sm">
              Become a pioneer in discovery. Your unique signature helps chart new technological pathways on the Base Network.
              </p>
            </div>
            
            <div className="tech-card animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-400">
              <h3 className="font-orbitron text-lg text-cyan-glow mb-2">Mutual Prosperity</h3>
              <p className="text-gray-400 text-sm">
                Earn $CIGAR tokens as a valued partner, sharing the rewards of this vital interstellar quest.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JoinMissionSection;
