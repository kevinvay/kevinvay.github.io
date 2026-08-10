"use client";

import { useEffect, useRef, useState } from "react";

const stops = [
  { title: "Experience.", description: "请使用键盘左右方向键控制", cloud: "cloud-top", pipe: "pipe-short" },
  { title: "Sogou - UI Designer Intern", date: "2016.10 - 2017.04", description: "承担QQ输入法产品UI设计及相关运营设计等工作", cloud: "cloud-bottom", pipe: "pipe-short" },
  { title: "AIUX - Visual Experience Designer", date: "2017.07 - 2018.03", description: "承担公司对外服务产品UI设计及方案输出工作", cloud: "cloud-top", pipe: "pipe-medium" },
  { title: "Full Truck Alliance - UI Designer", date: "2018.03 - 2019.03", description: "承担公司产品UI设计及相关运营设计等工作", cloud: "cloud-bottom", pipe: "pipe-tall" },
  { title: "TravelSky - UI Designer", date: "2019.04 - 至今", description: "承担公司对外服务产品UI设计工作，目前完善团队设计系统，并制定使用指南和教育设计团队", cloud: "cloud-top", pipe: "pipe-medium" },
  { title: "我一直在赶路中……", description: "期待与您一起进行完成下一个阶段的故事" },
];

export function ExperienceGame() {
  const [step, setStep] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const melodyTimerRef = useRef<number | null>(null);

  const stopMusic = () => {
    if (melodyTimerRef.current !== null) window.clearInterval(melodyTimerRef.current);
    melodyTimerRef.current = null;
    void audioRef.current?.close();
    audioRef.current = null;
  };

  const toggleMusic = () => {
    if (soundOn) {
      stopMusic();
      setSoundOn(false);
      return;
    }

    const audio = new AudioContext();
    const notes = [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 349.23];
    let note = 0;
    const playNote = () => {
      const oscillator = audio.createOscillator();
      const gain = audio.createGain();
      const now = audio.currentTime;
      oscillator.type = "square";
      oscillator.frequency.value = notes[note % notes.length];
      gain.gain.setValueAtTime(.022, now);
      gain.gain.exponentialRampToValueAtTime(.001, now + .26);
      oscillator.connect(gain).connect(audio.destination);
      oscillator.start(now);
      oscillator.stop(now + .27);
      note += 1;
    };

    audioRef.current = audio;
    void audio.resume().then(playNote);
    melodyTimerRef.current = window.setInterval(playNote, 360);
    setSoundOn(true);
  };

  useEffect(() => {
    const move = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") setStep((value) => Math.min(stops.length - 1, value + 1));
      if (event.key === "ArrowLeft") setStep((value) => Math.max(0, value - 1));
    };
    window.addEventListener("keydown", move);
    return () => window.removeEventListener("keydown", move);
  }, []);

  useEffect(() => () => stopMusic(), []);

  return (
    <main className="experience-game-page">
      <section className="experience-device" aria-label="Kevin Wu experience timeline">
        <div className="experience-screen">
          <div className="experience-world" style={{ transform: `translateX(-${step * (100 / stops.length)}%)` }}>
            {stops.map((stop, index) => (
              <article className="experience-stop" key={stop.title}>
                <div className="game-ground" aria-hidden="true" />
                {index === 0 && (
                  <a className="game-back" href="/about" aria-label="Back to about">
                    <img src="/figma-assets/inner/game-back.png" alt="" />
                  </a>
                )}
                {stop.cloud && <img className={`game-cloud ${stop.cloud}`} src="/figma-assets/inner/game-cloud.png" alt="" aria-hidden="true" />}
                {stop.pipe && <div className={`game-layout-pipe ${stop.pipe}`} aria-hidden="true"><i /><b /></div>}
                {stop.date && <div className="game-date">{stop.date}</div>}
                {index === stops.length - 1 && (
                  <a className="game-contact-link" href="/contact">
                    <i className="game-contact-hand" aria-hidden="true">
                      {Array.from({ length: 12 }, (_, pixel) => <b key={pixel} />)}
                    </i>
                    <span>Let&apos;s Talk!</span>
                  </a>
                )}
                <h2 className={index === 0 ? "game-intro-title" : "game-scene-title"}>{stop.title}</h2>
                <p className="game-scene-description">{stop.description}</p>
              </article>
            ))}
          </div>
          <span className="game-bird" aria-hidden="true" />
          <button
            className="game-sound"
            type="button"
            aria-label={soundOn ? "Turn background music off" : "Turn background music on"}
            aria-pressed={soundOn}
            onClick={toggleMusic}
          >
            <img
              className="game-sound-icon"
              src={soundOn
                ? "/figma-assets/inner/game-sound-on.gif"
                : "/figma-assets/inner/game-sound-off.png"}
              alt=""
            />
          </button>
          <nav className="game-controls" aria-label="Experience navigation">
            <button onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} aria-label="Previous experience">←</button>
            <button onClick={() => setStep((value) => Math.min(stops.length - 1, value + 1))} disabled={step === stops.length - 1} aria-label="Next experience">→</button>
          </nav>
        </div>
      </section>
    </main>
  );
}
