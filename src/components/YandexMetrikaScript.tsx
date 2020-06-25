import React from 'react';

/**
 * Reference:
 * https://yandex.ru/support/metrica/code/counter-initialize.html
 */
const SCRIPT_CODE = `
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
`;

function YandexMetrikaScript() {
  const isEnabled = Boolean(process.env.NEXT_PUBLIC_YANDEX_METRIKA_COUNTER_ID);

  return isEnabled ? (
    <script dangerouslySetInnerHTML={{ __html: SCRIPT_CODE }} />
  ) : null;
}

export default YandexMetrikaScript;
