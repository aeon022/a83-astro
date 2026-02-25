// keystatic.config.ts
export default makeConfig({
  collections: {
    showcases: collection({ // <--- DAS hier ist der Name für reader.collections.showcases
      label: 'Showcases',
      // ...
    }),
    // ODER
    work: collection({      // <--- DANN wäre es reader.collections.work
      label: 'Work',
      // ...
    })
  }
})