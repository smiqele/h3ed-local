import type { AdminViewProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
// @ts-ignore
import { Gutter, Button } from '@payloadcms/ui'
import React from 'react'

import { Import } from './Import'

const ImportDataComponent: React.FC<AdminViewProps> = ({
  initPageResult,
  params,
  searchParams,
}) => {
  return (
    <DefaultTemplate
      i18n={initPageResult.req.i18n}
      locale={initPageResult.locale}
      params={params}
      payload={initPageResult.req.payload}
      permissions={initPageResult.permissions}
      searchParams={searchParams}
      user={initPageResult.req.user || undefined}
      visibleEntities={initPageResult.visibleEntities}
    >
      <Gutter>
        <h1>New Data</h1>
        <div>
          <Import />
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}

export default ImportDataComponent
