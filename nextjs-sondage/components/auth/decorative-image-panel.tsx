import { GlassPanel } from "@/components/ui/glass-panel";

const DECORATIVE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDzGUHKv0qChVJYRHW4LSC79lG-Fw9Y0XWcR8djPnLMu9qHe5S-TVJo-7chFvm3YgSWAMhI12qz7bjg2gM273s6RZ2crZ-80mxM4wDfACLrX93UCa58ZLvOjc-arn1MLWW4Hs7_4byjEmB6e62yrEFtPgO_HZt6OtcvpxWktNdY7QnQo35Cp51R_E0HCYz6uIQlGUo_9WscZJrW0B45egH67OTEOrXG7cT0cL04Wr7GhxkepLZ22w_9IfL93yr3lHCPm_zru9DJzEhu";

/** Balise img native : évite le serveur d’optimisation Next (souvent fragile en standalone / Docker). */
export function DecorativeImagePanel() {
  return (
    <div className="pointer-events-none fixed bottom-10 right-10 z-0 hidden aspect-square w-[320px] lg:block">
      <GlassPanel className="h-full w-full p-1">
        <div className="relative h-full w-full overflow-hidden rounded-lg">
          <img
            src={DECORATIVE_IMAGE}
            alt=""
            className="h-full w-full rounded-lg object-cover grayscale opacity-40 mix-blend-multiply"
            loading="lazy"
            decoding="async"
          />
        </div>
      </GlassPanel>
    </div>
  );
}
