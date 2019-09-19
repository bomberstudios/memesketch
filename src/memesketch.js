const sketch = require('sketch')
const { DataSupplier, Settings } = sketch
const { toArray } = require('util')

import insertImage, { getImageFromURL } from 'sketch-image-downloader'

export function onStartup () {
  DataSupplier.registerDataSupplier('public.image', 'MemeSketch Random', 'SupplyRandomPhoto')
}

export function onShutdown () {
  DataSupplier.deregisterDataSuppliers()
}

export function onSupplyRandomPhoto (context) {
  const dataKey = context.data.key
  const items = toArray(context.data.items).map(sketch.fromNative)

  fetch('https://api.imgflip.com/get_memes')
    .then(response => response.json())
    .then(json => {
      if (json.errors) {
        return Promise.reject(json.errors[0])
      }
      let memes = json.data.memes
      items.forEach((layer, index) => {
        let meme = memes[Math.floor(Math.random() * memes.length)]
        let imageURL = meme.url
        getImageFromURL(imageURL).then(imagePath => {
          DataSupplier.supplyDataAtIndex(dataKey, imagePath, index)
        })
      })
    })
  }
