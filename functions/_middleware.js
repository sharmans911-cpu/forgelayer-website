/**
 * ForgeLayer — close the *.pages.dev back door
 *
 * Put this file at:  functions/_middleware.js   (in the repo root)
 *
 * Why this exists:
 *   Cloudflare Pages serves the same site at BOTH your custom domain and
 *   <project>.pages.dev. A Cloudflare Access policy on forgelayer.online does
 *   NOT cover the pages.dev address — so the site stays publicly reachable there.
 *   The Pages "Access policy" setting only covers PREVIEW deployments
 *   (<hash>.<project>.pages.dev), not the production pages.dev URL.
 *
 * What it does:
 *   Any request arriving on a *.pages.dev hostname is 301-redirected to the
 *   canonical domain, preserving path and query. Access then gates it as normal.
 *   Requests on forgelayer.online pass straight through, untouched.
 *
 * Side benefit: kills the duplicate-content problem. Search engines that
 * indexed the pages.dev copy will consolidate onto the real domain.
 *
 * To remove later: delete this file and redeploy.
 */

const CANONICAL_HOST = 'forgelayer.online';

export async function onRequest(context) {
  const { request, next } = context;

  const url = new URL(request.url);
  const host = (request.headers.get('host') || url.hostname).toLowerCase();

  // Strip any port, then check whether this is a *.pages.dev hostname.
  const bare = host.split(':')[0];
  const isPagesDev = bare === 'pages.dev' || bare.endsWith('.pages.dev');

  if (isPagesDev) {
    const target = new URL(url.toString());
    target.hostname = CANONICAL_HOST;
    target.protocol = 'https:';
    target.port = '';

    return new Response(null, {
      status: 301,
      headers: {
        Location: target.toString(),
        // Never let this redirect, or the pages.dev copy, be cached or indexed.
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    });
  }

  return next();
}
