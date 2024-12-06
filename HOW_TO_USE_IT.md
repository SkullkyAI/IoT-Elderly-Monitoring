# COMO HACER FUNCIONAR EL REPOSITORIO

## Instalaciones Basicas
- Angular
```bash
npm install -g @angular/cli
```

- Deno 2.0
- SurrealDB

## Ejecucion
### Front End

Para ejecutar el front en Angular 19 deberas ir a la carpeta de WaveSafe y iniciar el servidor npm

```bash
cd WaveSafe/
ng serve -o
```
## Backend
Para ejecutar el servidor deberas tener instalado Deno, minimo la version 2.0, entrar en la carpeta de WaveSafe-api y iniciar el servidor.
Para que el servidor funcione correctamente deberas rellenar el archibo .env
```bash
cd WaveSafe-api/

## modo desarrollador (Cuando guardas se hace build de nuevo)
deno task dev

## Ejecucion normal
deno run -A server.ts
```

## Base de datos
Para poner a funcionar la base de datos deberas tener instalado SurrealDB y deberas estar en la carpeta raiz del proyecto.

```bash
## Cuando estas en la carpeta raiz ejecuta este comando
surreal start -A --log debug surrealkv://./database/surrealdb.db
```