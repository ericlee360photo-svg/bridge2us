// Horoscope utilities for Bridge2Us

export interface ZodiacSign {
  name: string;
  symbol: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  dates: { start: { month: number; day: number }; end: { month: number; day: number } };
}

export const zodiacSigns: ZodiacSign[] = [
  {
    name: 'Aries',
    symbol: '♈',
    element: 'Fire',
    dates: { start: { month: 3, day: 21 }, end: { month: 4, day: 19 } }
  },
  {
    name: 'Taurus',
    symbol: '♉',
    element: 'Earth',
    dates: { start: { month: 4, day: 20 }, end: { month: 5, day: 20 } }
  },
  {
    name: 'Gemini',
    symbol: '♊',
    element: 'Air',
    dates: { start: { month: 5, day: 21 }, end: { month: 6, day: 20 } }
  },
  {
    name: 'Cancer',
    symbol: '♋',
    element: 'Water',
    dates: { start: { month: 6, day: 21 }, end: { month: 7, day: 22 } }
  },
  {
    name: 'Leo',
    symbol: '♌',
    element: 'Fire',
    dates: { start: { month: 7, day: 23 }, end: { month: 8, day: 22 } }
  },
  {
    name: 'Virgo',
    symbol: '♍',
    element: 'Earth',
    dates: { start: { month: 8, day: 23 }, end: { month: 9, day: 22 } }
  },
  {
    name: 'Libra',
    symbol: '♎',
    element: 'Air',
    dates: { start: { month: 9, day: 23 }, end: { month: 10, day: 22 } }
  },
  {
    name: 'Scorpio',
    symbol: '♏',
    element: 'Water',
    dates: { start: { month: 10, day: 23 }, end: { month: 11, day: 21 } }
  },
  {
    name: 'Sagittarius',
    symbol: '♐',
    element: 'Fire',
    dates: { start: { month: 11, day: 22 }, end: { month: 12, day: 21 } }
  },
  {
    name: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    dates: { start: { month: 12, day: 22 }, end: { month: 1, day: 19 } }
  },
  {
    name: 'Aquarius',
    symbol: '♒',
    element: 'Air',
    dates: { start: { month: 1, day: 20 }, end: { month: 2, day: 18 } }
  },
  {
    name: 'Pisces',
    symbol: '♓',
    element: 'Water',
    dates: { start: { month: 2, day: 19 }, end: { month: 3, day: 20 } }
  }
];

export function getZodiacSign(birthday: Date): ZodiacSign {
  const month = birthday.getMonth() + 1; // getMonth() returns 0-11
  const day = birthday.getDate();

  for (const sign of zodiacSigns) {
    const { start, end } = sign.dates;
    
    // Handle year-crossing signs (Capricorn)
    if (start.month > end.month) {
      if ((month === start.month && day >= start.day) || 
          (month === end.month && day <= end.day)) {
        return sign;
      }
    } else {
      // Normal date range
      if ((month === start.month && day >= start.day) || 
          (month === end.month && day <= end.day) ||
          (month > start.month && month < end.month)) {
        return sign;
      }
    }
  }
  
  // Fallback (should never happen with correct date ranges)
  return zodiacSigns[0];
}

export interface DailyHoroscope {
  sign: string;
  horoscope: string;
  luckyNumber?: number;
  luckyColor?: string;
  compatibility?: string;
  mood?: string;
  date_range?: string;
}

export interface AztroResponse {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

// Mock horoscopes for demo - in production you'd fetch from an API
export const mockHoroscopes: Record<string, DailyHoroscope> = {
  'Aries': {
    sign: 'Aries',
    horoscope: 'Your energy is magnetic today. A meaningful connection with someone special brings joy and excitement to your day.',
    luckyNumber: 7,
    luckyColor: 'Red',
    compatibility: 'Libra'
  },
  'Taurus': {
    sign: 'Taurus',
    horoscope: 'Patience and understanding lead to deeper intimacy. Take time to appreciate the small gestures from loved ones.',
    luckyNumber: 14,
    luckyColor: 'Green',
    compatibility: 'Scorpio'
  },
  'Gemini': {
    sign: 'Gemini',
    horoscope: 'Communication flows beautifully today. Share your thoughts and dreams - someone important is truly listening.',
    luckyNumber: 3,
    luckyColor: 'Yellow',
    compatibility: 'Sagittarius'
  },
  'Cancer': {
    sign: 'Cancer',
    horoscope: 'Your nurturing nature shines bright. Creating a cozy atmosphere brings you and your partner closer together.',
    luckyNumber: 2,
    luckyColor: 'Silver',
    compatibility: 'Capricorn'
  },
  'Leo': {
    sign: 'Leo',
    horoscope: 'Your charisma draws people in effortlessly. Plan something special - your creativity will be deeply appreciated.',
    luckyNumber: 8,
    luckyColor: 'Gold',
    compatibility: 'Aquarius'
  },
  'Virgo': {
    sign: 'Virgo',
    horoscope: 'Attention to detail strengthens your relationships. Small acts of service speak volumes about your care.',
    luckyNumber: 6,
    luckyColor: 'Navy Blue',
    compatibility: 'Pisces'
  },
  'Libra': {
    sign: 'Libra',
    horoscope: 'Balance and harmony guide your relationships today. Compromise leads to beautiful solutions and deeper understanding.',
    luckyNumber: 15,
    luckyColor: 'Pink',
    compatibility: 'Aries'
  },
  'Scorpio': {
    sign: 'Scorpio',
    horoscope: 'Intensity and passion mark your connections. Trust your intuition when it comes to matters of the heart.',
    luckyNumber: 13,
    luckyColor: 'Deep Purple',
    compatibility: 'Taurus'
  },
  'Sagittarius': {
    sign: 'Sagittarius',
    horoscope: 'Adventure calls in your relationships. Share your dreams of future travels and experiences together.',
    luckyNumber: 9,
    luckyColor: 'Orange',
    compatibility: 'Gemini'
  },
  'Capricorn': {
    sign: 'Capricorn',
    horoscope: 'Steady progress in love brings lasting rewards. Your commitment and dedication inspire those around you.',
    luckyNumber: 10,
    luckyColor: 'Brown',
    compatibility: 'Cancer'
  },
  'Aquarius': {
    sign: 'Aquarius',
    horoscope: 'Unique perspectives strengthen your bonds. Embrace what makes your relationship special and different.',
    luckyNumber: 11,
    luckyColor: 'Electric Blue',
    compatibility: 'Leo'
  },
  'Pisces': {
    sign: 'Pisces',
    horoscope: 'Emotional depth creates beautiful connections. Let your compassionate nature guide your interactions today.',
    luckyNumber: 12,
    luckyColor: 'Sea Green',
    compatibility: 'Virgo'
  }
};

// Fetch daily horoscope from aztro API
export async function fetchDailyHoroscope(zodiacSign: ZodiacSign): Promise<DailyHoroscope> {
  try {
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${zodiacSign.name.toLowerCase()}&day=today`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch horoscope');
    }
    
    const data: AztroResponse = await response.json();
    
    return {
      sign: zodiacSign.name,
      horoscope: data.description,
      luckyNumber: parseInt(data.lucky_number) || undefined,
      luckyColor: data.color,
      compatibility: data.compatibility,
      mood: data.mood,
      date_range: data.date_range
    };
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    // Fallback to mock data
    return getDailyHoroscopeMock(zodiacSign);
  }
}

// Fallback mock function
export function getDailyHoroscopeMock(zodiacSign: ZodiacSign): DailyHoroscope {
  return mockHoroscopes[zodiacSign.name] || mockHoroscopes['Aries'];
}

// Wrapper function that can use cache
export async function getDailyHoroscope(zodiacSign: ZodiacSign, useCache = true): Promise<DailyHoroscope> {
  if (useCache && typeof window !== 'undefined') {
    const cacheKey = `horoscope_${zodiacSign.name}_${new Date().toDateString()}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Invalid cache, remove it
        localStorage.removeItem(cacheKey);
      }
    }
    
    // Fetch new data
    const horoscope = await fetchDailyHoroscope(zodiacSign);
    
    // Cache for today
    localStorage.setItem(cacheKey, JSON.stringify(horoscope));
    
    return horoscope;
  }
  
  return await fetchDailyHoroscope(zodiacSign);
}

export function formatZodiacDisplay(zodiacSign: ZodiacSign): string {
  return `${zodiacSign.symbol} ${zodiacSign.name}`;
}
