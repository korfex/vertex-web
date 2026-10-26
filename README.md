# Vertex

A Matrix client for the korfex team, focusing on a simple, elegant and
secure interface.

> [!NOTE]
> Vertex is a modified version of [Cinny](https://github.com/cinnyapp/cinny),
> forked from Cinny v4.12.8 on 2026-10-26. It is not affiliated with or
> endorsed by the Cinny project or the Matrix.org Foundation.

- [Contributing](./CONTRIBUTING.md)
- [Developing](./HACKING.md)

## Self-hosting
Download the tarball from [GitHub releases] and serve the files from
`dist/` using your preferred webserver.

* The default homeservers and explore pages are defined in [`config.json`](config.json).

* You need to set up redirects to serve the assests. Example configurations;
[netlify](netlify.toml), [nginx](contrib/nginx/vertex.domain.tld.conf),
[caddy](contrib/caddy/caddyfile).
    * If you have trouble configuring redirects you can
    [enable hash routing](config.json#L35) — the url in the browser will have
    a `/#/` between the domain and open channel (ie. `example.com/#/home/`
    instead of `example.com/home/`) but you won't have to configure your webserver.

* To deploy on subdirectory, you need to rebuild the app youself after
updating the `base` path in [`build.config.ts`](build.config.ts).
    * For example, if you want to deploy on `https://example.com/app`, then
    set `base: '/app'`.

* The app is licensed under the AGPL. If you host it for others, they must be
able to get the source code of the version you are running. The in-app
"Source Code" links point to this repository; update them if you deploy
your own modifications.

[GitHub releases]: https://github.com/korfex/vertex-web/releases/latest

## License
Vertex  
Copyright © 2026–present Korfex Softworks  
https://github.com/korfex/vertex-web  

Based on the Cinny Project  
Copyright © 2024–present Ajay Bura  
https://cinny.in  

Vertex is licensed under the GNU Affero General Public License,
Version 3 of the License (AGPL-3.0-only).
You may obtain a copy of the License at https://www.gnu.org/licenses/agpl-3.0.html
