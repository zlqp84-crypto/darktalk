import type { Instrumentation } from 'next';

// Fixed fields only. Never include error messages, request URLs, headers, cookies,
// tokens, account IDs or submitted content in application error telemetry.
export const onRequestError: Instrumentation.onRequestError = (_error, _request, context) => {
  console.error(JSON.stringify({
    event: 'server_request_failed',
    kind: ['render', 'route', 'action', 'proxy'].includes(context.routeType) ? context.routeType : 'unknown',
  }));
};
