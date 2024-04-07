# Leah Andrew Optix Tech Test

## Local Development:

Frontend:

- `cd frontend`
- `npm install`
- `npm start`

### Further Improvements

- Use a library for fetching data (ex: react-query or SWR) within data hooks to better handle caching/errors/loading states.
- Add a loading buffer (around 2 seconds) so the page isn't so jumpy when awaiting a response from api.
- Writing test for the api file.

  - Create tests for happy / sad path results for GET and POST request.

Backend:

- `cd backend`
- `npm install`
- `npm start`

## Deployment:

    Run
    - docker compose up

For simplicity, I've chosen to 'deploy' the built frontend within a docker container utilizing the package [http-server](https://www.npmjs.com/package/http-server).

In production I would host the built frontend application with Azure Static Web Apps or AWS S3.
