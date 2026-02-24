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

    services: collection({
      label: 'Services (System Modules)',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Service Title (z.B. One-Pager)' } }),
        id: fields.text({ label: 'Module ID (e.g. MOD_01)' }),
        status: fields.text({ label: 'Status (z.B. live, AVAILABLE)', defaultValue: 'AVAILABLE' }),
        showOnStartpage: fields.checkbox({ label: 'Show on Startpage', defaultValue: false }),
        
        // Branding & Layout
        accent: fields.text({ label: 'Accent Color (Hex/CSS Var)', defaultValue: 'var(--a83-accent)' }),
        icon: fields.text({ label: 'Icon Name (Astro-Icon)' }),
        size: fields.select({
          label: 'Grid Size',
          options: [
            { label: 'Large (8 Cols)', value: 'lg:col-span-8' },
            { label: 'Small (4 Cols)', value: 'lg:col-span-4' },
          ],
          defaultValue: 'lg:col-span-4',
        }),

        // Content & Pricing
        tagline: fields.text({ label: 'Tagline (z.B. Focus Mode)' }),
        description: fields.text({ label: 'Short Intro (z.B. Eine Seite, ein Ziel)', multiline: true }),
        price: fields.text({ label: 'Price (Numerical/String)' }),
        priceLabel: fields.text({ label: 'Price Label', defaultValue: '// BASE_PRICE:' }),
        
        // Listen für Parameter & Success
        outputParameters: fields.array(fields.text({ label: 'Parameter' }), {
          label: 'OUTPUT_PARAMETERS',
          itemLabel: (props) => props.value,
        }),
        buildSuccess: fields.array(fields.text({ label: 'Success Metric' }), {
          label: 'BUILD_SUCCESS',
          itemLabel: (props) => props.value,
        }),

        // Action & Legal
        buttonLabel: fields.text({ label: 'Button Text', defaultValue: 'sh start_project.sh' }),
        actionLink: fields.text({ label: 'Action URI', defaultValue: 'mailto:post@abteilung83.at' }),
        footnote: fields.text({ label: 'Footnote (Asterisk Text)', multiline: true }),
        
        // Specs für Tech-Details
        specs: fields.array(fields.text({ label: 'Spec' }), { label: 'Specs' }),
      }
    }),
  },
});