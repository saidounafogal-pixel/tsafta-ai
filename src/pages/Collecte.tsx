import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, MapPin, Star, Clock, Check, Minus, Plus, Scale, Inbox, Sparkles, ChevronRight, Receipt } from "lucide-react";
import { COLLECTEURS, DESTINATIONS, MATIERES, QUARTIERS, fcfa, kg, matiere, type MatiereId } from "../data/donnees";
import { useEtat, type Demande } from "../store";
import { Aller, EnTete, Feuille, IconeMatiere, PastilleMatiere, Segments, Toast, EtatVide } from "../components/ui";

/* ------------------------------------------------------------------
   Identification de la matière.
   Prototype : analyse des couleurs dominantes de la photo sur l'appareil.
   À remplacer par un modèle de vision entraîné sur des déchets nigériens.
------------------------------------------------------------------- */
async function analyserPhoto(dataUrl: string): Promise<{ id: MatiereId; confiance: number }[]> {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = c.height = 48;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 48, 48);
  const px = ctx.getImageData(0, 0, 48, 48).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < px.length; i += 4) { r += px[i]; g += px[i + 1]; b += px[i + 2]; }
  const n = px.length / 4;
  r /= n; g /= n; b /= n;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const scores: Record<MatiereId, number> = {
    pet: b > r && sat > 0.08 ? 3 : 1.2,
    pehd: sat < 0.12 && max > 170 ? 2.4 : 1,
    papier: r > b + 15 && g > b ? 2.6 : 1,
    metal: sat < 0.1 && max < 170 ? 2.8 : 0.9,
    fibres: r > b + 25 && g > b + 15 && sat > 0.25 ? 2.7 : 0.8,
    organique: g > r && g > b ? 3 : 0.8,
    verre: g > r && b > r && sat < 0.3 ? 1.8 : 0.7,
  };
  const somme = Object.values(scores).reduce((s, v) => s + v, 0);
  return (Object.entries(scores) as [MatiereId, number][])
    .map(([id, v]) => ({ id, confiance: v / somme }))
    .sort((a, b) => b.confiance - a.confiance);
}

/* Réduit la photo pour l'analyse. Ne bloque jamais : en cas d'échec, renvoie null. */
function reduire(fichier: File): Promise<string | null> {
  return new Promise((ok) => {
    const fin = setTimeout(() => ok(null), 8000);
    const finir = (v: string | null) => { clearTimeout(fin); ok(v); };
    const lecteur = new FileReader();
    lecteur.onerror = () => finir(null);
    lecteur.onload = () => {
      const img = new Image();
      img.onerror = () => finir(null);
      img.onload = () => {
        try {
          const c = document.createElement("canvas");
          const k = Math.min(1, 640 / Math.max(img.width, img.height));
          c.width = Math.round(img.width * k);
          c.height = Math.round(img.height * k);
          c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
          finir(c.toDataURL("image/jpeg", 0.8));
        } catch {
          finir(null);
        }
      };
      img.src = lecteur.result as string;
    };
    lecteur.readAsDataURL(fichier);
  });
}

function Etapes({ actuelle }: { actuelle: number }) {
  const noms = ["Photo", "Matière", "Collecteur", "Envoi"];
  return (
    <ol className="flex items-center gap-2" aria-label="Étapes">
      {noms.map((n, i) => (
        <li key={n} className="flex flex-1 flex-col gap-1.5">
          <span className={`h-1 rounded-full transition-colors ${i <= actuelle ? "bg-menthe shadow-[0_0_10px_rgba(69,224,160,0.7)]" : "bg-white/10"}`} />
          <span className={`text-[11px] font-semibold ${i === actuelle ? "text-encre" : "text-gris-400"}`}>{n}</span>
        </li>
      ))}
    </ol>
  );
}

function Compteur({ valeur, changer, pas = 1, unite }: { valeur: number; changer: (v: number) => void; pas?: number; unite: string }) {
  return (
    <div className="flex items-center justify-between rounded-tuile bg-white/[.05] p-1.5">
      <button aria-label="Diminuer" onClick={() => changer(Math.max(pas, +(valeur - pas).toFixed(1)))} className="grid h-11 w-11 place-items-center rounded-[10px] bg-verre shadow-doux">
        <Minus size={18} />
      </button>
      <span className="chiffre text-[22px]">
        {valeur.toLocaleString("fr-FR")} <span className="text-[15px] font-semibold text-gris-500">{unite}</span>
      </span>
      <button aria-label="Augmenter" onClick={() => changer(+(valeur + pas).toFixed(1))} className="grid h-11 w-11 place-items-center rounded-[10px] bg-verre shadow-doux">
        <Plus size={18} />
      </button>
    </div>
  );
}

/* ---------------- Parcours citoyen ---------------- */

function ParcoursCitoyen({ notifier }: { notifier: (m: string) => void }) {
  const { ajouterDemande, demandes } = useEtat();
  const [etape, setEtape] = useState(0);
  const [photo, setPhoto] = useState<string>();
  const [analyse, setAnalyse] = useState<{ id: MatiereId; confiance: number }[] | null>(null);
  const [mat, setMat] = useState<MatiereId>("pet");
  const [poids, setPoids] = useState(5);
  const [quartier, setQuartier] = useState("Lazaret");
  const [collecteurId, setCollecteurId] = useState<string>();
  const camera = useRef<HTMLInputElement>(null);
  const galerie = useRef<HTMLInputElement>(null);

  const choisirFichier = async (f?: File) => {
    if (!f) return;
    setAnalyse(null);
    setEtape(1);
    const url = await reduire(f);
    if (!url) {
      // Photo illisible sur cet appareil : on passe au choix manuel.
      setPhoto(undefined);
      setAnalyse([]);
      return;
    }
    setPhoto(url);
    try {
      const [res] = await Promise.all([analyserPhoto(url), new Promise((r) => setTimeout(r, 1800))]);
      setAnalyse(res);
      setMat(res[0].id);
    } catch {
      setAnalyse([]);
    }
  };

  const sansPhoto = () => {
    setPhoto(undefined);
    setAnalyse([]);
    setEtape(1);
  };

  const proches = COLLECTEURS.filter((c) => c.matieres.includes(mat)).sort((a, b) => a.distanceKm - b.distanceKm);
  const choisi = COLLECTEURS.find((c) => c.id === collecteurId);
  const m = matiere(mat);

  const envoyer = () => {
    if (!choisi) return;
    ajouterDemande({ matiere: mat, poidsEstimeKg: poids, quartier, collecteurId: choisi.id, collecteurNom: choisi.nom, photo });
    notifier("Demande de collecte envoyée");
    setEtape(0);
    setPhoto(undefined);
    setAnalyse(null);
    setCollecteurId(undefined);
  };

  return (
    <div className="space-y-5">
      <Etapes actuelle={etape} />

      {etape === 0 && (
        <>
          {/* Viseur de scan */}
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-hero shadow-haut" style={{ background: "radial-gradient(70% 55% at 50% 45%, #2C7A5A 0%, #164A37 45%, #0A2219 100%)" }}>
            <div className="absolute inset-0 opacity-40" style={{ background: "repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 14px)" }} aria-hidden="true" />
            <div className="absolute left-1/2 top-[12%] h-[48%] w-[68%] -translate-x-1/2" aria-hidden="true">
              {["left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-[22px]", "right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-[22px]", "left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-[22px]", "right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-[22px]"].map((c) => (
                <span key={c} className={`absolute h-12 w-12 border-white ${c}`} />
              ))}
              <span className="absolute inset-x-3 h-0.5 animate-balayer rounded-full bg-menthe shadow-[0_0_18px_4px_rgba(69,224,160,0.6)]" />
              <span className="absolute inset-0 grid place-items-center text-[64px] opacity-80">🧴</span>
            </div>
            <p className="absolute inset-x-8 bottom-[25%] text-center text-[14px] font-semibold leading-snug text-white/90">
              Cadrez vos déchets et prenez la photo. L'IA reconnaît la matière.
            </p>
            <div className="absolute inset-x-0 bottom-6 flex justify-center">
              <button onClick={() => camera.current?.click()} aria-label="Prendre la photo" className="grid h-[78px] w-[78px] place-items-center rounded-full border-[4px] border-white/90 transition active:scale-95">
                <span className="h-[60px] w-[60px] rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.45)]" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => galerie.current?.click()} className="btn-doux"><ImagePlus size={18} /> Galerie</button>
            <button onClick={sansPhoto} className="btn-doux">Sans photo</button>
          </div>
          <input ref={camera} type="file" accept="image/*" className="hidden" onChange={(e) => choisirFichier(e.target.files?.[0])} />
          <input ref={galerie} type="file" accept="image/*" className="hidden" onChange={(e) => choisirFichier(e.target.files?.[0])} />
        </>
      )}

      {etape === 1 && (
        <>
          {photo && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-hero bg-indigo-900">
              <img src={photo} alt="Vos déchets" className="h-full w-full object-cover" />
              {!analyse && (
                <>
                  <div className="absolute inset-0 bg-indigo-950/40" />
                  <div className="absolute inset-x-6 h-0.5 animate-balayer bg-mil-500 shadow-[0_0_24px_4px_rgba(232,176,74,.7)]" />
                  <div className="absolute inset-x-0 bottom-5 flex justify-center">
                    <span className="flex items-center gap-2 rounded-full bg-indigo-950/80 px-4 py-2 text-[14px] font-semibold text-white backdrop-blur">
                      <Sparkles size={16} className="text-mil-500" /> Analyse en cours
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {analyse && (
            <div className="carte p-5">
              {analyse.length > 0 ? (
                <div className="flex items-center gap-3.5">
                  <IconeMatiere id={analyse[0].id} taille={52} />
                  <div className="flex-1">
                    <p className="flex items-center gap-1.5 text-[13px] font-semibold text-menthe">
                      <Sparkles size={14} /> Matière détectée
                    </p>
                    <p className="font-display text-[20px] font-bold">{matiere(analyse[0].id).nom}</p>
                  </div>
                  <span className={`puce ${analyse[0].confiance > 0.22 ? "bg-fleuve-100 text-menthe" : "bg-mil-100 text-mil-600"}`}>
                    {analyse[0].confiance > 0.22 ? "Fiable" : "À vérifier"}
                  </span>
                </div>
              ) : (
                <p className="font-display text-[18px] font-bold">Quelle matière souhaitez-vous faire collecter ?</p>
              )}

              <p className="etiquette mt-5">{analyse.length > 0 ? "Corriger si besoin" : "Choisissez la matière"}</p>
              <div className="flex flex-wrap gap-2">
                {MATIERES.map((x) => (
                  <button
                    key={x.id}
                    onClick={() => setMat(x.id)}
                    className="filtre"
                    style={mat === x.id ? { background: x.teinte, borderColor: x.teinte, color: "#06140F" } : { borderColor: "rgba(255,255,255,0.1)", color: "#B4C7BD", background: "rgba(255,255,255,0.065)" }}
                  >
                    {x.emoji} {x.nom}
                  </button>
                ))}
              </div>

              <p className="mt-4 rounded-tuile p-3.5 text-[14px] leading-relaxed" style={{ background: m.fond, color: m.teinte }}>
                {m.conseil}
              </p>

              <p className="etiquette mt-5">Poids estimé</p>
              <Compteur valeur={poids} changer={setPoids} unite="kg" />
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-[14px] text-gris-500">Valeur indicative</span>
                <span className="chiffre text-[22px] text-menthe">{fcfa(poids * m.prixKg)}</span>
              </div>
            </div>
          )}

          {analyse && (
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <button className="btn-doux" onClick={() => setEtape(0)}>Reprendre</button>
              <button className="btn-action" onClick={() => setEtape(2)}>Trouver un collecteur</button>
            </div>
          )}
        </>
      )}

      {etape === 2 && (
        <>
          <div>
            <label className="etiquette" htmlFor="quartier">Votre quartier</label>
            <select id="quartier" className="champ" value={quartier} onChange={(e) => setQuartier(e.target.value)}>
              {QUARTIERS.map((q) => <option key={q}>{q}</option>)}
            </select>
          </div>
          <p className="text-[14px] text-gris-500">
            {proches.length} collecteurs acceptent <span className="font-semibold text-encre">{m.nom.toLowerCase()}</span>
          </p>
          <div className="space-y-3">
            {proches.map((c) => {
              const actif = c.id === collecteurId;
              return (
                <button
                  key={c.id}
                  onClick={() => setCollecteurId(c.id)}
                  className={`carte flex w-full items-center gap-3.5 p-4 text-left ring-2 transition ${actif ? "ring-menthe" : "ring-transparent"}`}
                >
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-tuile font-display text-[17px] font-bold ${actif ? "bg-menthe text-menthe-fonce" : "bg-indigo-50 text-encre"}`}>
                    {actif ? <Check size={22} /> : c.nom[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold">{c.nom}</span>
                    <span className="mt-0.5 flex items-center gap-3 text-[13px] text-gris-500">
                      <span className="flex items-center gap-1"><MapPin size={13} /> {c.distanceKm.toLocaleString("fr-FR")} km</span>
                      <span className="flex items-center gap-1"><Star size={13} className="fill-mil-500 text-mil-500" /> {c.note.toFixed(1)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[12px] text-gris-400"><Clock size={12} /> {c.horaires}</span>
                  </span>
                  <span className="puce bg-indigo-50 text-indigo-700">{c.type}</span>
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button className="btn-doux" onClick={() => setEtape(1)}>Retour</button>
            <button className="btn-action" disabled={!choisi} onClick={() => setEtape(3)}>Continuer</button>
          </div>
        </>
      )}

      {etape === 3 && choisi && (
        <>
          <div className="carte overflow-hidden">
            {photo && <img src={photo} alt="" className="h-40 w-full object-cover" />}
            <dl className="divide-y divide-gris-100 px-5">
              {[
                ["Matière", <PastilleMatiere key="m" id={mat} />],
                ["Poids estimé", kg(poids)],
                ["Collecteur", choisi.nom],
                ["Quartier", quartier],
                ["Valeur indicative", <span key="v" className="chiffre text-menthe">{fcfa(poids * m.prixKg)}</span>],
              ].map(([k, v]) => (
                <div key={k as string} className="flex items-center justify-between py-3.5 text-[15px]">
                  <dt className="text-gris-500">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <p className="px-1 text-[13px] leading-relaxed text-gris-500">
            Le collecteur pèse vos déchets à son arrivée. Le montant final dépend du poids réel et de la qualité du tri.
          </p>
          <div className="grid grid-cols-[auto_1fr] gap-3">
            <button className="btn-doux" onClick={() => setEtape(2)}>Retour</button>
            <button className="btn-action" onClick={envoyer}>Envoyer la demande</button>
          </div>
        </>
      )}

      {etape === 0 && demandes.length > 0 && (
        <section>
          <h2 className="titre-section mb-3">Mes demandes</h2>
          <div className="carte divide-y divide-gris-100">
            {demandes.map((d) => (
              <div key={d.id} className="flex items-center gap-3.5 p-4">
                <IconeMatiere id={d.matiere} taille={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold">{d.collecteurNom}</p>
                  <p className="text-[13px] text-gris-500">{kg(d.poidsEstimeKg)} estimés</p>
                </div>
                <span className={`puce ${d.statut === "collectee" ? "bg-fleuve-100 text-menthe" : "bg-mil-100 text-mil-600"}`}>
                  {d.statut === "collectee" ? "Collectée" : "En attente"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------- Espace collecteur ---------------- */

interface Recu { id: string; matiere: MatiereId; poids: number; montant: number; destination: string }

function EspaceCollecteur({ notifier }: { notifier: (m: string) => void }) {
  const { demandes, validerCollecte, transactions } = useEtat();
  const [pesee, setPesee] = useState<{ demande: Demande | null } | null>(null);
  const [mat, setMat] = useState<MatiereId>("pet");
  const [poids, setPoids] = useState(10);
  const [prix, setPrix] = useState(100);
  const [quartier, setQuartier] = useState("Lazaret");
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [recu, setRecu] = useState<Recu | null>(null);

  const ouvrir = (d: Demande | null) => {
    setPesee({ demande: d });
    const id = d?.matiere ?? "pet";
    setMat(id);
    setPrix(matiere(id).prixKg);
    setPoids(d?.poidsEstimeKg ?? 10);
    setQuartier(d?.quartier ?? "Lazaret");
  };

  const enregistrer = () => {
    const id = validerCollecte(pesee?.demande?.id ?? null, {
      matiere: mat, poidsKg: poids, prixKg: prix, collecteur: "Moi (collecteur)", quartier, destination,
    });
    setPesee(null);
    setRecu({ id, matiere: mat, poids, montant: poids * prix, destination });
    notifier("Transaction enregistrée");
  };

  const enAttente = demandes.filter((d) => d.statut === "en_attente");
  const miennes = transactions.filter((t) => t.collecteur === "Moi (collecteur)");
  const totalJour = miennes.reduce((s, t) => s + t.poidsKg, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="carte p-4">
          <p className="text-[13px] text-gris-500">Pesé par vous</p>
          <p className="chiffre mt-1 text-[24px]">{kg(totalJour)}</p>
        </div>
        <div className="carte p-4">
          <p className="text-[13px] text-gris-500">Demandes</p>
          <p className="chiffre mt-1 text-[24px]">{enAttente.length}</p>
        </div>
      </div>

      <button onClick={() => ouvrir(null)} className="btn-action w-full">
        <Scale size={19} /> Nouvelle pesée
      </button>

      <section>
        <h2 className="titre-section mb-3">Demandes à collecter</h2>
        {enAttente.length === 0 ? (
          <EtatVide
            icone={<Inbox size={24} />}
            titre="Aucune demande pour le moment"
            texte="Les demandes envoyées par les citoyens apparaissent ici. Testez en passant en mode Citoyen."
          />
        ) : (
          <div className="carte divide-y divide-gris-100">
            {enAttente.map((d) => (
              <button key={d.id} onClick={() => ouvrir(d)} className="flex w-full items-center gap-3.5 p-4 text-left">
                {d.photo ? <img src={d.photo} alt="" className="h-12 w-12 rounded-tuile object-cover" /> : <IconeMatiere id={d.matiere} taille={48} />}
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold">{matiere(d.matiere).nom}</p>
                  <p className="text-[13px] text-gris-500">{kg(d.poidsEstimeKg)} estimés, {d.quartier}</p>
                </div>
                <ChevronRight size={18} className="text-gris-400" />
              </button>
            ))}
          </div>
        )}
      </section>

      <Feuille ouvert={!!pesee} fermer={() => setPesee(null)} titre="Peser et enregistrer">
        <div className="rounded-carte bg-indigo-900 p-5 text-center">
          <p className="text-[13px] font-medium text-indigo-300">Poids mesuré</p>
          <p className="chiffre mt-1 text-[52px] leading-none text-mil-500">{poids.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}</p>
          <p className="mt-1 text-[14px] font-semibold text-indigo-300">kilogrammes</p>
        </div>
        <div className="mt-4">
          <Compteur valeur={poids} changer={setPoids} pas={0.5} unite="kg" />
        </div>
        <p className="etiquette mt-5">Matière</p>
        <div className="flex flex-wrap gap-2">
          {MATIERES.map((x) => (
            <button
              key={x.id}
              onClick={() => { setMat(x.id); setPrix(x.prixKg); }}
              className="filtre"
              style={mat === x.id ? { background: x.teinte, borderColor: x.teinte, color: "#06140F" } : { borderColor: "rgba(255,255,255,0.1)", color: "#B4C7BD", background: "rgba(255,255,255,0.065)" }}
            >
              {x.emoji} {x.nom}
            </button>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="etiquette" htmlFor="prix">Prix payé (FCFA/kg)</label>
            <input id="prix" type="number" inputMode="numeric" className="champ" value={prix} onChange={(e) => setPrix(+e.target.value || 0)} />
          </div>
          <div>
            <label className="etiquette" htmlFor="q2">Quartier</label>
            <select id="q2" className="champ" value={quartier} onChange={(e) => setQuartier(e.target.value)}>
              {QUARTIERS.map((q) => <option key={q}>{q}</option>)}
            </select>
          </div>
        </div>
        <label className="etiquette mt-4" htmlFor="dest">Destination de la matière</label>
        <select id="dest" className="champ" value={destination} onChange={(e) => setDestination(e.target.value)}>
          {DESTINATIONS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <div className="mt-5 flex items-baseline justify-between">
          <span className="text-[15px] text-gris-500">À payer au citoyen</span>
          <span className="chiffre text-[26px] text-menthe">{fcfa(poids * prix)}</span>
        </div>
        <button className="btn-action mt-5 w-full" onClick={enregistrer}>Enregistrer la transaction</button>
      </Feuille>

      <Feuille ouvert={!!recu} fermer={() => setRecu(null)} titre="Reçu de collecte">
        {recu && (
          <div className="rounded-carte border border-dashed border-gris-200 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-fleuve-100 text-menthe"><Receipt size={20} /></span>
              <div>
                <p className="text-[13px] text-gris-500">Code de traçabilité</p>
                <p className="chiffre text-[20px]">TSF-{recu.id}</p>
              </div>
            </div>
            <dl className="mt-4 space-y-2.5 text-[15px]">
              <div className="flex justify-between"><dt className="text-gris-500">Matière</dt><dd className="font-semibold">{matiere(recu.matiere).nom}</dd></div>
              <div className="flex justify-between"><dt className="text-gris-500">Poids</dt><dd className="font-semibold">{kg(recu.poids)}</dd></div>
              <div className="flex justify-between gap-6"><dt className="text-gris-500">Destination</dt><dd className="text-right font-semibold">{recu.destination}</dd></div>
              <div className="flex justify-between border-t border-gris-100 pt-3"><dt className="text-gris-500">Montant</dt><dd className="chiffre text-[20px] text-menthe">{fcfa(recu.montant)}</dd></div>
            </dl>
            <Aller vers="/suivi" className="btn-doux mt-5 w-full">Voir dans le suivi</Aller>
          </div>
        )}
      </Feuille>
    </div>
  );
}

export default function Collecte() {
  const { profil } = useEtat();
  const [vue, setVue] = useState<"citoyen" | "collecteur">(profil === "collecteur" ? "collecteur" : "citoyen");
  const [toast, setToast] = useState<string | null>(null);
  const fermerToast = useCallback(() => setToast(null), []);
  useEffect(() => setVue(profil === "collecteur" ? "collecteur" : "citoyen"), [profil]);

  return (
    <div>
      <EnTete titre="Collecte" sousTitre="Photographier, identifier, faire collecter" />
      <div className="space-y-5 px-5">
        <Segments
          options={[{ id: "citoyen", label: "Je fais collecter" }, { id: "collecteur", label: "Je collecte" }]}
          valeur={vue}
          changer={setVue}
        />
        {vue === "citoyen" ? <ParcoursCitoyen notifier={setToast} /> : <EspaceCollecteur notifier={setToast} />}
      </div>
      <Toast message={toast} fermer={fermerToast} />
    </div>
  );
}
