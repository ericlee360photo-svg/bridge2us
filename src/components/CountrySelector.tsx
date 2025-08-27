"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CV", name: "Cape Verde", flag: "🇨🇻" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "CI", name: "Ivory Coast", flag: "🇨🇮" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "CG", name: "Republic of the Congo", flag: "🇨🇬" },
  { code: "CD", name: "Democratic Republic of the Congo", flag: "🇨🇩" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "GF", name: "French Guiana", flag: "🇬🇫" },
  { code: "FK", name: "Falkland Islands", flag: "🇫🇰" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "TC", name: "Turks and Caicos Islands", flag: "🇹🇨" },
  { code: "KY", name: "Cayman Islands", flag: "🇰🇾" },
  { code: "VG", name: "British Virgin Islands", flag: "🇻🇬" },
  { code: "VI", name: "U.S. Virgin Islands", flag: "🇻🇮" },
  { code: "AI", name: "Anguilla", flag: "🇦🇮" },
  { code: "MS", name: "Montserrat", flag: "🇲🇸" },
  { code: "GP", name: "Guadeloupe", flag: "🇬🇵" },
  { code: "MQ", name: "Martinique", flag: "🇲🇶" },
  { code: "BL", name: "Saint Barthélemy", flag: "🇧🇱" },
  { code: "MF", name: "Saint Martin", flag: "🇲🇫" },
  { code: "SX", name: "Sint Maarten", flag: "🇸🇽" },
  { code: "CW", name: "Curaçao", flag: "🇨🇼" },
  { code: "AW", name: "Aruba", flag: "🇦🇼" },
  { code: "BQ", name: "Caribbean Netherlands", flag: "🇧🇶" },
  { code: "GL", name: "Greenland", flag: "🇬🇱" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "FO", name: "Faroe Islands", flag: "🇫🇴" },
  { code: "AX", name: "Åland Islands", flag: "🇦🇽" },
  { code: "GI", name: "Gibraltar", flag: "🇬🇮" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "VA", name: "Vatican City", flag: "🇻🇦" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "XK", name: "Kosovo", flag: "🇽🇰" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "NC", name: "New Caledonia", flag: "🇳🇨" },
  { code: "PF", name: "French Polynesia", flag: "🇵🇫" },
  { code: "WF", name: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "CK", name: "Cook Islands", flag: "🇨🇰" },
  { code: "NU", name: "Niue", flag: "🇳🇺" },
  { code: "TK", name: "Tokelau", flag: "🇹🇰" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸" },
  { code: "GU", name: "Guam", flag: "🇬🇺" },
  { code: "MP", name: "Northern Mariana Islands", flag: "🇲🇵" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "CK", name: "Cook Islands", flag: "🇨🇰" },
  { code: "NU", name: "Niue", flag: "🇳🇺" },
  { code: "TK", name: "Tokelau", flag: "🇹🇰" },
  { code: "AS", name: "American Samoa", flag: "🇦🇸" },
  { code: "GU", name: "Guam", flag: "🇬🇺" },
  { code: "MP", name: "Northern Mariana Islands", flag: "🇲🇵" }
];

interface CountrySelectorProps {
  value: string;
  onChange: (country: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CountrySelector({
  value,
  onChange,
  placeholder = "Select your country",
  className = ""
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find(country => country.code === value);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-left focus:ring-2 focus:ring-pink-500 focus:border-transparent"
      >
        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-gray-400" />
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {selectedCountry.name}
              </span>
            </>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>

          {/* Country list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    value === country.code ? 'bg-pink-50 dark:bg-pink-900/20' : ''
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {country.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 dark:text-gray-400 text-sm">
                No countries found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
