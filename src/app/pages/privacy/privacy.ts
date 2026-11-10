import { Component } from '@angular/core';

interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

@Component({
  selector: 'app-privacy-page',
  standalone: true,
  templateUrl: './privacy.html',
  styleUrl: './privacy.css'
})
export class PrivacyPage {
  lastUpdated = '10 noiembrie 2026';

  sections: LegalSection[] = [
    {
      id: 'operator',
      title: 'Cine este operatorul datelor',
      paragraphs: [
        'Operatorul datelor personale este Casa de Ajutor Reciproc CFR Suceava (C.A.R. CFR Suceava), cu sediul în [adresa sediului], cod de identificare fiscală [CUI], e-mail [e-mail], telefon [telefon].',
        '[Dacă asociația a desemnat un responsabil cu protecția datelor, se trece aici adresa lui de contact.]'
      ]
    },
    {
      id: 'date',
      title: 'Ce date prelucrăm',
      paragraphs: ['În funcție de modul în care folosești site-ul sau relaționezi cu asociația, putem prelucra:'],
      list: [
        'datele pe care ni le transmiți când ne contactezi (nume, e-mail, telefon, conținutul mesajului);',
        'datele din recenziile publicate pe site (numele afișat, evaluarea, textul recenziei, data);',
        'date tehnice de bază, generate automat la accesarea site-ului (adresă IP, tipul browserului, data și ora accesării), în jurnalele serverului;',
        'datele din dosarul de membru sau de împrumut (identificare, venituri, documente, date ale giranților), care se completează la sediul asociației, nu prin acest site.'
      ]
    },
    {
      id: 'scopuri',
      title: 'Scopurile și temeiurile prelucrării',
      paragraphs: ['Prelucrăm datele doar atât cât este necesar, pentru:'],
      list: [
        'răspunsul la mesajele tale: interesul legitim sau pașii premergători încheierii unui contract, la cererea ta;',
        'afișarea recenziilor: consimțământul tău;',
        'securitatea și funcționarea site-ului: interesul legitim al asociației;',
        'înscrierea ca membru și analiza cererilor de împrumut: executarea contractului sau pașii premergători, plus obligațiile legale, conform statutului și legislației aplicabile;',
        'respectarea obligațiilor legale (evidență, arhivare, solicitări ale autorităților).'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookie-uri și tehnologii similare',
      paragraphs: [
        'Site-ul nu folosește cookie-uri de analiză sau de marketing și nu salvează date de urmărire în browser. De aceea nu afișăm un banner de cookie-uri.',
        'Dacă vom adăuga în viitor instrumente care folosesc cookie-uri (statistici, hărți, videoclipuri încorporate), vom actualiza această pagină și vom cere consimțământul unde este necesar.'
      ]
    },
    {
      id: 'destinatari',
      title: 'Cui transmitem datele',
      paragraphs: [
        'Nu vindem datele tale. Le pot primi doar furnizorii care ne ajută să rulăm site-ul, de exemplu serviciile de găzduire și de bază de date (Cloudflare), care acționează în numele nostru, și autoritățile, atunci când legea o cere.',
        '[De completat cu orice alt furnizor folosit de asociație (e-mail, contabilitate, portalul pentru membri).]'
      ]
    },
    {
      id: 'transfer',
      title: 'Transferul în afara UE',
      paragraphs: [
        'Unii furnizori de infrastructură pot prelucra date și în afara Spațiului Economic European. În acest caz se aplică garanțiile prevăzute de GDPR, de exemplu clauze contractuale standard sau decizii de adecvare. [De verificat cu setările și contractul furnizorului.]'
      ]
    },
    {
      id: 'durata',
      title: 'Cât timp păstrăm datele',
      paragraphs: [],
      list: [
        'mesajele de contact: cât este necesar pentru a-ți răspunde, apoi cel mult [perioadă];',
        'recenziile: cât timp sunt afișate pe site sau până retragi consimțământul;',
        'jurnalele tehnice: pe perioade scurte, stabilite de furnizorul de găzduire;',
        'datele din dosarele de membri și de împrumut: pe durata calității de membru sau a contractului și apoi pe perioadele de arhivare impuse de lege [de confirmat].'
      ]
    },
    {
      id: 'drepturi',
      title: 'Drepturile tale',
      paragraphs: ['Conform GDPR (Regulamentul UE 2016/679) ai dreptul:'],
      list: [
        'de acces la datele tale;',
        'de rectificare a datelor incorecte;',
        'de ștergere („dreptul de a fi uitat”), în condițiile legii;',
        'de restricționare a prelucrării;',
        'la portabilitatea datelor;',
        'de opoziție, în cazurile prevăzute de lege;',
        'de retragere a consimțământului, oricând, fără a afecta prelucrarea de până atunci.'
      ]
    },
    {
      id: 'exercitare',
      title: 'Cum îți exerciți drepturile',
      paragraphs: [
        'Ne poți scrie la [e-mail] sau la sediul asociației. Îți răspundem în cel mult o lună de la primirea cererii.',
        'Dacă ești nemulțumit, ai dreptul să depui o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP): dataprotection.ro, B-dul G-ral. Gheorghe Magheru nr. 28-30, sector 1, București. Te rugăm să ne dai întâi șansa să rezolvăm problema.'
      ]
    },
    {
      id: 'securitate',
      title: 'Securitatea datelor',
      paragraphs: [
        'Folosim măsuri tehnice și organizatorice rezonabile: conexiune securizată (HTTPS), acces limitat la date și păstrarea documentelor din dosare la sediul asociației. Niciun sistem nu este însă complet lipsit de risc.'
      ]
    },
    {
      id: 'minori',
      title: 'Minori',
      paragraphs: [
        'Site-ul se adresează adulților. Nu colectăm intenționat date ale minorilor prin acest site.'
      ]
    },
    {
      id: 'modificari',
      title: 'Modificări ale politicii',
      paragraphs: [
        'Putem actualiza această politică. Versiunea în vigoare este cea publicată aici, cu data ultimei actualizări afișată sus.'
      ]
    }
  ];

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}