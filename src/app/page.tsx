import Section from "@/components/Section";

export default function Home() {
  return (
    <>
      <Section id="hero" className="bg-black/30 min-h-[60vh] section">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            Waxing Crescent - Hero
          </h1>
          <p className="text-lg opacity-80">
            I build interactive things on the web.
          </p>
        </div>
      </Section>
      <Section id="contact" className="min-h-[60vh] bg-black/30 section">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Contact</h2>
          <p className="opacity-80">Drop a message — I reply fast ✉️</p>
        </div>
      </Section>

      <Section id="contact" className="min-h-[60vh] bg-black/30 section">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4">Contact</h2>
          <p className="opacity-80">Drop a message — I reply fast ✉️</p>
        </div>
      </Section>
    </>
  );
}
