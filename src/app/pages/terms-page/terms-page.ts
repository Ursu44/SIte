import { Component } from '@angular/core';

interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  list?: string[];
}

@Component({
  selector: 'app-terms-page',
  standalone: true,
  templateUrl: './terms-page.html',
  styleUrl: './terms-page.css'
})
export class TermsPage {
  lastUpdated = '10 noiembrie 2026';

  sections: LegalSection[] = [
    {
      id: 'despre',
      title: 'Despre asociație și acest site',
      paragraphs: [
        'Acest site este administrat de Casa de Ajutor Reciproc CFR Suceava (C.A.R. CFR Suceava), asociație a salariaților și pensionarilor din domeniul feroviar, cu personalitate juridică din anul 1997.',
        'Date de identificare: sediul în [adresa sediului], cod de identificare fiscală [CUI], număr de înregistrare [număr de înregistrare], telefon [telefon], e-mail [e-mail].'
      ]
    },
    {
      id: 'acceptare',
      title: 'Acceptarea termenilor',
      paragraphs: [
        'Prin accesarea și utilizarea site-ului confirmi că ai citit acești termeni și că ești de acord cu ei. Dacă nu ești de acord, te rugăm să nu folosești site-ul.',
        'Site-ul are rol de prezentare și informare. Nu poți încheia online contracte de împrumut sau de economisire.'
      ]
    },
    {
      id: 'servicii',
      title: 'Serviciile prezentate',
      paragraphs: [
        'Pe site sunt prezentate serviciile asociației, destinate membrilor:'
      ],
      list: [
        'împrumuturi tradiționale, de până la 50.000 lei, pe maximum 60 de luni, cu dobândă fixă de 9,5% pe an;',
        'împrumuturi diversificate, de până la 70.000 lei, pe maximum 60 de luni, cu dobândă fixă de 11,5% pe an;',
        'Fondul Social, cu dobândă de până la 5% pe an, contribuție lunară între 30 și 800 lei și taxă de înscriere de 30 lei.'
      ]
    },
    {
      id: 'membri',
      title: 'Calitatea de membru',
      paragraphs: [
        'Serviciile se acordă membrilor asociației. Condițiile de înscriere, drepturile și obligațiile membrilor, retragerea din asociație și restituirea sumelor se stabilesc prin statutul asociației și prin regulamentele ei, care prevalează asupra informațiilor de pe site.',
        'Acordarea unui împrumut depinde de analiza dosarului, de documentele prezentate, de eventualii giranți și de aprobarea asociației. Prezentarea site-ului nu constituie o ofertă obligatorie și nu garantează aprobarea unei cereri.'
      ]
    },
    {
      id: 'simulatoare',
      title: 'Simulatoare și calcule orientative',
      paragraphs: [
        'Calculatoarele de pe site oferă rezultate orientative, bazate pe valorile introduse de tine. Ele nu reprezintă o ofertă și nu înlocuiesc contractul sau documentele întocmite la sediul asociației.',
        'Valorile finale (rată, dobândă, costuri) se stabilesc la analiza cererii și se regăsesc în documentele semnate.'
      ]
    },
    {
      id: 'documente',
      title: 'Documente și formulare descărcabile',
      paragraphs: [
        'Formularele din secțiunea Documente sunt modele de completat. Asociația poate cere documente suplimentare, în funcție de situația solicitantului și de valoarea împrumutului.',
        'Asociația poate modifica modelele de formulare. Folosește versiunea cea mai recentă sau confirmă-o la sediu.'
      ]
    },
    {
      id: 'continut',
      title: 'Conținutul site-ului și drepturile de autor',
      paragraphs: [
        'Textele, imaginile, siglele și designul site-ului aparțin asociației sau sunt folosite cu drept de utilizare. Nu poți copia, reproduce sau distribui conținutul în scop comercial fără acordul scris al asociației.',
        'Siglele ANPC și ale platformei de soluționare a litigiilor aparțin proprietarilor lor și sunt folosite doar ca trimitere informativă.'
      ]
    },
    {
      id: 'recenzii',
      title: 'Recenzii și mesaje trimise de utilizatori',
      paragraphs: [
        'Dacă trimiți o recenzie sau un mesaj, ești responsabil de conținutul lui. Nu sunt permise mesajele ofensatoare, false, ilegale sau care conțin date personale ale altor persoane.',
        'Asociația poate refuza sau elimina conținutul care încalcă aceste reguli. Prelucrarea datelor tale este explicată în Politica de confidențialitate.'
      ]
    },
    {
      id: 'linkuri',
      title: 'Linkuri către alte site-uri',
      paragraphs: [
        'Site-ul poate conține trimiteri către alte pagini, de exemplu autorități sau portalul pentru membri. Asociația nu controlează aceste site-uri și nu răspunde de conținutul sau de politicile lor.'
      ]
    },
    {
      id: 'raspundere',
      title: 'Limitarea răspunderii',
      paragraphs: [
        'Depunem eforturi pentru ca informațiile să fie corecte și actualizate, dar nu garantăm că site-ul este lipsit de erori sau disponibil permanent. Informațiile pot fi modificate fără notificare prealabilă.',
        'În caz de diferențe între site și statutul sau documentele oficiale ale asociației, se aplică acestea din urmă. Asociația nu răspunde pentru deciziile luate exclusiv pe baza informațiilor de pe site.'
      ]
    },
    {
      id: 'litigii',
      title: 'Reclamații și soluționarea litigiilor',
      paragraphs: [
        'Pentru orice nemulțumire ne poți scrie sau ne poți vizita la sediu, iar noi vom răspunde în termenul legal.',
        'Dacă nu ajungem la o înțelegere, poți apela la entitățile de soluționare alternativă a litigiilor (SAL) și poți consulta site-ul ANPC (anpc.ro). [De verificat cu asociația ce se aplică în cazul ei, inclusiv dacă este necesară o mențiune despre platforma europeană de soluționare online a litigiilor, închisă din iulie 2025.]'
      ]
    },
    {
      id: 'modificari',
      title: 'Modificarea termenilor',
      paragraphs: [
        'Putem actualiza acești termeni. Versiunea în vigoare este cea publicată pe această pagină, cu data ultimei actualizări afișată sus. Continuarea utilizării site-ului după o modificare înseamnă acceptarea noii versiuni.'
      ]
    },
    {
      id: 'lege',
      title: 'Legea aplicabilă',
      paragraphs: [
        'Acești termeni sunt guvernați de legea română. Litigiile se soluționează amiabil, iar în lipsa unei înțelegeri, de instanțele competente din România.'
      ]
    },
    {
      id: 'contact',
      title: 'Contact',
      paragraphs: [
        'Pentru întrebări despre acești termeni ne poți contacta la [e-mail], la telefon [telefon] sau la sediul din [adresa sediului].'
      ]
    }
  ];

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}