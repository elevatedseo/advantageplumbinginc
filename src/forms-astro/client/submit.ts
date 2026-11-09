import {browserAttribution} from './attribution.ts';
type Turnstile={render:(el:HTMLElement,options:Record<string,unknown>)=>string;reset:(id:string)=>void;getResponse:(id:string)=>string};
declare global {interface Window {turnstile?:Turnstile}}
let loading:Promise<Turnstile>|undefined;
function loadTurnstile() {
  return loading ||= new Promise<Turnstile>((resolve,reject)=>{
    const resolveWhenLoaded=()=>window.turnstile?.render ? resolve(window.turnstile) : reject(new Error('Verification API unavailable.'));
    if(window.turnstile?.render) return resolve(window.turnstile);
    const existing=document.getElementById('elevated-turnstile-api') as HTMLScriptElement | null;
    const script=existing || document.createElement('script');
    script.id='elevated-turnstile-api';
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async=true;
    script.defer=true;
    script.addEventListener('load',resolveWhenLoaded,{once:true});
    script.addEventListener('error',()=>reject(new Error('Verification script could not load. Please reload the page.')),{once:true});
    if(!existing) document.head.appendChild(script);
  });
}
// Reuse the ID for an unchanged logical submission, including after network failures.
export function submissionIdentity(previous:{fields:string;id:string}|undefined,fields:unknown,uuid=()=>crypto.randomUUID()) {
  const value=JSON.stringify(fields); return previous?.fields===value ? previous : {fields:value,id:uuid()};
}
export function initializeForms() {
  for(const form of document.querySelectorAll<HTMLFormElement>('[data-elevated-form][data-endpoint]')) {
    if(form.dataset.initialized) continue;
    form.dataset.initialized='true';
    const note=form.querySelector<HTMLElement>('[role="status"]')!;
    const button=form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    let widget:string|undefined,api:Turnstile|undefined,token:string|undefined,identity:ReturnType<typeof submissionIdentity>|undefined,attribution:ReturnType<typeof browserAttribution>|undefined;
    const clearToken=()=>{token=undefined;};
    let sending=false,completed=false;
    const showStatus=(message:string,focus=false)=>{
      note.textContent=message;
      if(focus) note.focus();
    };
    button.disabled=true;
    loadTurnstile().then(value=>{
      api=value;
      const el=form.querySelector<HTMLElement>('[data-turnstile]')!;
      const storeSuccessToken=(value:unknown)=>{
        if(sending || completed) return;
        if(typeof value === 'string' && value.length > 0) {
          token=value;
          button.disabled=false;
          showStatus('Verification complete. You can send your request.');
        }
        else clearToken();
      };
      if (el.classList.contains('cf-turnstile')) throw new Error('Turnstile container must use explicit rendering only.');
      widget=api.render(el,{
        sitekey:el.dataset.sitekey,
        action:'lead',
        execution:'render',
        appearance:'always',
        // Fireplace's existing contact card is narrower than 300px on small screens.
        size:'compact',
        callback:storeSuccessToken,
        'expired-callback':()=>{clearToken();if(!button.disabled) showStatus('Verification expired. Please complete it again.');},
        'timeout-callback':()=>{clearToken();if(!button.disabled) showStatus('Verification timed out. Please complete it again.');},
        'error-callback':(code:string)=>{
          clearToken();if(sending || completed) return;
          if(['110100','110110','110200','400020','400070'].includes(code)) {
            button.disabled=true;
            showStatus('Verification is unavailable. Please call 402-505-9888 or email andrew@elevatedseo.com.');
          } else showStatus('Verification could not complete. Please retry, reload the page, or use the phone/email links in this form.');
        },
      });
      button.disabled=false;
      showStatus('Please complete the verification before sending.');
    }).catch(()=>{showStatus('Secure verification could not load. Please reload the page or use the phone/email links in this form.');});
    form.addEventListener('submit',async event=>{
      event.preventDefault(); if(button.disabled || !form.reportValidity()) return;
      if(!api || widget===undefined || !(token || api.getResponse(widget))) {
        showStatus('Please complete the verification.',true); return;
      }
      button.disabled=true;
      sending=true;
      form.setAttribute('aria-busy','true');
      try {
        if(!api || widget===undefined) throw new Error('Please complete the verification.');
        const turnstileToken=token || api.getResponse(widget);
        if(!turnstileToken) throw new Error('Please complete the verification.');
        const raw=Object.fromEntries(new FormData(form));
        // Autofill can populate the off-screen trap; keep it for direct requests only.
        delete raw.companyWebsite;
        const fields=Object.fromEntries(['name','email','company','industry','website','goal'].filter(key=>key in raw).map(key=>[key,String(raw[key]).trim()]));
        const next=submissionIdentity(identity,fields); if(next!==identity) attribution=browserAttribution(); identity=next;
        note.textContent='Sending your request…';
        const response=await fetch(form.dataset.endpoint!,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({schema_version:1,submission_id:identity.id,fields,attribution,companyWebsite:String(raw.companyWebsite||''),turnstile_token:turnstileToken}),signal:AbortSignal.timeout(20000)});
        const result=await response.json() as {ok?:unknown; receipt?:unknown}; if(response.status!==202 || result?.ok!==true || typeof result.receipt!=='string' || !result.receipt.trim()) throw new Error('Request not accepted');
        completed=true;document.dispatchEvent(new CustomEvent('elevated:form-success',{detail:{endpoint:form.dataset.endpoint}}));form.reset(); showStatus(form.dataset.success!,true);
      } catch {showStatus(form.dataset.error!,true); button.disabled=false;}
      finally {
        form.removeAttribute('aria-busy');
        sending=false;
        clearToken();
        // Reset only after an attempted send; missing verification must remain usable.
        if(api && widget!==undefined && !button.disabled) {
          try {api.reset(widget);} catch { /* Phone/email fallback remains available. */ }
        }
      }
    });
  }
}
