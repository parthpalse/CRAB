// src/lib/translations.ts
import React from 'react';

export const DICT = {
  EN: {
    nav: ['Home', 'About Us', 'Services', 'Contact Us', 'Login'],
    bookBtn: 'Start Consultation',
    splash: 'KLARSTONE / INITIALIZING',
    heroOverline: 'DECISION INTELLIGENCE FOR MODERN BUSINESS',
    heroTitle: 'KLARSTONE',
    whatWeDo: {
      label: 'What we do',
      title: 'AI-powered consulting for growing businesses',
      p1: 'Klarstone acts as a micro-consultant for your company. It works with your business data, asks smart follow-up questions, and gives clear recommendations on what to do next.',
      p2: 'It helps you move from scattered data and uncertainty to structured insights and action.'
    },
    howItWorks: {
      steps: [
        { n: '01', title: 'Ask a question', sub: 'Start with your business problem', text: '"Why are sales declining?"' },
        { n: '02', title: 'Add context', sub: 'Answer a few smart follow-up questions', text: 'Synthesizing context.' },
        { n: '03', title: 'AI analyses', sub: 'Data + context → clear diagnosis', text: 'Identifying root causes.' },
        { n: '04', title: 'Get recommendations', sub: 'What to do. What to avoid.', text: 'Actionable insights.' },
        { n: '05', title: 'View dashboard', sub: 'Key insights, KPIs, and trends', text: 'Live intelligence.' },
        { n: '06', title: 'Download report', sub: 'Consulting-style strategy report', text: 'Your plan. Ready.' },
      ]
    },
    keyBenefits: {
      label: 'Key benefits',
      title: 'Consulting intelligence, delivered instantly',
      items: [
        '24/7 AI micro-consultant',
        'Data-backed business recommendations',
        'Smart follow-up questions for better context',
        'Interactive dashboards',
        'Downloadable consulting reports',
        'Built for fast, practical decision-making'
      ]
    },
    magicBento: {
      months12: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
      months6: ['Oct','Nov','Dec','Jan','Feb','Mar'],
      label: 'Services',
      title: 'Where Klarstone helps',
      imagePlaceholder: 'Image coming soon',
      sales: { title: 'Sales', desc: 'Understand declining sales, weak conversion, channel issues, and customer behaviour.' },
      strategy: { title: 'Strategy', desc: 'Identify what to focus on, what to avoid, and how to move forward with informed decisions.' },
      controlling: { title: 'Controlling', desc: 'Track KPIs, costs, margins, and business performance.' },
      operations: { title: 'Operations', desc: 'Spot inefficiencies, bottlenecks, and improvement areas.' },
      growthChart: {
        heading: 'Revenue Growth',
        subtitle: 'Last 12 months · After Klarstone diagnostic',
        withKlarstone: 'With Klarstone',
        baseline: 'Industry baseline',
        sampleData: 'Sample data · illustrative',
        incremental: '+€189K incremental revenue'
      },
      security: {
        headline: 'Your data, sealed',
        headlineItalic: 'in light.',
        kicker: 'Aegis · Data Integrity'
      }
    },
    contact: {
      title: 'Contact us',
      subtitle: 'Turn business questions into clear action',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send message',
      successTitle: 'Message sent!',
      successText: 'Thank you for reaching out. Our team will get back to you shortly.'
    },
    footer: {
      title: 'Turn business questions into clear action',
      sub: 'Ask. Understand. Get recommendations. Move forward with clarity.',
      cta: 'Get started',
      copyright: '© 2026 KLARSTONE. Intelligence for modern business.'
    }
  },
  DE: {
    nav: ['Startseite', 'Über uns', 'Services', 'Kontakt', 'Login'],
    bookBtn: 'Beratung starten',
    splash: 'KLARSTONE / INITIALISIERUNG',
    heroOverline: 'ENTSCHEIDUNGSINTELLIGENZ FÜR MODERNE UNTERNEHMEN',
    heroTitle: 'KLARSTONE',
    whatWeDo: {
      label: 'Was wir tun',
      title: 'KI-gestützte Beratung für wachsende Unternehmen',
      p1: 'Klarstone fungiert als Mikro-Berater für Ihr Unternehmen. Es arbeitet mit Ihren Geschäftsdaten, stellt intelligente Rückfragen und gibt klare Empfehlungen für die nächsten Schritte.',
      p2: 'Es hilft Ihnen, von verstreuten Daten und Unsicherheit zu strukturierten Erkenntnissen und Taten zu gelangen.'
    },
    howItWorks: {
      steps: [
        { n: '01', title: 'Frage stellen', sub: 'Beginnen Sie mit Ihrem Geschäftsproblem', text: '"Warum sinken die Umsätze?"' },
        { n: '02', title: 'Kontext hinzufügen', sub: 'Beantworten Sie einige intelligente Rückfragen', text: 'Kontext wird synthetisiert.' },
        { n: '03', title: 'KI analysiert', sub: 'Daten + Kontext → klare Diagnose', text: 'Ursachenidentifikation.' },
        { n: '04', title: 'Empfehlungen erhalten', sub: 'Was zu tun ist. Was zu vermeiden ist.', text: 'Handlungsempfehlungen.' },
        { n: '05', title: 'Dashboard ansehen', sub: 'Wichtige Erkenntnisse, KPIs und Trends', text: 'Live-Intelligenz.' },
        { n: '06', title: 'Bericht herunterladen', sub: 'Strategiebericht im Consulting-Stil', text: 'Ihr Plan. Bereit.' },
      ]
    },
    keyBenefits: {
      label: 'Vorteile',
      title: 'Beratungsintelligenz, sofort geliefert',
      items: [
        '24/7 KI-Mikroberater',
        'Datengestützte Geschäftsempfehlungen',
        'Intelligente Rückfragen für besseren Kontext',
        'Interaktive Dashboards',
        'Herunterladbare Beratungsberichte',
        'Entwickelt für schnelle, praktische Entscheidungen'
      ]
    },
    magicBento: {
      months12: ['Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez','Jan','Feb','Mär'],
      months6: ['Okt','Nov','Dez','Jan','Feb','Mär'],
      label: 'Services',
      title: 'Wo KLARSTONE hilft',
      imagePlaceholder: 'Bild folgt in Kürze',
      sales: { title: 'Vertrieb', desc: 'Verstehen Sie rückläufige Umsätze, schwache Konversionsraten, Kanalprobleme und Kundenverhalten.' },
      strategy: { title: 'Strategie', desc: 'Identifizieren Sie, worauf Sie sich konzentrieren sollten, was Sie vermeiden sollten und wie Sie mit informierten Entscheidungen vorankommen.' },
      controlling: { title: 'Controlling', desc: 'Verfolgen Sie KPIs, Kosten, Margen und Geschäftsleistung.' },
      operations: { title: 'Betrieb', desc: 'Erkennen Sie Ineffizienzen, Engpässe und Verbesserungsbereiche.' },
      growthChart: {
        heading: 'Umsatzwachstum',
        subtitle: 'Letzte 12 Monate · Nach Klarstone-Diagnose',
        withKlarstone: 'Mit Klarstone',
        baseline: 'Branchendurchschnitt',
        sampleData: 'Beispieldaten · illustrativ',
        incremental: '+€189K zusätzlicher Umsatz'
      },
      security: {
        headline: 'Ihre Daten, versiegelt',
        headlineItalic: 'im Licht.',
        kicker: 'Aegis · Datenintegrität'
      }
    },
    contact: {
      title: 'Kontakt',
      subtitle: 'Bereit, Ihr Geschäftspotenzial voll auszuschöpfen? Kontaktieren Sie uns.',
      name: 'Name',
      email: 'E-Mail',
      message: 'Nachricht',
      send: 'Nachricht senden',
      successTitle: 'Nachricht gesendet!',
      successText: 'Vielen Dank für Ihre Nachricht. Unser Team wird sich in Kürze bei Ihnen melden.'
    },
    footer: {
      title: 'Geschäftsfragen in klare Taten verwandeln',
      sub: 'Fragen. Verstehen. Empfehlungen erhalten. Mit Klarheit vorankommen.',
      cta: 'Jetzt loslegen',
      copyright: '© 2026 KLARSTONE. Intelligenz für moderne Unternehmen.'
    }
  }
};
