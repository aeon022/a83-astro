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
        
        status: fields.select({
          label: 'Deployment Status',
          options: [
            { label: 'ACTIVE_NODE (Live)', value: 'live' },
            { label: 'DECOMMISSIONED (Archive)', value: 'archive' },
          ],
          defaultValue: 'live',
        }),

        coverImage: fields.image({
          label: 'Mission Visual // COVER',
          directory: 'public/images/showcase',
          publicPath: '/images/showcase/',
          validation: { isRequired: false } // Jetzt auch hier optional
        }),

        // Alle Felder auf optional (isRequired: false)
        excerpt: fields.text({ label: 'Excerpt (Kurzbeschreibung)', multiline: true, validation: { isRequired: false } }),
        entity: fields.text({ label: 'ENTITY (Kunde/Auftraggeber)', validation: { isRequired: false } }),
        vector: fields.text({ label: 'VECTOR (Branche/Zielsetzung)', validation: { isRequired: false } }),
        arch: fields.text({ label: 'ARCH (Architektur/Tech-Stack Summary)', validation: { isRequired: false } }),
        cycle: fields.text({ label: 'CYCLE (Zeitrahmen/Jahr)', validation: { isRequired: false } }),
        protocolReadout: fields.text({ 
          label: '// PROTOCOL_READOUT', 
          description: 'Zwei Zeilen Intro-Text',
          multiline: true,
          validation: { isRequired: false } 
        }),
        taskProtocol: fields.text({ 
          label: '// TASK_PROTOCOL (Markdown)', 
          description: 'Rohes Markdown für die Aufgabenbeschreibung',
          multiline: true,
          validation: { isRequired: false } 
        }),
        stackDeployed: fields.array(
          fields.text({ label: 'Tech Node' }),
          { label: '// STACK_DEPLOYED', itemLabel: props => props.value }
        ),
        fixExecuted: fields.text({ 
          label: '// FIX_EXECUTED (Markdown)', 
          description: 'Rohes Markdown für die Lösungsvorgehensweise',
          multiline: true,
          validation: { isRequired: false } 
        }),
        finalStatus: fields.text({ 
          label: '// FINAL_STATUS', 
          description: 'z.B. MISSION_ACCOMPLISHED oder DEPLOYMENT_STABLE',
          validation: { isRequired: false } 
        }),
        gatewayUri: fields.text({ 
          label: '// GATEWAY_URI', 
          description: 'Link zur Live-Seite (inkl. https://)',
          validation: { isRequired: false } 
        }),
        isHighlighted: fields.checkbox({ 
          label: 'Highlight on Startpage', 
          defaultValue: false 
        }),
      },
    }),

    // SERVICES COLLECTION: Exakt wie von dir geliefert.
    services: collection({
      label: 'Services (System Modules)',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'Service Title (z.B. One-Pager)' } }),
        id: fields.text({ label: 'Module ID (e.g. MOD_01)' }),
        order: fields.integer({ 
            label: 'Sort Order (0 = Top-Priority)', 
            defaultValue: 10 
        }),
        status: fields.text({ label: 'Status (z.B. live, AVAILABLE)', defaultValue: 'AVAILABLE' }),
        showOnStartpage: fields.checkbox({ label: 'Show on Startpage', defaultValue: false }),
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
        tagline: fields.text({ label: 'Tagline (z.B. Focus Mode)' }),
        description: fields.text({ label: 'Short Intro (z.B. Eine Seite, ein Ziel)', multiline: true }),
        price: fields.text({ label: 'Price (Numerical/String)' }),
        priceLabel: fields.text({ label: 'Price Label', defaultValue: '// BASE_PRICE:' }),
        outputParameters: fields.array(fields.text({ label: 'Parameter' }), {
          label: 'OUTPUT_PARAMETERS',
          itemLabel: (props) => props.value,
        }),
        buildSuccess: fields.array(fields.text({ label: 'Success Metric' }), {
          label: 'BUILD_SUCCESS',
          itemLabel: (props) => props.value,
        }),
        buttonLabel: fields.text({ label: 'Button Text', defaultValue: 'sh start_project.sh' }),
        actionLink: fields.text({ label: 'Action URI', defaultValue: 'mailto:post@abteilung83.at' }),
        footnote: fields.text({ label: 'Footnote (Asterisk Text)', multiline: true }),
        specs: fields.array(fields.text({ label: 'Spec' }), { label: 'Specs' }),
      },
    }),
  },
});