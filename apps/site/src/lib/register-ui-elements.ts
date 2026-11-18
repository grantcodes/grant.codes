import { GrantCodesAccordion, GrantCodesAccordionItem } from '@grantcodes/ui/components/accordion/index.js'
import { GrantCodesButton } from '@grantcodes/ui/components/button/index.js'
import { GrantCodesCard } from '@grantcodes/ui/components/card/index.js'
import { GrantCodesFooter, GrantCodesFooterColumn } from '@grantcodes/ui/components/footer/index.js'
import { GrantCodesGallery, GrantCodesGalleryImage } from '@grantcodes/ui/components/gallery/index.js'
import { GrantCodesIcon } from '@grantcodes/ui/components/icon/index.js'
import { GrantCodesPagination } from '@grantcodes/ui/components/pagination/index.js'
import { GrantCodesPopover } from '@grantcodes/ui/components/popover/index.js'
import { GrantCodesDialog } from '@grantcodes/ui/components/dialog/index.js'

const tagName = Symbol.for('tagName')

function setTagName(component: Function, name: string) {
  Object.defineProperty(component, tagName, { configurable: true, value: name })
}

setTagName(GrantCodesAccordion, 'grantcodes-accordion')
setTagName(GrantCodesAccordionItem, 'grantcodes-accordion-item')
setTagName(GrantCodesButton, 'grantcodes-button')
setTagName(GrantCodesCard, 'grantcodes-card')
setTagName(GrantCodesFooter, 'grantcodes-footer')
setTagName(GrantCodesFooterColumn, 'grantcodes-footer-column')
setTagName(GrantCodesGallery, 'grantcodes-gallery')
setTagName(GrantCodesGalleryImage, 'grantcodes-gallery-image')
setTagName(GrantCodesIcon, 'grantcodes-icon')
setTagName(GrantCodesPagination, 'grantcodes-pagination')
setTagName(GrantCodesPopover, 'grantcodes-popover')
setTagName(GrantCodesDialog, 'grantcodes-dialog')
