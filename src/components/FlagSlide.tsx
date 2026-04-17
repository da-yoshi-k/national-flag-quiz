import type { CountryCard } from "../data/countries";
import type { RevealStage } from "../hooks/useRevealTimer";

type FlagSlideProps = {
  item: CountryCard;
  stage: RevealStage;
  dragOffset: number;
};

export function FlagSlide({ item, stage, dragOffset }: FlagSlideProps) {
  return (
    <article
      className="flag-slide"
      style={{ transform: `translateY(${dragOffset}px)` }}
    >
      <div className="flag-slide__glow flag-slide__glow--one" />
      <div className="flag-slide__glow flag-slide__glow--two" />
      <div className="flag-slide__label">国旗めくり</div>
      <div className="flag-slide__flag" aria-label={item.countryName}>
        {item.flagEmoji}
      </div>
      <div className={`flag-slide__answer flag-slide__answer--${stage}`}>
        <p className="flag-slide__eyebrow">
          {stage === "hidden" ? "この国はどこ？" : "こたえ"}
        </p>
        <h1>{stage === "hidden" ? "?" : item.countryName}</h1>
        <div className="flag-slide__details" aria-live="polite">
          {stage !== "detail" ? (
            <span>数秒後に国名と補足を表示</span>
          ) : (
            <>
              <span>首都: {item.capital}</span>
              <span>地域: {item.region}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
