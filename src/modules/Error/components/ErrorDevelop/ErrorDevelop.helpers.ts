import { request } from '@tager/web-core';

import { SentryIssueResponse } from './ErrorDevelop.types';

export async function getErrorDetails(id: string) {
  return (await getIssueById(id))?.data;
}

function getIssueById(id: string): Promise<{ data: SentryIssueResponse }> {
  return request.get({ path: `/tager/sentry-issue/${id}` });
}

export function getFailureMessage(code: number, message: string) {
  if (code === 404) return 'Tager Backend Sentry module is not installed';
  else return message;
}
