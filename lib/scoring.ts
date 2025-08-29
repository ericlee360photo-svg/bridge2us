import { M, pairCompatibility, type Lang } from './compatibility';

export function computeScores(answers: Array<{picked:'a'|'b', aLang:string, bLang:string}>) {
  const counts = { woa:0, aos:0, qt:0, rg:0, pt:0 };
  answers.forEach(x => { const k = (x.picked === 'a' ? x.aLang : x.bLang) as keyof typeof counts; counts[k]++; });
  const total = Object.values(counts).reduce((a,b)=>a+b,0) || 1;
  const to100 = (n:number)=> Math.round((n/total)*100);
  const scores = { woa:to100(counts.woa), aos:to100(counts.aos), qt:to100(counts.qt), rg:to100(counts.rg), pt:to100(counts.pt) };
  const ordered = Object.entries(scores).sort((a,b)=>b[1]-a[1]).map(([k])=>k);
  const map: Record<string,Lang> = {
    woa: 'words_of_affirmation', aos: 'acts_of_service', qt: 'quality_time', rg: 'receiving_gifts', pt: 'physical_touch'
  };
  return {
    scores,
    primary: map[ordered[0]],
    secondary: map[ordered[1]]
  };
}
