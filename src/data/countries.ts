export type CountryCard = {
  id: string;
  countryName: string;
  flagEmoji: string;
  capital: string;
  region: string;
};

export const countries: CountryCard[] = [
  { id: "jp", countryName: "日本", flagEmoji: "🇯🇵", capital: "東京", region: "東アジア" },
  { id: "fr", countryName: "フランス", flagEmoji: "🇫🇷", capital: "パリ", region: "西ヨーロッパ" },
  { id: "br", countryName: "ブラジル", flagEmoji: "🇧🇷", capital: "ブラジリア", region: "南アメリカ" },
  { id: "ke", countryName: "ケニア", flagEmoji: "🇰🇪", capital: "ナイロビ", region: "東アフリカ" },
  { id: "in", countryName: "インド", flagEmoji: "🇮🇳", capital: "ニューデリー", region: "南アジア" },
  { id: "ca", countryName: "カナダ", flagEmoji: "🇨🇦", capital: "オタワ", region: "北アメリカ" },
  { id: "eg", countryName: "エジプト", flagEmoji: "🇪🇬", capital: "カイロ", region: "北アフリカ" },
  { id: "au", countryName: "オーストラリア", flagEmoji: "🇦🇺", capital: "キャンベラ", region: "オセアニア" },
];
