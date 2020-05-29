var headScript = document.createElement('script')
headScript.onload = function() {
  head.load(
    'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.7.0/js/reveal.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.13.1/highlight.min.js',
    function() {
      var hljs_nodes = document.querySelectorAll('pre code')
      for (var i = 0, len = hljs_nodes.length; i < len; i++) {
        var element = hljs_nodes[i]
        if (
          element.hasAttribute('data-trim') &&
          typeof element.innerHTML.trim === 'function'
        ) {
          element.innerHTML = element.innerHTML.trim()
        }
        if (!element.hasAttribute('data-noescape')) {
          element.innerHTML = element.innerHTML
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
        }
        element.addEventListener(
          'focusout',
          function(event) {
            hljs.highlightBlock(event.currentTarget)
          },
          false
        )
      }
      hljs.initHighlightingOnLoad()
      Reveal.initialize({
        controls: false,
        progress: true,
        center: true,
        transition: 'slide',
        dependencies: [
          {
            src:
              'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.7.0/plugin/markdown/marked.js',
            condition: function() {
              return !!document.querySelector('[data-markdown]')
            },
          },
          {
            src:
              'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.7.0/plugin/markdown/markdown.min.js',
            condition: function() {
              return !!document.querySelector('[data-markdown]')
            },
          },
          {
            src:
              'https://cdnjs.cloudflare.com/ajax/libs/reveal.js/3.7.0/plugin/notes/notes.min.js',
            async: true,
          },
        ],
      })
    }
  )
}
headScript.src =
  'https://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.min.js'

document.head.appendChild(headScript)
