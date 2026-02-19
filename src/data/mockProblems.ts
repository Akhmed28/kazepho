import { Problem } from '../types';

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Measuring the Speed of Sound in Air',
    olympiad: 'KazEPhO',
    year: 2023,
    gradeLevel: 11,
    statement:
      'Using the equipment provided (speaker, microphone, oscilloscope, ruler), determine the speed of sound in air at room temperature. Estimate the uncertainty of your measurement. Compare with the theoretical value $v = \\sqrt{\\gamma R T / M}$, where $\\gamma = 1.4$ for air, $R = 8.314\\,\\text{J mol}^{-1}\\text{K}^{-1}$, $M = 0.029\\,\\text{kg/mol}$.',
    experimentalSetup:
      'A speaker and microphone are placed at distance $d$ apart on a ruler track. A signal generator produces a sinusoidal wave at frequency $f$. The oscilloscope displays both the input signal and the microphone signal simultaneously.',
    solution:
      'By varying the distance $d$ between speaker and microphone, we observe the phase shift $\\Delta\\phi$ between the two oscilloscope traces. When $\\Delta\\phi = 2\\pi$, the distance corresponds to one wavelength $\\lambda$.\n\nThe speed of sound is:\n$$v = f\\lambda$$\n\nA more robust method: fix frequency $f$ and slowly increase $d$ until the phase repeats. Record multiple wavelengths to reduce random error:\n$$v = f \\cdot \\frac{\\Delta d}{n}$$\nwhere $\\Delta d$ is the total distance increase over $n$ complete cycles.\n\n**Typical result:** $v \\approx 343\\,\\text{m/s}$ at $T = 20^\\circ\\text{C}$.\n\nTheoretical prediction:\n$$v_{\\text{theory}} = \\sqrt{\\frac{1.4 \\times 8.314 \\times 293}{0.029}} \\approx 343\\,\\text{m/s}$$\n\nThe agreement confirms the ideal gas model is valid for air under normal conditions.',
    tags: ['acoustics', 'waves', 'measurement'],
  },
  {
    id: '2',
    title: 'Determination of Surface Tension of Water',
    olympiad: 'KazEPhO',
    year: 2023,
    gradeLevel: 10,
    statement:
      'Determine the surface tension coefficient $\\sigma$ of water at room temperature using the capillary rise method. You are given capillary tubes of different known radii $r$, a ruler, and a beaker of distilled water.',
    experimentalSetup:
      'Vertical capillary tubes of radii $r_1, r_2, r_3$ are immersed in a beaker of distilled water. The water rises to heights $h_1, h_2, h_3$ respectively due to capillary action.',
    solution:
      'From the balance of surface tension force and gravity for a liquid column in a capillary:\n$$2\\pi r \\sigma \\cos\\theta = \\pi r^2 \\rho g h$$\n\nFor water on clean glass, the contact angle $\\theta \\approx 0$, so $\\cos\\theta \\approx 1$:\n$$\\sigma = \\frac{\\rho g r h}{2}$$\n\nMeasure $h$ for each capillary and plot $h$ vs $1/r$. The slope gives:\n$$\\text{slope} = \\frac{2\\sigma}{\\rho g}$$\n\nTherefore:\n$$\\sigma = \\frac{\\rho g \\cdot \\text{slope}}{2}$$\n\nExpected result: $\\sigma \\approx 0.072\\,\\text{N/m}$ at $20^\\circ\\text{C}$.',
    tags: ['fluids', 'surface tension', 'capillarity'],
  },
  {
    id: '3',
    title: 'Measurement of the Moment of Inertia',
    olympiad: 'IZhO',
    year: 2022,
    gradeLevel: 11,
    statement:
      'A disk of radius $R$ and unknown mass $M$ is suspended by a bifilar pendulum (two parallel strings of length $L$ separated by distance $2d$). By measuring the period of torsional oscillations $T$, determine the moment of inertia $I$ of the disk about its central axis.',
    experimentalSetup:
      'The disk is suspended horizontally by two thin strings attached at the rim, separated by distance $2d$. When the disk is twisted by a small angle and released, it undergoes torsional oscillations.',
    solution:
      'For a bifilar pendulum, the restoring torque for small twist angle $\\phi$ is:\n$$\\tau = -\\frac{Mgd^2}{L}\\phi$$\n\nThis gives simple harmonic motion with:\n$$T = 2\\pi\\sqrt{\\frac{IL}{Mgd^2}}$$\n\nSolving for $I$:\n$$\\boxed{I = \\frac{MgT^2d^2}{4\\pi^2 L}}$$\n\nThe mass $M$ can be measured with a scale. Measure $T$ by timing many oscillations: $T = t_n / n$ where $t_n$ is the time for $n$ complete oscillations.\n\nFor a uniform solid disk: $I_{\\text{theory}} = \\frac{1}{2}MR^2$. Comparing this with the experimental value provides a consistency check.',
    tags: ['rotation', 'oscillations', 'moment of inertia'],
  },
  {
    id: '4',
    title: 'RC Circuit Time Constant',
    olympiad: 'Respa',
    year: 2023,
    gradeLevel: 9,
    statement:
      'Given a resistor $R$ and capacitor $C$, measure the time constant $\\tau = RC$ by charging the capacitor through the resistor. Compare with the nominal values. Equipment: DC power supply, voltmeter, resistor, capacitor, stopwatch.',
    experimentalSetup:
      'The capacitor $C$ is connected in series with resistor $R$ to a battery of EMF $\\mathcal{E}$. A voltmeter measures the voltage across the capacitor $V_C(t)$ as a function of time.',
    solution:
      'During charging, the voltage across the capacitor follows:\n$$V_C(t) = \\mathcal{E}\\left(1 - e^{-t/\\tau}\\right), \\quad \\tau = RC$$\n\n**Method 1 — Direct reading:** At $t = \\tau$, we have $V_C = \\mathcal{E}(1 - e^{-1}) \\approx 0.632\\,\\mathcal{E}$. Measure the time to reach $63.2\\%$ of the final voltage.\n\n**Method 2 — Linearisation:** Rearranging:\n$$\\ln\\left(1 - \\frac{V_C}{\\mathcal{E}}\\right) = -\\frac{t}{\\tau}$$\n\nPlot $\\ln(1 - V_C/\\mathcal{E})$ vs $t$. The slope equals $-1/\\tau$, so:\n$$\\tau = -\\frac{1}{\\text{slope}}$$\n\nMethod 2 is preferred as it uses all data points and provides a clearer estimate of uncertainty.',
    tags: ['electricity', 'circuits', 'RC', 'exponential decay'],
  },
  {
    id: '5',
    title: "Verification of Malus's Law",
    olympiad: 'KazEPhO',
    year: 2022,
    gradeLevel: 10,
    statement:
      "Using a light source, two polarising filters, and a photodetector, verify Malus's law: $I = I_0 \\cos^2\\theta$, where $\\theta$ is the angle between the polarisation axes of the two filters.",
    experimentalSetup:
      'A light source illuminates a photodetector through two polarising filters. The first polariser creates linearly polarised light. The second polariser (analyser) can be rotated by a known angle $\\theta$.',
    solution:
      "Malus's Law states:\n$$I(\\theta) = I_0 \\cos^2\\theta$$\n\nMeasure photodetector current $i(\\theta)$ (proportional to intensity) for $\\theta$ from $0°$ to $180°$ in steps of $10°$.\n\nTo verify linearity, plot $i$ vs $\\cos^2\\theta$. If Malus's Law holds, the graph should be a straight line through the origin with slope $i_0$.\n\nAlternatively, plot $\\ln(i/i_0)$ vs $\\ln(\\cos\\theta)$; the slope should be exactly $2$.\n\n**Typical systematic errors:**\n- Ambient light leaking into the detector (subtract background)\n- Imperfect polariser (extinction ratio)\n- Non-linearity of the photodetector at high intensities\n\nCorrect by measuring $i_{\\text{bg}}$ with light off and subtracting.",
    tags: ['optics', 'polarisation', 'light'],
  },
  {
    id: '6',
    title: 'Hooke\'s Law and Spring Constant',
    olympiad: 'Respa',
    year: 2022,
    gradeLevel: 8,
    statement:
      'Determine the spring constant $k$ of a coil spring using two independent methods: (1) static extension under known loads, and (2) measurement of the period of vertical oscillations.',
    experimentalSetup:
      'A spring is hung vertically from a fixed support. Known masses $m$ can be attached to the lower end. A ruler measures the extension. A stopwatch measures oscillation periods.',
    solution:
      '**Method 1 — Static:**\nBy Hooke\'s Law: $F = kx$, so $mg = kx$.\n\nPlot $x$ vs $m$ and fit a line: slope $= g/k$, so:\n$$k_1 = \\frac{g}{\\text{slope}}$$\n\n**Method 2 — Dynamic:**\nPeriod of vertical oscillations:\n$$T = 2\\pi\\sqrt{\\frac{m}{k}}$$\n\nPlot $T^2$ vs $m$; the slope is $4\\pi^2/k$:\n$$k_2 = \\frac{4\\pi^2}{\\text{slope}}$$\n\n**Note:** The dynamic method effectively measures $k$ including part of the spring\'s own mass. The static method is more direct. Comparing $k_1$ and $k_2$ tests consistency and the approximation that the spring\'s mass is negligible.',
    tags: ['mechanics', 'oscillations', 'Hooke\'s Law'],
  },
];

export const olympiads = ['KazEPhO', 'Respa', 'IZhO'] as const;
export const years = [2020, 2021, 2022, 2023, 2024];
export const gradeLevels = [8, 9, 10, 11];
