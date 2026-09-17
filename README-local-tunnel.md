# Puente local para GetCID

El servidor escucha solo en `127.0.0.1:4181`. Para publicarlo temporalmente con Cloudflare Quick Tunnel:

```sh
PUBLIC_ORIGIN=https://fyramirez.dev node server.mjs
cloudflared tunnel --url http://127.0.0.1:4181 --no-autoupdate
```

Quick Tunnel asigna una URL aleatoria y cambia al reiniciar. Para una URL estable (`api.fyramirez.dev`) hay que crear un túnel administrado en Cloudflare, agregar la ruta `api.fyramirez.dev -> http://127.0.0.1:4181`, cambiar los nameservers de `fyramirez.dev` en Name.com a los dos que indique Cloudflare y mantener el proceso activo en la laptop.

No guardes tokens de Cloudflare en este repositorio.
