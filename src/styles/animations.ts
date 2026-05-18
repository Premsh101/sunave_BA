// Sunave — Animation Keyframes & Style Helpers
// These get injected via globals.css and referenced in inline styles

export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeInUp: `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeInDown: `
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeInLeft: `
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  fadeInRight: `
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `,
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `,
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
      50% { box-shadow: 0 0 40px rgba(99,102,241,0.5), 0 0 60px rgba(6,182,212,0.2); }
    }
  `,
  gradientShift: `
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
  `,
  recording: `
    @keyframes recording {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.1); }
    }
  `,
  wave: `
    @keyframes wave {
      0% { transform: scaleY(1); }
      50% { transform: scaleY(2); }
      100% { transform: scaleY(1); }
    }
  `,
  typewriter: `
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
  `,
  marquee: `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `,
};

// Animation style helpers
export const animations = {
  fadeIn: (delay = 0, duration = 0.5): string =>
    `fadeIn ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  fadeInUp: (delay = 0, duration = 0.6): string =>
    `fadeInUp ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  fadeInDown: (delay = 0, duration = 0.6): string =>
    `fadeInDown ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  fadeInLeft: (delay = 0, duration = 0.6): string =>
    `fadeInLeft ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  fadeInRight: (delay = 0, duration = 0.6): string =>
    `fadeInRight ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  slideDown: (delay = 0): string =>
    `slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  scaleIn: (delay = 0, duration = 0.4): string =>
    `scaleIn ${duration}s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s both`,
  float: (duration = 6): string =>
    `float ${duration}s ease-in-out infinite`,
  pulse: (duration = 2): string =>
    `pulse ${duration}s ease-in-out infinite`,
  shimmer: (duration = 2): string =>
    `shimmer ${duration}s infinite`,
  glow: (duration = 3): string =>
    `glow ${duration}s ease-in-out infinite`,
  gradientShift: (duration = 8): string =>
    `gradientShift ${duration}s ease infinite`,
  spin: (duration = 1): string =>
    `spin ${duration}s linear infinite`,
  recording: `recording 1.5s ease-in-out infinite`,
  marquee: (duration = 30): string =>
    `marquee ${duration}s linear infinite`,
};

export default animations;
