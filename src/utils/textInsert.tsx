interface Ref { 
  value: string
  selectionStart: number
  selectionEnd: any
  scrollTop: any
  focus: () => void
}

function insert($ref: Ref, prefix: string | any[], hint = '', subfix = '') {
  const value = $ref.value
  if ($ref.selectionStart || $ref.selectionStart === 0) {
    const start = $ref.selectionStart
    const end = $ref.selectionEnd

    const restoreTop = $ref.scrollTop

    if (start === end) {
      $ref.value =
        value.substring(0, start) +
        prefix +
        hint +
        subfix +
        value.substring(end, value.length)
      $ref.selectionStart = start + prefix.length
      $ref.selectionEnd = end + prefix.length + hint.length
    } else {
      $ref.value =
        value.substring(0, start) +
        prefix +
        value.substring(start, end) +
        subfix +
        value.substring(end, value.length)
      $ref.selectionStart = start + prefix.length
      $ref.selectionEnd = end + prefix.length
    }

    $ref.focus()
    if (restoreTop >= 0) {
      $ref.scrollTop = restoreTop
    }
  }
}

const toolbar = {
  h1($ref: Ref) {
    insert($ref, '<h1>Your text</h1>')
  },
  h2($ref: Ref) {
    insert($ref, '<h2>Your text</h2>')
  },
  h3($ref: Ref) {
    insert($ref, '<h3>Your text</h3>')
  },
  h4($ref: Ref) {
    insert($ref, '<h4>Your text</h4>')
  },
  image($ref: Ref) {
    insert($ref, '![alt](', 'url', ')')
  },
  link($ref: Ref) {
    insert($ref, '[title](', 'url', ')')
  },
  code($ref: Ref) {
    insert($ref, '```', 'language', '\n\n```')
  },
  tab($ref: Ref) {
    insert($ref, '  ')
  },
  p($ref: Ref) {
    insert($ref, '<p>Your text</p>')
  },
}

export default ($ref: any, type: string | number) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return toolbar[type]($ref)
}