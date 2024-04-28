'use client'

import Giscus from '@giscus/react';

export default function GiscusComponent() {
  return (
    <Giscus
      repo="zackproser/portfolio"
      repoId="R_kgDOJaEONw"
      category="Announcements"
      categoryId="DIC_kwDOJaEON84CfAgN"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      theme="preferred_color_scheme"
      lang="en"
      crossorigin="anonymous"
    />
  );
}
