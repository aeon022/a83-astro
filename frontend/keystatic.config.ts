// Dateipfad: frontend/keystatic.config.ts
import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', 
  },
  ui: {
    brand: { name: 'ABTEILUNG83 // CORE' },
  },
  singletons: {
    globalSettings: singleton({
      label: 'Global Settings',
      path: 'src/content/settings/global',
      format: { data: 'json' },
      schema: {
        headline: fields.text({ label: 'Terminal Headline', defaultValue: 'SYSTEM.CORE // ABTEILUNG83' }),
        status: fields.select({
          label: 'System Status',
          options: [
            { label: 'ACTIVE_NODE', value: 'active' },
            { label: 'MAINTENANCE_MODE', value: 'maintenance' },
          ],
          defaultValue: 'active',
        }),
      },
    }),
  },
  collections: {
    pricing: collection({
      label: 'Pricing Models (Contract Definitions)',
      slugField: 'name',
      path: 'src/content/pricing/*',
      format: { data: 'json' },
      schema: {
        name: fields.slug({ name: { label: 'Package Name (e.g. ZERO_BLOAT_AUDIT)' } }),
        description: fields.text({ label: 'Package Description', multiline: true }),
        price: fields.text({ label: 'Price (Numerical/String)', description: 'Wird im UI als // UNIT_PRICE: gerendert' }),
        clearance: fields.select({
          label: 'Clearance Level (Bestseller Alternative)',
          options: [
            { label: 'Level 1 (Standard)', value: 'L1' },
            { label: 'Level 2 (Advanced)', value: 'L2' },
            { label: 'Level 3 (Executive / Bestseller)', value: 'L3' },
          ],
          defaultValue: 'L1',
        }),
        outputParameters: fields.array(
          fields.text({ label: 'Parameter' }),
          { label: 'OUTPUT_PARAMETERS', itemLabel: props => props.value }
        ),
        buildSuccess: fields.array(
          fields.text({ label: 'Success Metric' }),
          { label: 'BUILD_SUCCESS', itemLabel: props => props.value }
        ),
        actionLink: fields.text({ 
          label: 'Action URI', 
          description: 'Link für den start_project.sh Button (z.B. mailto:hello@abteilung83.at oder /contact)' 
        }),
      },
    }),

    showcase: collection({
      label: 'Showcase (Mission Logs)',
      slugField: 'title',
      path: 'src/content/showcase/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Project Title' } }),
        coverImage: fields.image({
          label: 'Mission Visual // COVER',
          directory: 'public/images/showcase',
          publicPath: '/images/showcase/',
        }),
        excerpt: fields.text({ label: 'Excerpt (Kurzbeschreibung)', multiline: true }),
        entity: fields.text({ label: 'ENTITY (Kunde/Auftraggeber)' }),
        vector: fields.text({ label: 'VECTOR (Branche/Zielsetzung)' }),
        arch: fields.text({ label: 'ARCH (Architektur/Tech-Stack Summary)' }),
        cycle: fields.text({ label: 'CYCLE (Zeitrahmen/Jahr)' }),
        protocolReadout: fields.text({ 
          label: '// PROTOCOL_READOUT', 
          description: 'Zwei Zeilen Intro-Text',
          multiline: true 
        }),
        taskProtocol: fields.text({ 
          label: '// TASK_PROTOCOL (Markdown)', 
          description: 'Rohes Markdown für die Aufgabenbeschreibung',
          multiline: true 
        }),
        stackDeployed: fields.array(
          fields.text({ label: 'Tech Node' }),
          { label: '// STACK_DEPLOYED', itemLabel: props => props.value }
        ),
        fixExecuted: fields.text({ 
          label: '// FIX_EXECUTED (Markdown)', 
          description: 'Rohes Markdown für die Lösungsvorgehensweise',
          multiline: true 
        }),
        finalStatus: fields.text({ 
          label: '// FINAL_STATUS', 
          description: 'z.B. MISSION_ACCOMPLISHED oder DEPLOYMENT_STABLE' 
        }),
        gatewayUri: fields.text({ 
          label: '// GATEWAY_URI', 
          description: 'Link zur Live-Seite (inkl. https://)' 
        }),
        isHighlighted: fields.checkbox({ 
          label: 'Highlight on Startpage', 
          defaultValue: false 
        }),
      },
    }),

    // FIX: Hinzugefügte Services Collection
    services: collection({
      label: 'Services (System Modules)',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Service Title' } }),
        id: fields.text({ label: 'Module ID (e.g. MOD_01)' }),
        status: fields.text({ label: 'Status (e.g. STABLE)' }),
        description: fields.text({ label: 'Description', multiline: true }),
        size: fields.select({
          label: 'Grid Size',
          options: [
            { label: 'Large (8 Cols)', value: 'lg:col-span-8' },
            { label: 'Small (4 Cols)', value: 'lg:col-span-4' },
          ],
          defaultValue: 'lg:col-span-4',
        }),
        specs: fields.array(fields.text({ label: 'Spec' }), { label: 'Specs' }),
      }
    }),
  },
});