/// <reference types="astro/client" />

// Type declarations for @grantcodes/ui Lit component imports
// The @grantcodes/ui package declares these via glob patterns, but TS 6.x
// requires explicit module declarations for deep subpath imports with .js suffices.
declare module '@grantcodes/ui/components/accordion/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesAccordion extends LitElement {}
  export class GrantCodesAccordionItem extends LitElement {
    title: string
    open: boolean
  }
}

declare module '@grantcodes/ui/components/card/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesCard extends LitElement {
    hasHeader: boolean
    hasFooter: boolean
  }
}

declare module '@grantcodes/ui/components/button/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesButton extends LitElement {
    href: string
    type: string
    name: string
    value: string
    disabled: boolean
    form: string
  }
}

declare module '@grantcodes/ui/components/footer/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesFooter extends LitElement {
    columns: number
  }
  export class GrantCodesFooterColumn extends LitElement {}
}

declare module '@grantcodes/ui/components/gallery/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesGallery extends LitElement {
    variant: string
  }
  export class GrantCodesGalleryImage extends LitElement {
    width: number
    height: number
    src: string
    alt: string
    caption: string
    thumbnail: string
  }
}

declare module '@grantcodes/ui/components/icon/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesIcon extends LitElement {
    style?: string
  }
}

declare module '@grantcodes/ui/components/pagination/index.js' {
  import { LitElement } from 'lit'
  export class GrantCodesPagination extends LitElement {
    previousHref: string
    nextHref: string
    page: number
    pages: number
  }
}
