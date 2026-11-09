export const utmKeys=['utm_source','utm_medium','utm_campaign','utm_term','utm_content'] as const;
export const storageKey='elevated.forms.attribution.v1';
export const ttl=30*24*60*60*1000;
export function touch(href:string,referrer:string) {
  const url=new URL(href), safe=new URL(url.origin+url.pathname);
  for (const key of utmKeys) if(url.searchParams.has(key)) safe.searchParams.set(key,url.searchParams.get(key)!.slice(0,255));
  let ref=''; try {const r=new URL(referrer); if(['http:','https:'].includes(r.protocol)) ref=r.origin+r.pathname;} catch {}
  return {source:url.pathname.slice(0,200),landing_page:safe.href.slice(0,2048),referrer:ref.slice(0,2048),...Object.fromEntries(utmKeys.map(key=>[key,(url.searchParams.get(key)||'').slice(0,255)]))};
}
export function capture(href:string,referrer:string,storage?:Pick<Storage,'getItem'|'setItem'>,now=Date.now()) {
  const current=touch(href,referrer);
  try {
    const saved=JSON.parse(storage?.getItem(storageKey)||'null');
    if(saved && now-saved.at>=0 && now-saved.at<ttl && saved.touch && Object.keys(current).every(key=>typeof saved.touch[key]==='string')) return {first_touch:saved.touch,submission_touch:current};
    storage?.setItem(storageKey,JSON.stringify({at:now,touch:current}));
  } catch {}
  return {first_touch:current,submission_touch:current};
}
let memory: ReturnType<typeof capture>['first_touch'] | undefined;
export function browserAttribution() {
  let storage:Storage|undefined; try {storage=window.localStorage;} catch {}
  const value=capture(location.href,document.referrer,storage);
  memory ||= value.first_touch;
  return {...value,first_touch:memory};
}
