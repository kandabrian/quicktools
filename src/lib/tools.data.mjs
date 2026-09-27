// Plain-data version of the tools list (no TypeScript syntax) so it can be
// imported directly by Node build scripts (scripts/generate-sitemap.mjs,
// scripts/prerender.mjs) as well as by toolsConfig.ts in the app bundle.
// This is the single source of truth — add a new tool here only.
export const TOOLS = [
  {
    slug: 'compress-pdf',
    name: 'PDF Compressor',
    shortDescription: 'Shrink PDF file size in seconds, right in your browser.',
    longDescription:
      'Reduce the size of your PDF files without installing software or uploading them to a server. Choose a compression level and download the result instantly.',
    category: 'pdf',
    icon: 'compress',
    keywords: ['compress pdf', 'reduce pdf size', 'shrink pdf', 'pdf compressor'],
    popular: true,
    status: 'live',
    faqs: [
      {
        question: 'Is my PDF uploaded to a server?',
        answer:
          'No. Compression runs entirely in your browser using JavaScript. Your file never leaves your device.',
      },
      {
        question: 'Will compression reduce quality?',
        answer:
          'Higher compression levels reduce embedded image quality more aggressively. Text-heavy PDFs with few images may not shrink much regardless of the level chosen.',
      },
      {
        question: 'Is there a file size limit?',
        answer:
          'Very large PDFs (100MB+) may be slow or hit memory limits depending on your device and browser. Most everyday PDFs process in a few seconds.',
      },
    ],
  },
  {
    slug: 'merge-pdf',
    name: 'PDF Merger',
    shortDescription: 'Combine multiple PDFs into one file, in any order you choose.',
    longDescription:
      'Upload multiple PDF files, arrange them in the order you want, and merge them into a single document — all processed locally in your browser.',
    category: 'pdf',
    icon: 'merge',
    keywords: ['merge pdf', 'combine pdf', 'join pdf files', 'pdf merger'],
    popular: true,
    status: 'live',
    faqs: [
      {
        question: 'How many PDFs can I merge at once?',
        answer: 'There is no hard limit, but very large batches will take longer and use more memory.',
      },
      {
        question: 'Can I change the order of the files?',
        answer: 'Yes, drag files up or down in the list before merging, or remove any file you no longer want to include.',
      },
    ],
  },
  {
    slug: 'split-pdf',
    name: 'PDF Splitter',
    shortDescription: 'Extract pages or split a PDF into multiple files.',
    longDescription:
      'Split a PDF by extracting specific pages, breaking it into individual single-page files, or dividing it by custom page ranges.',
    category: 'pdf',
    icon: 'split',
    keywords: ['split pdf', 'extract pdf pages', 'divide pdf', 'pdf splitter'],
    popular: true,
    status: 'live',
    faqs: [
      {
        question: 'Can I extract just a few specific pages?',
        answer: 'Yes, you can select individual pages, split every page into its own file, or define custom page ranges.',
      },
      {
        question: 'What do I get back?',
        answer: "Depending on the option chosen, you'll get a single PDF of selected pages, or a ZIP of multiple files.",
      },
    ],
  },
  {
    slug: 'compress-image',
    name: 'Image Compressor',
    shortDescription: 'Compress JPG, PNG, and WebP images without losing much quality.',
    longDescription:
      'Reduce image file size for faster websites, emails, or uploads. Adjust the quality slider and preview the before/after result before downloading.',
    category: 'image',
    icon: 'image',
    keywords: ['compress image', 'reduce image size', 'jpg compressor', 'png compressor', 'webp compressor'],
    popular: true,
    status: 'live',
    faqs: [
      {
        question: 'Which image formats are supported?',
        answer: 'JPG/JPEG, PNG, and WebP images are all supported.',
      },
      {
        question: 'Does compression change the image dimensions?',
        answer: 'No, only file size and quality are affected. Use a resizer tool if you need to change dimensions.',
      },
    ],
  },
  {
    slug: 'jpg-to-pdf',
    name: 'JPG to PDF',
    shortDescription: 'Convert one or more images into a single PDF document.',
    longDescription:
      'Turn your JPG, JPEG, PNG, or WebP images into a PDF. Reorder images and choose page orientation before converting.',
    category: 'image',
    icon: 'convert',
    keywords: ['jpg to pdf', 'image to pdf', 'convert image to pdf', 'png to pdf'],
    popular: false,
    status: 'live',
    faqs: [
      {
        question: 'Can I combine multiple images into one PDF?',
        answer: 'Yes, upload multiple images and they will be combined into a single multi-page PDF in the order you set.',
      },
      {
        question: 'Can I control the page orientation?',
        answer: 'Yes, choose portrait or landscape before converting.',
      },
    ],
  },
];
