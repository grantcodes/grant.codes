import { createGlobalStyle } from 'styled-components'
import { textInputs } from 'polished'
import { theme, palette, mixin } from '../helpers'

export default createGlobalStyle`
.input,
select,
${textInputs()} {
  font-family: inherit;
  display: block;
  font-weight: normal;
  width: 100%;
  line-height: 1.5;
  font-size: 1em;
  padding: 0.5em 1em;
  border: 1px solid ${palette('mainBorder')};
  border-radius: ${theme('borderRadius')};
  box-shadow: none;
  outline: none;
  background-color: ${palette('mainAlt')};

  color: ${palette('contrast')};
  margin-bottom: 1rem;
  transition: all 0.3s;

  ::placeholder {
    color: ${palette('contrast')};
    opacity: 0.6;
  }

  :focus,
  :active {
    border-color: ${palette('contrast')};

    :invalid {
      box-shadow: 0 0 2px red inset;
    }
  }
}

textarea {
  resize: vertical;
  min-height: 6.6em;
}

input[type=radio],
input[type=checkbox] {
  display: inline-block;
}

fieldset {
  padding: 0;
  margin: 0;
  border: none;
}

legend {
  display: block;
  width: 100%;
  font-size: ${mixin.fs(2)};
  margin-bottom: ${mixin.space(2)};
}

label,
.label {
  display: block;
  opacity: 0.9;
  cursor: pointer;
  line-height: 1.5;
  font-size: ${mixin.fs(-1)};
  margin-bottom: 0.1rem;
}
`
