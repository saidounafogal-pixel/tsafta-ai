import { GraduationCap, FlaskConical, Wrench, Briefcase, ChevronRight, PlayCircle } from "lucide-react";
import { VIDEOS, image } from "../data/bibliotheque";
import { FORMATIONS, EQUIPEMENTS, LAB } from "../data/savoirs";
import { useEtat } from "../store";
import { Aller, EnTete, MotifTisse } from "../components/ui";

export default function Apprendre() {
  const { progression } = useEtat();
  const total = FORMATIONS.reduce((s, f) => s + f.lecons.length, 0);
  const faites = Object.values(progression).reduce((s, l) => s + l.length, 0);
  const pct = Math.round((faites / total) * 100);

  return (
    <div>
      <EnTete titre="Apprendre et entreprendre" sousTitre="De la première leçon à la première vente" />
      <div className="space-y-3 px-5">
        <Aller vers="/apprendre/academy" className="w-full relative block overflow-hidden rounded-hero bg-fleuve-700 p-6 text-white shadow-haut">
          <MotifTisse id="motif-acad" opacite={0.12} />
          <div className="relative">
            <span className="grid h-12 w-12 place-items-center rounded-tuile bg-white/15"><GraduationCap size={24} /></span>
            <h2 className="mt-5 text-[26px] font-bold leading-tight">Tsafta Academy</h2>
            <p className="mt-1.5 max-w-[280px] text-[15px] leading-relaxed text-gris-600">
              Vidéos, fiches illustrées et ateliers pratiques pour apprendre à transformer les déchets.
            </p>
            <div className="mt-6">
              <div className="flex justify-between text-[13px] font-semibold text-gris-600">
                <span>Votre progression</span>
                <span>{faites} sur {total} leçons</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-mil-500 transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
              </div>
            </div>
          </div>
        </Aller>

        {/* Bibliothèque vidéo */}
        <Aller vers="/apprendre/bibliotheque" className="carte block w-full overflow-hidden">
          <span className="grid grid-cols-3 gap-0.5">
            {VIDEOS.slice(0, 6).map((v) => (
              <span key={v.id} className="relative block aspect-video overflow-hidden">
                <img src={image(v.miniature)} alt="" loading="lazy" className="h-full w-full object-cover" />
              </span>
            ))}
          </span>
          <span className="flex items-center gap-3.5 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#2A1300] shadow-bouton" style={{ background: "linear-gradient(180deg,#FFB547,#F26D0F)" }}><PlayCircle size={22} /></span>
            <span className="min-w-0 flex-1">
              <span className="block text-[18px] font-extrabold">Bibliothèque vidéo</span>
              <span className="mt-0.5 block text-[13px] text-gris-500">{VIDEOS.length} vidéos : liège, papier, fibres, plastique, déco</span>
            </span>
            <ChevronRight size={20} className="text-gris-400" />
          </span>
        </Aller>

        <div className="grid grid-cols-2 gap-3">
          <Aller vers="/apprendre/lab" className="w-full relative overflow-hidden rounded-carte bg-indigo-900 p-5 text-white shadow-doux">
            <MotifTisse id="motif-lab" />
            <div className="relative">
              <span className="grid h-11 w-11 place-items-center rounded-tuile bg-white/10 text-mil-500"><FlaskConical size={22} /></span>
              <h3 className="mt-4 text-[19px] font-bold">Tsafta Lab</h3>
              <p className="mt-1 text-[13px] leading-snug text-indigo-300">Le potentiel économique de {LAB.length} matières</p>
            </div>
          </Aller>
          <Aller vers="/apprendre/equip" className="w-full rounded-carte bg-mil-100 p-5 shadow-doux">
            <span className="grid h-11 w-11 place-items-center rounded-tuile bg-mil-500 text-indigo-950"><Wrench size={22} /></span>
            <h3 className="mt-4 text-[19px] font-bold">Tsafta Equip</h3>
            <p className="mt-1 text-[13px] leading-snug text-mil-600">{EQUIPEMENTS.length} machines et outils référencés</p>
          </Aller>
        </div>

        <Aller vers="/atelier" className="w-full carte flex items-center gap-4 p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-tuile bg-indigo-50 text-encre"><Briefcase size={22} /></span>
          <span className="flex-1">
            <span className="block font-display text-[18px] font-bold">Mon atelier</span>
            <span className="mt-0.5 block text-[14px] text-gris-500">Ventes, dépenses et bénéfice de votre micro-entreprise</span>
          </span>
          <ChevronRight size={20} className="text-gris-400" />
        </Aller>

        <section className="pt-5">
          <h2 className="titre-section">Le parcours d'un entrepreneur</h2>
          <ol className="carte mt-3 p-5">
            {[
              ["Se former", "Choisir une technique dans Academy et la pratiquer."],
              ["Étudier la filière", "Estimer coûts, matériel et revenus dans Lab."],
              ["S'équiper", "Trouver machines et outils dans Equip."],
              ["S'approvisionner", "Acheter la matière première sur le Market."],
              ["Vendre", "Publier ses produits et suivre ses comptes."],
            ].map(([t, d], i, tab) => (
              <li key={t} className="flex gap-4">
                <span className="flex flex-col items-center">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-indigo-900 font-display text-[14px] font-bold text-mil-500">{i + 1}</span>
                  {i < tab.length - 1 && <span className="w-px flex-1 bg-gris-200" />}
                </span>
                <span className={i < tab.length - 1 ? "pb-5" : ""}>
                  <span className="block pt-1 text-[15px] font-semibold">{t}</span>
                  <span className="mt-0.5 block text-[14px] text-gris-500">{d}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
